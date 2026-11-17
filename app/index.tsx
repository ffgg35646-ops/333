import { Image, ImageBackground, Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions, type ScrollViewInstance } from "react-native";
import { useEffect, useRef, useState } from "react";
import { router } from "expo-router";
import { useServices } from "../hooks/useServices";
import { useSiteSettings } from "../hooks/useSiteSettings";
import { serviceCategories, type ServiceItem } from "../data/services";
import { SiteFooter, SiteHeader } from "../components/SiteShell";

const HERO_IMAGES = [
  "https://raw.githubusercontent.com/ffgg35646-ops/333/main/%D8%AA%D8%A3%D9%85%D9%8A%D9%86%20%D8%AD%D9%81%D9%84%D8%A7%D8%AA.jpg",
  "https://raw.githubusercontent.com/ffgg35646-ops/333/main/%D9%85%D8%AF%D8%B1%D8%A8%20%D9%8A%D9%88%D8%AC%D8%A7.jpg",
  "https://raw.githubusercontent.com/ffgg35646-ops/333/main/%D9%85%D9%88%D8%B3%D9%8A%D9%82%D9%8A%20%D9%88%D8%AF%D9%8A%20%D8%AC%D9%8A.jpg",
  "https://raw.githubusercontent.com/ffgg35646-ops/333/main/%D8%AD%D9%85%D8%A7%D9%85%D8%A7%D8%AA.jpg",
  "https://raw.githubusercontent.com/ffgg35646-ops/333/main/%D9%85%D8%AE%D8%A7%D8%B2%D9%86%20%D9%88%D9%85%D8%B3%D8%AA%D9%88%D8%AF%D8%B9%D8%A7%D8%AA.jpg",
  "https://raw.githubusercontent.com/ffgg35646-ops/333/main/%D8%AA%D8%AC%D8%AF%D9%8A%D8%AF%20%D9%88%D8%AA%D8%B1%D9%85%D9%8A%D9%85.jpg",
  "https://raw.githubusercontent.com/ffgg35646-ops/333/main/%D8%AA%D8%A3%D8%AC%D9%8A%D8%B1%20%D9%85%D8%B9%D8%AF%D8%A7%D8%AA%20%D8%B7%D8%A8%D9%8A%D8%B9.jpg",
  "https://raw.githubusercontent.com/ffgg35646-ops/333/main/%D8%AD%D9%81%D9%84%D8%A7%D8%AA%20%D9%88%D9%85%D9%86%D8%A7%D8%B3%D8%A8%D8%A7%D8%AA.jpg",
  "https://raw.githubusercontent.com/ffgg35646-ops/333/main/%D9%86%D9%82%D9%84%20%D9%85%D9%86%D8%A7%D8%B2%D9%84.jpg",
  "https://raw.githubusercontent.com/ffgg35646-ops/333/main/%D8%AC%D8%A7%D9%85%D8%B9%20%D8%A7%D9%84%D9%82%D9%85%D8%A7%D9%85%D8%A9.jpg"
];

function ServiceCard({ item, width }: { item: ServiceItem; width: number }) {
  return (
    <View style={[styles.card, { width }]}>
      <Pressable onPress={() => router.push(("https://raw.githubusercontent.com/ffgg35646-ops/333/main/service?id=" + item.id) as never)} accessibilityRole="button">
        <Image source={{ uri: item.image }} style={styles.cardImage} resizeMode="cover" />
        <View style={styles.cardBody}>
          <View style={styles.cardTitleRow}>
            <Text style={styles.cardIcon}>{item.icon}</Text>
            <Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text>
          </View>
          <Text style={styles.cardEnglish} numberOfLines={1}>{item.english}</Text>
          <Text style={styles.cardDescription} numberOfLines={2}>{item.shortDescription}</Text>
        </View>
      </Pressable>
      <Pressable
        onPress={() => router.push(("https://raw.githubusercontent.com/ffgg35646-ops/333/main/request-service?service=" + item.id) as never)}
        style={styles.orderButton}
        accessibilityRole="button"
        accessibilityLabel={"اطلب خدمة " + item.title}
      >
        <Text style={styles.orderButtonText}>اطلب الخدمة</Text>
        <Text style={styles.orderArrow}>←</Text>
      </Pressable>
    </View>
  );
}

function AutoServiceCarousel({ items, cardWidth }: { items: ServiceItem[]; cardWidth: number }) {
  const scrollRef = useRef<ScrollViewInstance>(null);
  const offsetRef = useRef(0);
  const viewportRef = useRef(0);
  const contentRef = useRef(0);

  useEffect(() => {
    if (items.length < 2) return;
    const step = cardWidth + 14;
    const timer = setInterval(() => {
      const cycleWidth = contentRef.current / 2;
      if (cycleWidth <= 0) return;
      let nextOffset = offsetRef.current + step;
      if (nextOffset >= cycleWidth) {
        nextOffset -= cycleWidth;
        scrollRef.current?.scrollTo({ x: nextOffset, y: 0, animated: false });
      } else {
        scrollRef.current?.scrollTo({ x: nextOffset, y: 0, animated: true });
      }
      offsetRef.current = nextOffset;
    }, 10000);
    return () => clearInterval(timer);
  }, [items.length, cardWidth]);

  return (
    <ScrollView
      ref={scrollRef}
      horizontal
      directionalLockEnabled
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.horizontalCards}
      style={styles.horizontalScroller}
      scrollEventThrottle={16}
      onLayout={event => { viewportRef.current = event.nativeEvent.layout.width; }}
      onContentSizeChange={width => { contentRef.current = width; }}
      onScroll={event => { offsetRef.current = event.nativeEvent.contentOffset.x; }}
    >
      {[...items, ...items].map((item, index) => <ServiceCard key={`${item.id}-${index}`} item={item} width={cardWidth} />)}
    </ScrollView>
  );
}

export default function HomeScreen() {
  const { width } = useWindowDimensions();
  const { mainServices } = useServices();
  const settings = useSiteSettings();
  const [heroIndex, setHeroIndex] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setHeroIndex(current => (current + 1) % HERO_IMAGES.length), 10000);
    return () => clearInterval(timer);
  }, []);
  const compact = width < 700;
  const cardWidth = compact ? Math.min(width * 0.72, 292) : width < 1050 ? 276 : 286;
  const categoryOrder = ["maintenance", "cleaning", "personal-care", "healthcare", "professional-technical", "events", "moving-logistic", "safety-security"];
  const categorySections = [...serviceCategories]
    .sort((a, b) => categoryOrder.indexOf(a.id) - categoryOrder.indexOf(b.id))
    .map(category => ({
      ...category,
      items: mainServices
        .filter(item => item.active !== false && item.categoryId === category.id)
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    }))
    .filter(category => category.items.length > 0);

  return (
    <View style={styles.page}>
      <SiteHeader active="home" />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.heroOuter}>
          <ImageBackground source={{ uri: HERO_IMAGES[heroIndex] }} resizeMode="cover" style={[styles.hero, compact && styles.heroCompact]}>
            <View style={styles.heroShade} />
            <View style={[styles.heroContent, compact && styles.heroContentCompact]}>
              <View style={styles.eyebrow}><Text style={styles.eyebrowText}>خدماتي · KHADAMATI</Text></View>
              <Text style={[styles.heroTitle, compact && styles.heroTitleCompact]}>{settings.heroTitle}</Text>
              <Text style={[styles.heroText, compact && styles.heroTextCompact]}>{settings.heroSubtitle}</Text>
              <View style={styles.heroActions}>
                <Pressable onPress={() => router.push("https://raw.githubusercontent.com/ffgg35646-ops/333/main/services" as never)} style={styles.primaryButton}><Text style={styles.primaryButtonText}>اكتشف الخدمات ←</Text></Pressable>
                <Pressable onPress={() => router.push("https://raw.githubusercontent.com/ffgg35646-ops/333/main/request-service" as never)} style={styles.secondaryButton}><Text style={styles.secondaryButtonText}>اطلب خدمة الآن</Text></Pressable>
              </View>
              <View style={styles.heroStats}>
                <View><Text style={styles.statNumber}>{serviceCategories.length}</Text><Text style={styles.statLabel}>أقسام رئيسية</Text></View>
                <View style={styles.statDivider} />
                <View><Text style={styles.statNumber}>{mainServices.filter(item => item.active !== false).length}</Text><Text style={styles.statLabel}>خدمة متاحة</Text></View>
                <View style={styles.statDivider} />
                <View><Text style={styles.statNumber}>3</Text><Text style={styles.statLabel}>منصات في تجربة واحدة</Text></View>
              </View>
            </View>
          </ImageBackground>
        </View>

        <View style={styles.introStrip}>
          <View style={styles.introCopy}>
            <Text style={styles.introKicker}>أهلاً بيك في خدماتي</Text>
            <Text style={styles.introTitle}>اختار الخدمة المناسبة ليك واحنا نتولى الباقي</Text>
            <Text style={styles.introText}>تصفح الأقسام، شوف تفاصيل كل خدمة، واطلبها بسهولة.</Text>
          </View>
          <Pressable onPress={() => router.push("https://raw.githubusercontent.com/ffgg35646-ops/333/main/services" as never)} style={styles.introLink}><Text style={styles.introLinkText}>كل الخدمات ←</Text></Pressable>
        </View>

        <View style={styles.trustStrip}>
          <View style={styles.trustItem}><Text style={styles.trustIcon}>✓</Text><Text style={styles.trustText}>خدمات متنوعة</Text></View>
          <View style={styles.trustItem}><Text style={styles.trustIcon}>⌂</Text><Text style={styles.trustText}>للمنزل والعمل</Text></View>
          <View style={styles.trustItem}><Text style={styles.trustIcon}>♡</Text><Text style={styles.trustText}>تجربة سهلة وواضحة</Text></View>
        </View>

        {categorySections.map(category => (
          <View key={category.id} style={styles.section}>
            <View style={styles.sectionHeading}>
              <View style={styles.sectionTitleGroup}>
                <Text style={styles.sectionKicker}>{category.english}</Text>
                <Text style={styles.sectionTitle}>{category.title}</Text>
                <Text style={styles.sectionSubtitle}>اكتشف خدمات القسم · {category.items.length} خدمة</Text>
              </View>
              <Pressable onPress={() => router.push("https://raw.githubusercontent.com/ffgg35646-ops/333/main/services" as never)} style={styles.textLink}>
                <Text style={styles.textLinkText}>عرض الكل ←</Text>
              </Pressable>
            </View>
            <AutoServiceCarousel items={category.items} cardWidth={cardWidth} />
          </View>
        ))}

        <View style={styles.ctaWrap}>
          <View style={[styles.cta, compact && styles.ctaCompact]}>
            <View style={styles.ctaCopy}><Text style={styles.ctaKicker}>KHADAMATI</Text><Text style={styles.ctaTitle}>خدمتك تبدأ من هنا</Text><Text style={styles.ctaText}>اختار الخدمة اللي محتاجها، وسجّل بياناتك، وفريقنا هيتواصل معاك قريبًا.</Text></View>
            <Pressable onPress={() => router.push("https://raw.githubusercontent.com/ffgg35646-ops/333/main/request-service" as never)} style={styles.ctaButton}><Text style={styles.ctaButtonText}>اطلب خدمتك الآن ←</Text></Pressable>
          </View>
        </View>
        <SiteFooter />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: "#F2FAFE" },
  heroOuter: { backgroundColor: "#F2FAFE", paddingHorizontal: 24, paddingTop: 26, paddingBottom: 18 },
  hero: { width: "100%", maxWidth: 1240, minHeight: 430, alignSelf: "center", justifyContent: "center", overflow: "hidden", borderRadius: 26, backgroundColor: "#087FC1" },
  heroCompact: { minHeight: 470, borderRadius: 18 },
  heroShade: { ...StyleSheet.absoluteFill, backgroundColor: "rgba(52, 137, 180, 0.68)" },
  heroContent: { width: "100%", maxWidth: 760, paddingHorizontal: 54, paddingVertical: 48, alignItems: "flex-start" },
  heroContentCompact: { paddingHorizontal: 23, paddingVertical: 34 },
  eyebrow: { borderWidth: 1, borderColor: "rgba(255,255,255,0.42)", borderRadius: 30, paddingHorizontal: 13, paddingVertical: 7, marginBottom: 18 },
  eyebrowText: { color: "#D2E9E3", fontSize: 10, fontWeight: "900", letterSpacing: 1.5 },
  heroTitle: { color: "#FFFFFF", fontSize: 44, fontWeight: "900", textAlign: "right", lineHeight: 59 },
  heroTitleCompact: { fontSize: 32, lineHeight: 45 },
  heroText: { color: "#E2E8E5", fontSize: 16, lineHeight: 29, textAlign: "right", maxWidth: 570, marginTop: 13 },
  heroTextCompact: { fontSize: 14, lineHeight: 26 },
  heroActions: { flexDirection: "row", flexWrap: "wrap", gap: 11, marginTop: 25 },
  primaryButton: { backgroundColor: "#078BCB", borderRadius: 11, paddingVertical: 13, paddingHorizontal: 20 },
  primaryButtonText: { color: "#123B56", fontSize: 13, fontWeight: "900" },
  secondaryButton: { borderWidth: 1, borderColor: "rgba(255,255,255,0.65)", borderRadius: 11, paddingVertical: 13, paddingHorizontal: 20 },
  secondaryButtonText: { color: "#FFFFFF", fontSize: 13, fontWeight: "800" },
  heroStats: { flexDirection: "row", alignItems: "center", gap: 20, marginTop: 32 },
  statNumber: { color: "#FFFFFF", fontSize: 22, fontWeight: "900", textAlign: "right" },
  statLabel: { color: "#D1DBD7", fontSize: 10, marginTop: 3, textAlign: "right" },
  statDivider: { width: 1, height: 34, backgroundColor: "rgba(255,255,255,0.3)" },
  introStrip: { width: "100%", maxWidth: 1190, alignSelf: "center", paddingHorizontal: 28, paddingTop: 34, paddingBottom: 30, flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 18 },
  introCopy: { flex: 1, alignItems: "flex-start" },
  introKicker: { color: "#078BCB", fontSize: 12, fontWeight: "900", textAlign: "right" },
  introTitle: { color: "#303A39", fontSize: 22, fontWeight: "900", textAlign: "right", marginTop: 6 },
  introText: { color: "#78817E", fontSize: 12, marginTop: 7, textAlign: "right" },
  introLink: { paddingHorizontal: 14, paddingVertical: 11, borderRadius: 10, backgroundColor: "#E4F5FC" },
  introLinkText: { color: "#078BCB", fontSize: 12, fontWeight: "900" },
  trustStrip: { width: "100%", maxWidth: 1150, alignSelf: "center", paddingHorizontal: 22, paddingVertical: 17, flexDirection: "row", justifyContent: "space-around", flexWrap: "wrap", gap: 16, borderTopWidth: 1, borderBottomWidth: 1, borderColor: "#E8E9E4" },
  trustItem: { flexDirection: "row", alignItems: "center", gap: 8 },
  trustIcon: { color: "#078BCB", fontSize: 18, fontWeight: "900" },
  trustText: { color: "#626E6A", fontSize: 12, fontWeight: "700" },
  section: { width: "100%", maxWidth: 1240, alignSelf: "center", paddingHorizontal: 28, paddingTop: 42, paddingBottom: 18 },
  sectionHeading: { flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between", gap: 14, marginBottom: 18 },
  sectionTitleGroup: { alignItems: "flex-start", flex: 1 },
  sectionKicker: { color: "#4AAFD8", fontSize: 10, fontWeight: "900", letterSpacing: 1.5, textAlign: "right" },
  sectionTitle: { color: "#123B56", fontSize: 24, fontWeight: "900", marginTop: 5, textAlign: "right" },
  sectionSubtitle: { color: "#8A918D", fontSize: 12, marginTop: 6, textAlign: "right" },
  textLink: { paddingVertical: 8, paddingHorizontal: 3 },
  textLinkText: { color: "#078BCB", fontWeight: "900", fontSize: 12 },
  horizontalScroller: { width: "100%", flexGrow: 0, flexShrink: 1, overflow: "hidden", direction: "ltr" },
  horizontalCards: { flexDirection: "row", gap: 14, paddingBottom: 12, paddingRight: 1, direction: "ltr" },
  card: { backgroundColor: "#FFFFFF", borderRadius: 15, overflow: "hidden", borderWidth: 1, borderColor: "#E9EBE6", shadowColor: "#303B36", shadowOpacity: 0.045, shadowRadius: 9, shadowOffset: { width: 0, height: 3 }, elevation: 1 },
  cardImage: { width: "100%", height: 148, backgroundColor: "#E7EAE5" },
  cardBody: { paddingHorizontal: 14, paddingTop: 13, paddingBottom: 8, alignItems: "flex-start" },
  cardTitleRow: { width: "100%", flexDirection: "row", alignItems: "center", gap: 8 },
  cardIcon: { fontSize: 16 },
  cardTitle: { color: "#38423E", fontSize: 14, fontWeight: "900", textAlign: "right", flex: 1 },
  cardEnglish: { color: "#A0A7A1", fontSize: 9, marginTop: 4, textAlign: "right" },
  cardDescription: { color: "#77817B", fontSize: 11, lineHeight: 18, marginTop: 8, textAlign: "right", minHeight: 36 },
  orderButton: { marginHorizontal: 13, marginBottom: 13, minHeight: 39, borderRadius: 9, backgroundColor: "#E4F5FC", flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 7 },
  orderButtonText: { color: "#078BCB", fontSize: 12, fontWeight: "900" },
  orderArrow: { color: "#078BCB", fontSize: 15, fontWeight: "900" },
  ctaWrap: { paddingHorizontal: 18, paddingTop: 32, paddingBottom: 10 },
  cta: { width: "100%", maxWidth: 1200, alignSelf: "center", backgroundColor: "#EDF2FF", borderRadius: 20, paddingHorizontal: 30, paddingVertical: 27, flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 20 },
  ctaCompact: { flexDirection: "column", alignItems: "flex-start", paddingHorizontal: 22 },
  ctaCopy: { maxWidth: 650, alignItems: "flex-start" },
  ctaKicker: { color: "#4AAFD8", fontSize: 10, fontWeight: "900", letterSpacing: 1.5 },
  ctaTitle: { color: "#123B56", fontSize: 23, fontWeight: "900", marginTop: 7, textAlign: "right" },
  ctaText: { color: "#707C75", fontSize: 12, lineHeight: 22, marginTop: 7, textAlign: "right" },
  ctaButton: { backgroundColor: "#078BCB", borderRadius: 10, paddingHorizontal: 20, paddingVertical: 14 },
  ctaButtonText: { color: "#123B56", fontWeight: "900", fontSize: 12 }
});
