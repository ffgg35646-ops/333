import { Image, Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useServices } from "../hooks/useServices";
import { serviceCategories, type ServiceItem } from "../data/services";
import { SiteFooter, SiteHeader } from "../components/SiteShell";

const FastImage = Image as any;

function ServiceTile({ item, width }: { item: ServiceItem; width: number }) {
  return (
    <Pressable onPress={() => router.push(("/service?id=" + item.id) as never)} style={[styles.tile, { width }]}>
      <FastImage source={{ uri: item.image }} style={styles.image} loading="lazy" decoding="async" />
      <View style={styles.tileBody}>
        <Text style={styles.title}>{item.icon}  {item.title}</Text>
        <Text style={styles.more}>عرض التفاصيل ←</Text>
      </View>
    </Pressable>
  );
}

export default function ServicesScreen() {
  const { width } = useWindowDimensions();
  const { services } = useServices();
  const params = useLocalSearchParams<{ category?: string }>();
  const compact = width <= 700;
  const contentWidth = compact ? width - 40 : Math.min(width - 48, 1200);
  const gap = compact ? 12 : 16;
  const columns = compact ? 2 : 3;
  const tileWidth = (contentWidth - gap * (columns - 1)) / columns;
  const groupWidth = tileWidth * columns + gap * (columns - 1);
  return (
    <View style={styles.page}>
      <SiteHeader active="services" />
      <ScrollView>
        <View style={[styles.intro, compact && styles.introCompact]}>
          <View style={styles.introGlow} />
          <Text style={styles.kicker}>خدماتي • كل احتياجاتك في مكان واحد</Text>
          <Text style={styles.heading}>خدمات متكاملة.. لحياة أسهل</Text>
          <Text style={styles.introText}>اختار القسم المناسب واستكشف الخدمات المتاحة ليك</Text>
          <View style={styles.introCategories}>
            {serviceCategories.map(category => (
              <Pressable key={category.id} onPress={() => router.push(("/services?category=" + category.id) as never)} style={[styles.introCategory, compact && styles.introCategoryCompact]}>
                <Text style={[styles.introCategoryIcon, compact && styles.introCategoryIconCompact]}>{category.icon}</Text>
                <Text style={[styles.introCategoryTitle, compact && styles.introCategoryTitleCompact]} numberOfLines={2}>{category.title}</Text>
              </Pressable>
            ))}
          </View>
        </View>
        {serviceCategories.filter(category => !params.category || category.id === params.category).map(category => {
          const items = services.filter(item => item.active !== false && item.categoryId === category.id);
          if (!items.length) return null;
          return <View key={category.id} style={[styles.section, compact && styles.sectionCompact]}>
            <View style={[styles.categoryGroup, { width: compact ? "100%" : groupWidth }]}>
              <View style={[styles.categoryHeading, compact && styles.categoryHeadingCompact]}>
                <Text style={styles.sectionTitle}>{category.icon}  {items[0]?.categoryTitle || category.title}</Text>
                <Text style={styles.categoryEnglish}>{items[0]?.categoryEnglish || category.english}</Text>
              </View>
              <View style={styles.grid}>{items.map(item => <ServiceTile key={item.id} item={item} width={tileWidth} />)}</View>
            </View>
          </View>;
        })}
        <SiteFooter />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: "#F5F7F6" },
  intro: { position: "relative", overflow: "hidden", backgroundColor: "#102B35", paddingHorizontal: 24, paddingVertical: 42, alignItems: "center", borderBottomWidth: 1, borderBottomColor: "#1B5960" },
  introCompact: { paddingHorizontal: 14, paddingVertical: 28 },
  introGlow: { position: "absolute", width: 260, height: 260, borderRadius: 130, backgroundColor: "rgba(18,212,208,0.10)", top: -140, right: -45 },
  introCategories: { width: "100%", maxWidth: 980, flexDirection: "row", flexWrap: "wrap", justifyContent: "center", gap: 10, marginTop: 26 },
  introCategory: { width: 112, minHeight: 90, paddingHorizontal: 9, paddingVertical: 12, borderRadius: 16, borderWidth: 1, borderColor: "rgba(210,245,248,0.28)", backgroundColor: "rgba(255,255,255,0.08)", alignItems: "center", justifyContent: "center", gap: 7 },
  introCategoryCompact: { width: "22%" as any, minHeight: 76, paddingHorizontal: 4, paddingVertical: 8, borderRadius: 12 },
  introCategoryIcon: { color: "#16D2CF", fontSize: 25 },
  introCategoryIconCompact: { fontSize: 20 },
  introCategoryTitle: { color: "#FFFFFF", fontSize: 11, fontWeight: "800", textAlign: "center", lineHeight: 16, fontFamily: "Arial" },
  introCategoryTitleCompact: { fontSize: 9, lineHeight: 13 },
  kicker: { color: "#16D2CF", fontWeight: "900", fontSize: 11, letterSpacing: 1, textAlign: "center", fontFamily: "Arial" },
  heading: { color: "#FFFFFF", fontSize: 32, fontWeight: "900", marginTop: 10, textAlign: "center", fontFamily: "Arial" },
  introText: { color: "#D1E2E2", fontSize: 14, marginTop: 10, textAlign: "center", fontFamily: "Arial" },
  section: { width: "100%", maxWidth: 1240, alignSelf: "center", padding: 20, paddingTop: 28, paddingBottom: 32 },
  sectionCompact: { paddingHorizontal: 15 },
  categoryGroup: { alignSelf: "center", maxWidth: "100%" },
  categoryHeading: { width: "100%", marginBottom: 22, alignItems: "flex-end", backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#DCE9E3", borderRadius: 17, paddingHorizontal: 20, paddingVertical: 16, shadowColor: "#173B38", shadowOpacity: 0.06, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 2 },
  categoryHeadingCompact: { paddingHorizontal: 15, paddingVertical: 13, marginBottom: 16 },
  sectionTitle: { color: "#173B38", fontSize: 27, fontWeight: "900", textAlign: "right" , fontFamily: "Arial" },
  categoryEnglish: { color: "#89958F", fontSize: 12, marginTop: 5 , fontFamily: "Arial" },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  tile: { backgroundColor: "#FFFFFF", borderRadius: 21, overflow: "hidden", borderWidth: 1, borderColor: "#E2E9E4", marginBottom: 8, shadowColor: "#173B38", shadowOpacity: 0.07, shadowRadius: 16, shadowOffset: { width: 0, height: 6 }, elevation: 3 },
  image: { width: "100%", height: 166, backgroundColor: "#E8EEEA" },
  tileBody: { paddingHorizontal: 14, paddingVertical: 13, alignItems: "flex-start", minHeight: 82, justifyContent: "center" },
  title: { color: "#173B38", fontSize: 16, fontWeight: "900", textAlign: "right" , fontFamily: "Arial" },
  english: { color: "#89958F", fontSize: 10, marginTop: 5, textAlign: "right" , fontFamily: "Arial" },
  description: { color: "#52645D", fontSize: 11, lineHeight: 19, marginTop: 9, textAlign: "right", width: "100%", minHeight: 38, paddingHorizontal: 9, paddingVertical: 7, borderRadius: 9, backgroundColor: "#F5F8F6", overflow: "hidden", fontFamily: "Arial" },
  more: { color: "#0F766E", fontSize: 12, fontWeight: "900", marginTop: 11 , fontFamily: "Arial" },
});
