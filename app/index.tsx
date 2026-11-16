import { Image, ImageBackground, Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { router } from "expo-router";
import { mainServices, featuredServices } from "../data/services";
import type { ServiceItem } from "../data/services";
import { SiteFooter, SiteHeader } from "../components/SiteShell";

function ServiceCard({ item, compact = false }: { item: ServiceItem; compact?: boolean }) {
  return (
    <Pressable onPress={() => router.push(("/service?id=" + item.id) as never)} style={[styles.card, compact && styles.cardCompact]}>
      <Image source={{ uri: item.image }} style={[styles.cardImage, compact && styles.cardImageCompact]} resizeMode="cover" />
      <View style={styles.cardBody}>
        <View style={styles.cardTitleRow}>
          <Text style={styles.cardIcon}>{item.icon}</Text>
          <Text style={styles.cardTitle}>{item.title}</Text>
        </View>
        <Text style={styles.cardEnglish}>{item.english}</Text>
        {!compact && <Text style={styles.cardDescription} numberOfLines={2}>{item.shortDescription}</Text>}
        <Text style={styles.cardMore}>التفاصيل <Text style={styles.arrow}>←</Text></Text>
      </View>
    </Pressable>
  );
}

export default function HomeScreen() {
  const { width } = useWindowDimensions();
  const compact = width < 700;
  const cardWidth = width > 1040 ? "23.5%" : width > 700 ? "31.5%" : "47.5%";
  return (
    <View style={styles.page}>
      <SiteHeader active="home" />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.heroOuter}>
          <ImageBackground source={{ uri: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1800&q=90" }} resizeMode="cover" style={[styles.hero, compact && styles.heroCompact]}>
            <View style={styles.heroShade} />
            <View style={[styles.heroContent, compact && styles.heroContentCompact]}>
              <View style={styles.eyebrow}><Text style={styles.eyebrowText}>KHADAMATI · خدماتي</Text></View>
              <Text style={[styles.heroTitle, compact && styles.heroTitleCompact]}>كل خدماتك في مكان واحد</Text>
              <Text style={[styles.heroText, compact && styles.heroTextCompact]}>من صيانة منزلك إلى تفاصيل يومك، اختَر الخدمة المناسبة واترك الباقي علينا.</Text>
              <View style={styles.heroActions}>
                <Pressable onPress={() => router.push("/services" as never)} style={styles.primaryButton}><Text style={styles.primaryButtonText}>استكشف الخدمات <Text>←</Text></Text></Pressable>
                <Pressable onPress={() => router.push("/request-service" as never)} style={styles.secondaryButton}><Text style={styles.secondaryButtonText}>اطلب خدمة الآن</Text></Pressable>
              </View>
              <View style={styles.heroStats}>
                <View><Text style={styles.statNumber}>14</Text><Text style={styles.statLabel}>خدمة رئيسية</Text></View>
                <View style={styles.statDivider} />
                <View><Text style={styles.statNumber}>14</Text><Text style={styles.statLabel}>خدمة مميزة</Text></View>
                <View style={styles.statDivider} />
                <View><Text style={styles.statNumber}>3</Text><Text style={styles.statLabel}>منصات في تجربة واحدة</Text></View>
              </View>
            </View>
          </ImageBackground>
        </View>

        <View style={styles.trustStrip}>
          <View style={styles.trustItem}><Text style={styles.trustIcon}>✓</Text><Text style={styles.trustText}>خدمات متنوعة</Text></View>
          <View style={styles.trustItem}><Text style={styles.trustIcon}>⌂</Text><Text style={styles.trustText}>للمنزل والعمل</Text></View>
          <View style={styles.trustItem}><Text style={styles.trustIcon}>♡</Text><Text style={styles.trustText}>تجربة سهلة وواضحة</Text></View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeading}>
            <View><Text style={styles.sectionKicker}>OUR MAIN SERVICES</Text><Text style={styles.sectionTitle}>خدماتنا الرئيسية</Text><Text style={styles.sectionSubtitle}>كل ما تحتاجه لصيانة وتجديد منزلك في مكان واحد.</Text></View>
            <Pressable onPress={() => router.push("/services" as never)} style={styles.textLink}><Text style={styles.textLinkText}>عرض كل الخدمات ←</Text></Pressable>
          </View>
          <View style={styles.cardsGrid}>
            {mainServices.map(item => <View key={item.id} style={{ width: cardWidth }}><ServiceCard item={item} /></View>)}
          </View>
        </View>

        <View style={styles.featuredSection}>
          <View style={styles.section}>
            <View style={styles.sectionHeading}>
              <View><Text style={styles.sectionKicker}>SPECIAL SERVICES</Text><Text style={styles.sectionTitle}>خدمات مميزة</Text><Text style={styles.sectionSubtitle}>خدمات إضافية تختصر عليك الوقت والمجهود.</Text></View>
              <Pressable onPress={() => router.push("/services" as never)} style={styles.textLink}><Text style={styles.textLinkText}>اكتشف المزيد ←</Text></Pressable>
            </View>
            <View style={styles.cardsGrid}>
              {featuredServices.map(item => <View key={item.id} style={{ width: cardWidth }}><ServiceCard item={item} compact /></View>)}
            </View>
          </View>
        </View>

        <View style={styles.ctaWrap}>
          <View style={[styles.cta, compact && styles.ctaCompact]}>
            <View style={styles.ctaCopy}><Text style={styles.ctaKicker}>NEED A HAND?</Text><Text style={styles.ctaTitle}>خدمتك تبدأ من هنا</Text><Text style={styles.ctaText}>تصفح الأقسام واختر الخدمة التي تحتاجها، وسنساعدك في الوصول إلى الاختيار المناسب.</Text></View>
            <Pressable onPress={() => router.push("/request-service" as never)} style={styles.ctaButton}><Text style={styles.ctaButtonText}>اطلب خدمتك الآن ←</Text></Pressable>
          </View>
        </View>
        <SiteFooter />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: "#F6F8F7" },
  heroOuter: { backgroundColor: "#102A34", paddingHorizontal: 18, paddingTop: 18, paddingBottom: 24 },
  hero: { width: "100%", maxWidth: 1240, minHeight: 460, alignSelf: "center", justifyContent: "center", overflow: "hidden", borderRadius: 26, backgroundColor: "#102A34" },
  heroCompact: { minHeight: 500, borderRadius: 18 },
  heroShade: { ...StyleSheet.absoluteFill, backgroundColor: "rgba(7, 30, 37, 0.72)" },
  heroContent: { width: "100%", maxWidth: 760, paddingHorizontal: 54, paddingVertical: 54, alignItems: "flex-start" },
  heroContentCompact: { paddingHorizontal: 24, paddingVertical: 38 },
  eyebrow: { borderWidth: 1, borderColor: "rgba(255,255,255,0.35)", borderRadius: 30, paddingHorizontal: 13, paddingVertical: 7, marginBottom: 20 },
  eyebrowText: { color: "#B8E5DC", fontSize: 10, fontWeight: "900", letterSpacing: 2 },
  heroTitle: { color: "#FFFFFF", fontSize: 48, fontWeight: "900", textAlign: "right", lineHeight: 62 },
  heroTitleCompact: { fontSize: 34, lineHeight: 47 },
  heroText: { color: "#D5E2E2", fontSize: 17, lineHeight: 30, textAlign: "right", maxWidth: 570, marginTop: 14 },
  heroTextCompact: { fontSize: 15, lineHeight: 27 },
  heroActions: { flexDirection: "row", flexWrap: "wrap", gap: 12, marginTop: 28 },
  primaryButton: { backgroundColor: "#0A9A8A", borderRadius: 12, paddingVertical: 14, paddingHorizontal: 22 },
  primaryButtonText: { color: "#FFFFFF", fontSize: 14, fontWeight: "900" },
  secondaryButton: { borderWidth: 1, borderColor: "rgba(255,255,255,0.55)", borderRadius: 12, paddingVertical: 14, paddingHorizontal: 22 },
  secondaryButtonText: { color: "#FFFFFF", fontSize: 14, fontWeight: "800" },
  heroStats: { flexDirection: "row", alignItems: "center", gap: 22, marginTop: 38 },
  statNumber: { color: "#FFFFFF", fontSize: 23, fontWeight: "900", textAlign: "right" },
  statLabel: { color: "#BDCECE", fontSize: 10, marginTop: 3, textAlign: "right" },
  statDivider: { width: 1, height: 36, backgroundColor: "rgba(255,255,255,0.25)" },
  trustStrip: { width: "100%", maxWidth: 1150, alignSelf: "center", paddingHorizontal: 22, paddingVertical: 23, flexDirection: "row", justifyContent: "space-around", flexWrap: "wrap", gap: 18, borderBottomWidth: 1, borderBottomColor: "#E6ECE9" },
  trustItem: { flexDirection: "row", alignItems: "center", gap: 9 },
  trustIcon: { color: "#07877B", fontSize: 19, fontWeight: "900" },
  trustText: { color: "#43565C", fontSize: 13, fontWeight: "700" },
  section: { width: "100%", maxWidth: 1240, alignSelf: "center", paddingHorizontal: 24, paddingTop: 54, paddingBottom: 42 },
  sectionHeading: { flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 18, marginBottom: 25 },
  sectionKicker: { color: "#07877B", fontSize: 10, fontWeight: "900", letterSpacing: 2, textAlign: "right" },
  sectionTitle: { color: "#102A34", fontSize: 29, fontWeight: "900", marginTop: 7, textAlign: "right" },
  sectionSubtitle: { color: "#77878B", fontSize: 13, marginTop: 8, textAlign: "right" },
  textLink: { paddingVertical: 8, paddingHorizontal: 4 },
  textLinkText: { color: "#07877B", fontWeight: "900", fontSize: 13 },
  cardsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 16, justifyContent: "flex-start" },
  card: { backgroundColor: "#FFFFFF", borderRadius: 17, overflow: "hidden", borderWidth: 1, borderColor: "#E8EEEB", minHeight: 270, shadowColor: "#163A3C", shadowOpacity: 0.05, shadowRadius: 12, shadowOffset: { width: 0, height: 5 }, elevation: 2 },
  cardCompact: { minHeight: 220 },
  cardImage: { width: "100%", height: 145, backgroundColor: "#DCE7E3" },
  cardImageCompact: { height: 116 },
  cardBody: { padding: 14, alignItems: "flex-start" },
  cardTitleRow: { width: "100%", flexDirection: "row", alignItems: "center", gap: 8 },
  cardIcon: { fontSize: 17 },
  cardTitle: { color: "#16333B", fontSize: 15, fontWeight: "900", textAlign: "right", flexShrink: 1 },
  cardEnglish: { color: "#93A0A1", fontSize: 10, marginTop: 5, textAlign: "right" },
  cardDescription: { color: "#708085", fontSize: 11, lineHeight: 19, marginTop: 9, textAlign: "right" },
  cardMore: { color: "#07877B", fontSize: 11, fontWeight: "900", marginTop: 12 },
  arrow: { fontSize: 14 },
  featuredSection: { backgroundColor: "#EDF4F1" },
  ctaWrap: { paddingHorizontal: 18, paddingTop: 22, paddingBottom: 10 },
  cta: { width: "100%", maxWidth: 1200, alignSelf: "center", backgroundColor: "#DCEFE9", borderRadius: 24, paddingHorizontal: 34, paddingVertical: 30, flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 20 },
  ctaCompact: { flexDirection: "column", alignItems: "flex-start", paddingHorizontal: 23 },
  ctaCopy: { maxWidth: 650 },
  ctaKicker: { color: "#07877B", fontSize: 10, fontWeight: "900", letterSpacing: 2 },
  ctaTitle: { color: "#102A34", fontSize: 25, fontWeight: "900", marginTop: 8, textAlign: "right" },
  ctaText: { color: "#587077", fontSize: 13, lineHeight: 23, marginTop: 8, textAlign: "right" },
  ctaButton: { backgroundColor: "#102A34", borderRadius: 12, paddingHorizontal: 22, paddingVertical: 15 },
  ctaButtonText: { color: "#FFFFFF", fontWeight: "900", fontSize: 13 }
});
