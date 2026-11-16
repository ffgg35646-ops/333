import { Image, Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { router } from "expo-router";
import { useServices } from "../hooks/useServices";
import { serviceCategories, type ServiceItem } from "../data/services";
import { SiteFooter, SiteHeader } from "../components/SiteShell";

function ServiceTile({ item, width }: { item: ServiceItem; width: string }) {
  return (
    <Pressable onPress={() => router.push(("/service?id=" + item.id) as never)} style={[styles.tile, { width }]}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.tileBody}>
        <Text style={styles.title}>{item.icon}  {item.title}</Text>
        <Text style={styles.english}>{item.english}</Text>
        <Text style={styles.description}>{item.shortDescription}</Text>
        <Text style={styles.more}>عرض التفاصيل ←</Text>
      </View>
    </Pressable>
  );
}

export default function ServicesScreen() {
  const { width } = useWindowDimensions();
  const { services } = useServices();
  const tileWidth = width > 1050 ? "23.5%" : width > 700 ? "31.5%" : "47.5%";
  return (
    <View style={styles.page}>
      <SiteHeader active="services" />
      <ScrollView>
        <View style={styles.intro}><Text style={styles.kicker}>OUR SERVICES</Text><Text style={styles.heading}>اكتشف خدمات خدماتي</Text><Text style={styles.introText}>ثمانية أقسام تضم خدمات متنوعة باللغتين العربية والإنجليزية.</Text></View>
        {serviceCategories.map(category => {
          const items = services.filter(item => item.active !== false && item.categoryId === category.id);
          if (!items.length) return null;
          return <View key={category.id} style={styles.section}>
            <View style={styles.categoryHeading}>
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
  page: { flex: 1, backgroundColor: "#F2FAFE" },
  intro: { backgroundColor: "#E4F5FC", paddingHorizontal: 24, paddingVertical: 58, alignItems: "center", borderBottomWidth: 1, borderBottomColor: "#CDEBF7" },
  kicker: { color: "#078BCB", fontWeight: "900", fontSize: 10, letterSpacing: 2 },
  heading: { color: "#123B56", fontSize: 32, fontWeight: "900", marginTop: 10, textAlign: "center" },
  introText: { color: "#63777A", fontSize: 14, marginTop: 10, textAlign: "center" },
  section: { width: "100%", maxWidth: 1240, alignSelf: "center", padding: 24, paddingTop: 42, paddingBottom: 42 },
  categoryHeading: { marginBottom: 22, alignItems: "flex-end" },
  sectionTitle: { color: "#123B56", fontSize: 24, fontWeight: "900", textAlign: "right" },
  categoryEnglish: { color: "#849395", fontSize: 12, marginTop: 5 },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 16 },
  tile: { backgroundColor: "#FFFFFF", borderRadius: 18, overflow: "hidden", borderWidth: 1, borderColor: "#DCECF4", marginBottom: 8, shadowColor: "#123B56", shadowOpacity: 0.06, shadowRadius: 12, shadowOffset: { width: 0, height: 4 }, elevation: 2 },
  image: { width: "100%", height: 150, backgroundColor: "#E3E9F8" },
  tileBody: { padding: 14, alignItems: "flex-start" },
  title: { color: "#123B56", fontSize: 14, fontWeight: "900", textAlign: "right" },
  english: { color: "#8C9A9D", fontSize: 10, marginTop: 5, textAlign: "right" },
  description: { color: "#687B80", fontSize: 11, lineHeight: 19, marginTop: 8, textAlign: "right" },
  more: { color: "#078BCB", fontSize: 11, fontWeight: "900", marginTop: 11 }
});
