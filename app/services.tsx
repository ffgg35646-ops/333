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
  const contentWidth = width - (compact ? 40 : 48);
  const gap = compact ? 12 : 16;
  const columns = width > 1050 ? 4 : width > 700 ? 3 : 2;
  const tileWidth = (contentWidth - gap * (columns - 1)) / columns + (compact ? 5 : 0);
  return (
    <View style={styles.page}>
      <SiteHeader active="services" />
      <ScrollView>
        <View style={styles.intro}><Text style={styles.kicker}>OUR SERVICES</Text><Text style={styles.heading}>اكتشف خدمات خدماتي</Text><Text style={styles.introText}>ثمانية أقسام تضم خدمات متنوعة باللغتين العربية والإنجليزية.</Text></View>
        {serviceCategories.filter(category => !params.category || category.id === params.category).map(category => {
          const items = services.filter(item => item.active !== false && item.categoryId === category.id);
          if (!items.length) return null;
          return <View key={category.id} style={[styles.section, compact && styles.sectionCompact]}>
            <View style={[styles.categoryHeading, compact && styles.categoryHeadingCompact]}>
              <Text style={styles.sectionTitle}>{category.icon}  {items[0]?.categoryTitle || category.title}</Text>
              <Text style={styles.categoryEnglish}>{items[0]?.categoryEnglish || category.english}</Text>
            </View>
            <View style={styles.grid}>{items.map(item => <ServiceTile key={item.id} item={item} width={tileWidth} />)}</View>
          </View>;
        })}
        <SiteFooter />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: "#F5F7F6" },
  intro: { backgroundColor: "#EAF2EE", paddingHorizontal: 24, paddingVertical: 66, alignItems: "center", borderBottomWidth: 1, borderBottomColor: "#C9DED8" },
  kicker: { color: "#0F766E", fontWeight: "900", fontSize: 10, letterSpacing: 2 , fontFamily: "Arial" },
  heading: { color: "#173B38", fontSize: 32, fontWeight: "900", marginTop: 10, textAlign: "center" , fontFamily: "Arial" },
  introText: { color: "#657771", fontSize: 14, marginTop: 10, textAlign: "center" , fontFamily: "Arial" },
  section: { width: "100%", maxWidth: 1240, alignSelf: "center", padding: 20, paddingTop: 28, paddingBottom: 32 },
  sectionCompact: { paddingHorizontal: 15 },
  categoryHeading: { marginBottom: 22, alignItems: "flex-end", backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#DCE9E3", borderRadius: 17, paddingHorizontal: 20, paddingVertical: 16, shadowColor: "#173B38", shadowOpacity: 0.06, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 2 },
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
