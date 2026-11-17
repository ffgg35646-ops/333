import { Image, ImageBackground, Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions, type ScrollViewInstance } from "react-native";
import { useEffect, useRef, useState } from "react";
import { router } from "expo-router";
import { useServices } from "../hooks/useServices";
import { useSiteSettings } from "../hooks/useSiteSettings";
import { serviceCategories, type ServiceItem } from "../data/services";
import { SiteFooter, SiteHeader } from "../components/SiteShell";

// React Native Web forwards these browser image hints; native builds safely ignore them.
const FastImage = Image as any;
const FastImageBackground = ImageBackground as any;

const HERO_IMAGES = [
  "https://cdn.jsdelivr.net/gh/ffgg35646-ops/333@main/%D9%86%D9%82%D9%84%20%D8%A7%D8%AB%D8%A7%D8%AB.jpg",
  "https://cdn.jsdelivr.net/gh/ffgg35646-ops/333@main/%D9%86%D9%82%D9%84%20%D9%85%D9%86%D8%A7%D8%B2%D9%84.jpg",
  "https://cdn.jsdelivr.net/gh/ffgg35646-ops/333@main/%D9%85%D9%87%D9%86%D8%AF%D8%B3%20%D9%85%D8%B9%D9%85%D8%A7%D8%B1%D9%8A.jpg",
  "https://cdn.jsdelivr.net/gh/ffgg35646-ops/333@main/%D8%AE%D8%AF%D9%85%D8%A7%D8%AA%20%D8%A7%D9%84%D8%AA%D9%83%D9%86%D9%88%D9%84%D9%88%D8%AC%D9%8A%D8%A7%20%D9%88%D8%A7%D9%84%D8%A8%D8%B1%D9%85%D8%AC%D9%8A%D8%A7%D8%AA.jpg",
  "https://cdn.jsdelivr.net/gh/ffgg35646-ops/333@main/%D8%B2%D9%8A%D8%A7%D8%B1%D8%A9%20%D8%B7%D8%A8%D9%8A%D8%A8%20%D8%A7%D9%84%D9%85%D9%86%D8%B2%D9%84.jpg",
  "https://cdn.jsdelivr.net/gh/ffgg35646-ops/333@main/%D8%AA%D9%85%D8%B1%D9%8A%D8%B6%20%D9%85%D9%86%D8%B2%D9%84%D9%8A.jpg",
  "https://cdn.jsdelivr.net/gh/ffgg35646-ops/333@main/%D8%AA%D9%86%D8%B6%D9%8A%D9%81%20%D9%85%D9%83%D8%A7%D8%AA%D8%A8.jpg",
  "https://cdn.jsdelivr.net/gh/ffgg35646-ops/333@main/%D8%AA%D9%86%D8%B6%D9%8A%D9%81%20%D8%A7%D9%84%D9%85%D9%81%D8%B1%D9%88%D8%B4%D8%A7%D8%AA.jpg",
  "https://cdn.jsdelivr.net/gh/ffgg35646-ops/333@main/%D9%83%D9%87%D8%B1%D8%A8%D8%A7%D8%A6%D9%8A.jpg",
  "https://cdn.jsdelivr.net/gh/ffgg35646-ops/333@main/%D8%B5%D9%8A%D8%A7%D9%86%D8%A9%20%D8%AA%D9%83%D9%8A%D9%8A%D9%81.jpg"
];

function ServiceCard({ item, width }: { item: ServiceItem; width: number }) {
  const compactCard = width < 200;
  return (
    <View style={[styles.card, { width }]}>
      <Pressable onPress={() => router.push(("/service?id=" + item.id) as never)} accessibilityRole="button">
        <FastImage source={{ uri: item.image }} style={[styles.cardImage, compactCard && styles.cardImageCompact]} resizeMode="cover" loading="lazy" decoding="async" />
        <View style={[styles.cardBody, compactCard && styles.cardBodyCompact]}>
          <View style={[styles.cardTitleGlass, compactCard && styles.cardTitleGlassCompact]}>
            <View style={styles.cardTitleRow}>
              <Text style={[styles.cardIcon, compactCard && styles.cardIconCompact]}>{item.icon}</Text>
              <Text style={[styles.cardTitle, compactCard && styles.cardTitleCompact]} numberOfLines={1}>{item.title}</Text>
            </View>
          </View>
        </View>
      </Pressable>
      <Pressable
        onPress={() => router.push(("/request-service?service=" + item.id) as never)}
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
    // Keep the first hero image urgent, then warm only the next two slides.
    Image.prefetch(HERO_IMAGES[heroIndex]).catch(() => {});
    Image.prefetch(HERO_IMAGES[(heroIndex + 1) % HERO_IMAGES.length]).catch(() => {});
    Image.prefetch(HERO_IMAGES[(heroIndex + 2) % HERO_IMAGES.length]).catch(() => {});
  }, [heroIndex]);
  useEffect(() => {
    const timer = setInterval(() => setHeroIndex(current => (current + 1) % HERO_IMAGES.length), 5000);
    return () => clearInterval(timer);
  }, []);
  const compact = width < 700;
  const cardWidth = compact ? Math.max(153, (width - 60) / 2) : width < 1050 ? 300 : 318;
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
        <View style={[styles.heroOuter, compact && styles.heroOuterCompact]}>
          <FastImageBackground source={{ uri: HERO_IMAGES[heroIndex] }} resizeMode="cover" loading="eager" style={[styles.hero, compact && styles.heroCompact]}>
            <View style={styles.heroShade} />
            <View style={[styles.heroContent, compact && styles.heroContentCompact]}>
              <View style={styles.heroCopy}>
                <Text style={[styles.heroTitle, compact && styles.heroTitleCompact]}>خدمات متكاملة <Text style={styles.heroAccent}>.. لحياة أسهل</Text></Text>
                <Text style={[styles.heroText, compact && styles.heroTextCompact]}>نقدم لك أفضل الخدمات بجودة عالية واحترافية</Text>
                <View style={[styles.heroCategoryRow, compact && styles.heroCategoryRowCompact]}>
                  {[
                    { id: "maintenance", label: "الصيانة", icon: "🔧" },
                    { id: "cleaning", label: "خدمات التنظيف", icon: "🧹" },
                    { id: "healthcare", label: "الرعاية الصحية", icon: "✚" },
                    { id: "professional-technical", label: "خدمات مهنية وتقنية", icon: "🧰" },
                    { id: "moving-logistic", label: "نقل الأثاث والعفش", icon: "🚚" }
                  ].map(category => (
                    <Pressable key={category.id} onPress={() => router.push(("/services?category=" + category.id) as never)} style={[styles.heroCategory, compact && styles.heroCategoryCompact, compact && { width: Math.floor((width - 46) / 5) }]} accessibilityRole="button">
                      <Text style={[styles.heroCategoryIcon, compact && styles.heroCategoryIconCompact]}>{category.icon}</Text>
                      <Text style={[styles.heroCategoryText, compact && styles.heroCategoryTextCompact]} numberOfLines={2}>{category.label}</Text>
                    </Pressable>
                  ))}
                </View>
                <Pressable onPress={() => router.push("/services" as never)} style={styles.primaryButton}>
                  <Text style={styles.primaryButtonText}>اكتشف خدماتنا  ←</Text>
                </Pressable>
              </View>
              <View style={styles.heroDots}>
                {HERO_IMAGES.map((_, i) => (
                  <Pressable key={i} onPress={() => setHeroIndex(i)} accessibilityRole="button" accessibilityLabel={"الصورة " + (i + 1)} style={[styles.heroDot, heroIndex === i && styles.heroDotActive]} />
                ))}
              </View>
            </View>
          </FastImageBackground>
        </View>

        <View style={styles.introStrip}>
          <View style={styles.introCopy}>
            <Text style={styles.introKicker}>أهلاً بيك في خدماتي</Text>
            <Text style={styles.introTitle}>اختار الخدمة المناسبة ليك واحنا نتولى الباقي</Text>
            <Text style={styles.introText}>تصفح الأقسام، شوف تفاصيل كل خدمة، واطلبها بسهولة.</Text>
          </View>
          <Pressable onPress={() => router.push("/services" as never)} style={styles.introLink}><Text style={styles.introLinkText}>كل الخدمات ←</Text></Pressable>
        </View>

        <View style={styles.trustStrip}>
          <View style={styles.trustItem}><Text style={styles.trustIcon}>✓</Text><Text style={styles.trustText}>خدمات متنوعة</Text></View>
          <View style={styles.trustItem}><Text style={styles.trustIcon}>⌂</Text><Text style={styles.trustText}>للمنزل والعمل</Text></View>
          <View style={styles.trustItem}><Text style={styles.trustIcon}>♡</Text><Text style={styles.trustText}>تجربة سهلة وواضحة</Text></View>
        </View>

        {categorySections.map(category => (
          <View key={category.id} style={styles.section}>
            <View style={[styles.sectionHeading, compact && styles.sectionHeadingCompact]}>
              <View style={[styles.sectionTitleGroup, compact && styles.sectionTitleGroupCompact]}>
                <Text style={styles.sectionKicker}>{category.english}</Text>
                <Text style={styles.sectionTitle}>{category.title}</Text>
              </View>
              <Pressable onPress={() => router.push("/services" as never)} style={styles.textLink}>
                <Text style={styles.textLinkText}>عرض الكل ←</Text>
              </Pressable>
            </View>
            <AutoServiceCarousel items={category.items} cardWidth={cardWidth} />
          </View>
        ))}

        <View style={styles.ctaWrap}>
          <View style={[styles.cta, compact && styles.ctaCompact]}>
            <View style={styles.ctaCopy}><Text style={styles.ctaKicker}>KHADAMATI</Text><Text style={styles.ctaTitle}>خدمتك تبدأ من هنا</Text><Text style={styles.ctaText}>اختار الخدمة اللي محتاجها، وسجّل بياناتك، وفريقنا هيتواصل معاك قريبًا.</Text></View>
            <Pressable onPress={() => router.push("/request-service" as never)} style={styles.ctaButton}><Text style={styles.ctaButtonText}>اطلب خدمتك الآن ←</Text></Pressable>
          </View>
        </View>
        <SiteFooter />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: "#F5F7F6" },
  heroOuter: { backgroundColor: "#F5F7F6", paddingHorizontal: 0, paddingTop: 0, paddingBottom: 18 },
  heroOuterCompact: { paddingHorizontal: 12, paddingTop: 10, paddingBottom: 14 },
  hero: { width: "100%", maxWidth: 1600, minHeight: 650, alignSelf: "center", justifyContent: "center", overflow: "hidden", borderRadius: 0, backgroundColor: "#102A35" },
  heroCompact: { minHeight: 470, borderRadius: 22, overflow: "hidden" },
  heroShade: { ...StyleSheet.absoluteFill, backgroundColor: "rgba(5, 22, 31, 0.58)" },
  heroContent: { width: "100%", minHeight: 650, paddingHorizontal: 54, paddingVertical: 46, justifyContent: "center", alignItems: "flex-end" },
  heroContentCompact: { minHeight: 470, paddingHorizontal: 15, paddingVertical: 24, justifyContent: "center" },
  heroCopy: { width: "100%", maxWidth: 850, alignItems: "flex-end" },
  heroTitle: { color: "#FFFFFF", fontSize: 54, fontWeight: "900", textAlign: "right", lineHeight: 72, fontFamily: "Arial" },
  heroTitleCompact: { fontSize: 30, lineHeight: 43 },
  heroAccent: { color: "#12D4D0" },
  heroText: { color: "#FFFFFF", fontSize: 24, lineHeight: 36, textAlign: "right", marginTop: 12, fontFamily: "Arial" },
  heroTextCompact: { fontSize: 15, lineHeight: 25 },
  heroCategoryRow: { flexDirection: "row", flexWrap: "wrap", justifyContent: "flex-end", gap: 12, marginTop: 28, width: "100%" },
  heroCategoryRowCompact: { gap: 5, marginTop: 16, flexWrap: "nowrap" },
  heroCategory: { width: 145, minHeight: 130, paddingHorizontal: 8, paddingVertical: 13, borderRadius: 20, borderWidth: 1, borderColor: "rgba(210,245,248,0.38)", backgroundColor: "rgba(13,39,51,0.72)", alignItems: "center", justifyContent: "center" },
  heroCategoryCompact: { minHeight: 68, paddingHorizontal: 3, paddingVertical: 6, borderRadius: 11, borderWidth: 1, flexShrink: 1 },
  heroCategoryIcon: { color: "#FFFFFF", fontSize: 34, marginBottom: 9 },
  heroCategoryIconCompact: { fontSize: 19, marginBottom: 3 },
  heroCategoryText: { color: "#FFFFFF", fontSize: 14, fontWeight: "800", textAlign: "center", lineHeight: 21, fontFamily: "Arial" },
  heroCategoryTextCompact: { fontSize: 8, lineHeight: 11, fontWeight: "700" },
  primaryButton: { backgroundColor: "#08BDB8", borderRadius: 40, paddingVertical: 16, paddingHorizontal: 30, marginTop: 28, minWidth: 230, alignItems: "center" },
  primaryButtonText: { color: "#FFFFFF", fontSize: 17, fontWeight: "900", fontFamily: "Arial" },
  heroDots: { flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 11, marginTop: 34, alignSelf: "center" },
  heroDot: { width: 11, height: 11, borderRadius: 8, backgroundColor: "rgba(255,255,255,0.55)" },
  heroDotActive: { width: 19, height: 19, borderRadius: 10, backgroundColor: "#10D5D0" },
  introStrip: { width: "100%", maxWidth: 1190, alignSelf: "center", paddingHorizontal: 28, paddingTop: 34, paddingBottom: 30, flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 18 },
  introCopy: { flex: 1, alignItems: "flex-start" },
  introKicker: { color: "#0F766E", fontSize: 12, fontWeight: "900", textAlign: "right" , fontFamily: "Arial" },
  introTitle: { color: "#303A39", fontSize: 22, fontWeight: "900", textAlign: "right", marginTop: 6 , fontFamily: "Arial" },
  introText: { color: "#748078", fontSize: 12, marginTop: 7, textAlign: "right" , fontFamily: "Arial" },
  introLink: { paddingHorizontal: 14, paddingVertical: 11, borderRadius: 10, backgroundColor: "#E6F2EF" },
  introLinkText: { color: "#0F766E", fontSize: 12, fontWeight: "900" , fontFamily: "Arial" },
  trustStrip: { width: "100%", maxWidth: 1150, alignSelf: "center", paddingHorizontal: 22, paddingVertical: 17, flexDirection: "row", justifyContent: "space-around", flexWrap: "wrap", gap: 16, borderTopWidth: 1, borderBottomWidth: 1, borderColor: "#E1E8E3" },
  trustItem: { flexDirection: "row", alignItems: "center", gap: 8 },
  trustIcon: { color: "#0F766E", fontSize: 18, fontWeight: "900" , fontFamily: "Arial" },
  trustText: { color: "#626E6A", fontSize: 12, fontWeight: "700" , fontFamily: "Arial" },
  section: { width: "100%", maxWidth: 1240, alignSelf: "center", paddingHorizontal: 16, paddingTop: 30, paddingBottom: 14 },
  sectionHeading: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 14, marginBottom: 18, backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#DCE9E3", borderRadius: 17, paddingHorizontal: 20, paddingVertical: 15, shadowColor: "#173B38", shadowOpacity: 0.06, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 2 },
  sectionHeadingCompact: { paddingHorizontal: 15, paddingVertical: 13, marginBottom: 16 },
  sectionTitleGroup: { alignItems: "flex-start", flex: 1 },
  sectionTitleGroupCompact: { alignItems: "flex-end" },
  sectionKicker: { color: "#5FA69A", fontSize: 10, fontWeight: "900", letterSpacing: 1.5, textAlign: "right" , fontFamily: "Arial" },
  sectionTitle: { color: "#173B38", fontSize: 27, fontWeight: "900", marginTop: 5, textAlign: "right" , fontFamily: "Arial" },
  sectionSubtitle: { color: "#8A918D", fontSize: 12, marginTop: 6, textAlign: "right" , fontFamily: "Arial" },
  textLink: { paddingVertical: 8, paddingHorizontal: 3 },
  textLinkText: { color: "#0F766E", fontWeight: "900", fontSize: 12 , fontFamily: "Arial" },
  horizontalScroller: { width: "100%", flexGrow: 0, flexShrink: 1, overflow: "hidden", direction: "ltr" },
  horizontalCards: { flexDirection: "row", gap: 14, paddingBottom: 12, paddingRight: 1, direction: "ltr" },
  card: { backgroundColor: "#FFFFFF", borderRadius: 20, overflow: "hidden", borderWidth: 1, borderColor: "#E2E9E4", shadowColor: "#173B38", shadowOpacity: 0.07, shadowRadius: 16, shadowOffset: { width: 0, height: 7 }, elevation: 3 },
  cardImage: { width: "100%", height: 178, backgroundColor: "#E8EEEA" },
  cardImageCompact: { height: 168 },
  cardBody: { paddingHorizontal: 14, paddingTop: 12, paddingBottom: 13, alignItems: "flex-start", minHeight: 70, justifyContent: "center" },
  cardBodyCompact: { minHeight: 57, paddingHorizontal: 10, paddingTop: 9, paddingBottom: 9, justifyContent: "center", backgroundColor: "transparent" },
  cardTitleGlass: { width: "100%", paddingHorizontal: 11, paddingVertical: 10, borderRadius: 12, backgroundColor: "rgba(245,250,247,0.92)", borderWidth: 1, borderColor: "#E5EEE9" },
  cardTitleGlassCompact: { paddingHorizontal: 10, paddingVertical: 8, backgroundColor: "rgba(255,255,255,0.88)", borderColor: "#FFFFFF" },
  cardTitleRow: { width: "100%", flexDirection: "row", alignItems: "center", gap: 8 },
  cardIcon: { fontSize: 16 },
  cardIconCompact: { fontSize: 18 },
  cardTitle: { color: "#244A43", fontSize: 15, fontWeight: "900", textAlign: "right", flex: 1 , fontFamily: "Arial" },
  cardTitleCompact: { color: "#244A43", fontSize: 15, fontWeight: "900" , fontFamily: "Arial" },
  cardEnglish: { color: "#9AA69F", fontSize: 9, marginTop: 4, textAlign: "right" , fontFamily: "Arial" },
  cardDescription: { color: "#52645D", fontSize: 11, lineHeight: 19, marginTop: 9, textAlign: "right", minHeight: 38, width: "100%", paddingHorizontal: 9, paddingVertical: 7, borderRadius: 9, backgroundColor: "#F5F8F6", overflow: "hidden", fontFamily: "Arial" },
  orderButton: { marginHorizontal: 13, marginBottom: 13, minHeight: 39, borderRadius: 11, backgroundColor: "#E6F2EF", flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 7 },
  orderButtonText: { color: "#0F766E", fontSize: 12, fontWeight: "900" , fontFamily: "Arial" },
  orderArrow: { color: "#0F766E", fontSize: 15, fontWeight: "900" , fontFamily: "Arial" },
  ctaWrap: { paddingHorizontal: 18, paddingTop: 32, paddingBottom: 10 },
  cta: { width: "100%", maxWidth: 1200, alignSelf: "center", backgroundColor: "#E8F0EC", borderRadius: 24, paddingHorizontal: 32, paddingVertical: 30, flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 20 },
  ctaCompact: { flexDirection: "column", alignItems: "flex-start", paddingHorizontal: 22 },
  ctaCopy: { maxWidth: 650, alignItems: "flex-start" },
  ctaKicker: { color: "#5FA69A", fontSize: 10, fontWeight: "900", letterSpacing: 1.5 , fontFamily: "Arial" },
  ctaTitle: { color: "#173B38", fontSize: 23, fontWeight: "900", marginTop: 7, textAlign: "right" , fontFamily: "Arial" },
  ctaText: { color: "#66756E", fontSize: 12, lineHeight: 22, marginTop: 7, textAlign: "right" , fontFamily: "Arial" },
  ctaButton: { backgroundColor: "#0F766E", borderRadius: 10, paddingHorizontal: 20, paddingVertical: 14 },
  ctaButtonText: { color: "#173B38", fontWeight: "900", fontSize: 12 , fontFamily: "Arial" },
});
