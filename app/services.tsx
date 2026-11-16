import { Image, Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { router } from "expo-router";
import { useServices } from "../hooks/useServices";
import type { ServiceItem } from "../data/services";
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
  const { mainServices, featuredServices } = useServices();
  const tileWidth = width > 1050 ? "23.5%" : width > 700 ? "31.5%" : "47.5%";
  return (
    <View style={styles.page}>
      <SiteHeader active="services" />
      <ScrollView>
        <View style={styles.intro}><Text style={styles.kicker}>OUR SERVICES</Text><Text style={styles.heading}>اكتشف خدمات خدماتي</Text><Text style={styles.introText}>اختَر القسم المناسب، وتعرّف على تفاصيل الخدمة قبل طلبها.</Text></View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>الخدمات الرئيسية</Text>
          <View style={styles.grid}>{mainServices.map(item => <ServiceTile key={item.id} item={item} width={tileWidth} />)}</View>
        </View>
        <View style={styles.featured}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>خدمات مميزة</Text>
            <View style={styles.grid}>{featuredServices.map(item => <ServiceTile key={item.id} item={item} width={tileWidth} />)}</View>
          </View>
        </View>
        <SiteFooter />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: "#F6F8F7" },
  intro: { backgroundColor: "#E4F1EC", paddingHorizontal: 24, paddingVertical: 48, alignItems: "center" },
  kicker: { color: "#07877B", fontWeight: "900", fontSize: 10, letterSpacing: 2 },
  heading: { color: "#102A34", fontSize: 32, fontWeight: "900", marginTop: 10, textAlign: "center" },
  introText: { color: "#63777A", fontSize: 14, marginTop: 10, textAlign: "center" },
  section: { width: "100%", maxWidth: 1240, alignSelf: "center", padding: 24, paddingTop: 42, paddingBottom: 42 },
  sectionTitle: { color: "#102A34", fontSize: 24, fontWeight: "900", textAlign: "right", marginBottom: 22 },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 16 },
  tile: { backgroundColor: "#FFFFFF", borderRadius: 16, overflow: "hidden", borderWidth: 1, borderColor: "#E7EDEA", marginBottom: 2 },
  image: { width: "100%", height: 135, backgroundColor: "#DCE7E3" },
  tileBody: { padding: 14, alignItems: "flex-start" },
  title: { color: "#17343D", fontSize: 14, fontWeight: "900", textAlign: "right" },
  english: { color: "#8C9A9D", fontSize: 10, marginTop: 5, textAlign: "right" },
  description: { color: "#687B80", fontSize: 11, lineHeight: 19, marginTop: 8, textAlign: "right" },
  more: { color: "#07877B", fontSize: 11, fontWeight: "900", marginTop: 11 },
  featured: { backgroundColor: "#EDF4F1" }
});
