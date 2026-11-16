import { Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { allServices } from "../data/services";
import { SiteFooter, SiteHeader } from "../components/SiteShell";

export default function ServiceDetailsScreen() {
  const params = useLocalSearchParams<{ id?: string }>();
  const service = allServices.find(item => item.id === params.id);
  return (
    <View style={styles.page}>
      <SiteHeader active="services" />
      <ScrollView>
        {!service ? (
          <View style={styles.notFound}><Text style={styles.title}>الخدمة غير موجودة</Text><Pressable onPress={() => router.push("/services" as never)} style={styles.button}><Text style={styles.buttonText}>العودة للخدمات</Text></Pressable></View>
        ) : (
          <View style={styles.content}>
            <Pressable onPress={() => router.push("/services" as never)}><Text style={styles.back}>← العودة إلى الخدمات</Text></Pressable>
            <Image source={{ uri: service.image }} style={styles.image} />
            <View style={styles.info}>
              <Text style={styles.kicker}>{service.group === "main" ? "MAIN SERVICE" : "SPECIAL SERVICE"}</Text>
              <Text style={styles.title}>{service.icon}  {service.title}</Text>
              <Text style={styles.english}>{service.english}</Text>
              <Text style={styles.summary}>{service.shortDescription}</Text>
              <View style={styles.rule} />
              <Text style={styles.detailsHeading}>تفاصيل الخدمة</Text>
              <Text style={styles.details}>{service.details}</Text>
              <Pressable onPress={() => router.push(("/request-service?service=" + service.id) as never)} style={styles.button}><Text style={styles.buttonText}>اطلب هذه الخدمة ←</Text></Pressable>
            </View>
          </View>
        )}
        <SiteFooter />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: "#F6F8F7" },
  content: { width: "100%", maxWidth: 1000, alignSelf: "center", padding: 24, paddingTop: 28 },
  back: { color: "#07877B", fontSize: 13, fontWeight: "800", textAlign: "right", marginBottom: 18 },
  image: { width: "100%", height: 320, borderRadius: 22, backgroundColor: "#DCE7E3" },
  info: { backgroundColor: "#FFFFFF", padding: 25, borderRadius: 20, marginTop: 18, borderWidth: 1, borderColor: "#E7EDEA", alignItems: "flex-start" },
  kicker: { color: "#07877B", fontSize: 10, fontWeight: "900", letterSpacing: 2 },
  title: { color: "#102A34", fontSize: 28, fontWeight: "900", textAlign: "right", marginTop: 9 },
  english: { color: "#8A999D", fontSize: 12, marginTop: 6 },
  summary: { color: "#52686E", fontSize: 15, lineHeight: 27, marginTop: 18, textAlign: "right" },
  rule: { height: 1, backgroundColor: "#E8EEEB", width: "100%", marginVertical: 20 },
  detailsHeading: { color: "#17343D", fontSize: 18, fontWeight: "900", textAlign: "right" },
  details: { color: "#5B6F75", fontSize: 14, lineHeight: 29, marginTop: 10, textAlign: "right" },
  button: { backgroundColor: "#07877B", paddingHorizontal: 23, paddingVertical: 15, borderRadius: 12, marginTop: 25 },
  buttonText: { color: "#FFFFFF", fontWeight: "900", fontSize: 13 },
  notFound: { padding: 60, alignItems: "center" }
});
