import { Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useServices } from "../hooks/useServices";
import { SiteFooter, SiteHeader } from "../components/SiteShell";

const FastImage = Image as any;

export default function ServiceDetailsScreen() {
  const params = useLocalSearchParams<{ id?: string }>();
  const { services } = useServices();
  const service = services.find(item => item.id === params.id);
  return (
    <View style={styles.page}>
      <SiteHeader active="services" />
      <ScrollView>
        {!service ? (
          <View style={styles.notFound}><Text style={styles.title}>الخدمة غير موجودة</Text><Pressable onPress={() => router.push("/services" as never)} style={styles.button}><Text style={styles.buttonText}>العودة للخدمات</Text></Pressable></View>
        ) : (
          <View style={styles.content}>
            <Pressable onPress={() => router.push("/services" as never)}><Text style={styles.back}>← العودة إلى الخدمات</Text></Pressable>
            <FastImage source={{ uri: service.image }} style={styles.image} loading="eager" decoding="async" />
            <View style={styles.info}>
              <Text style={styles.kicker}>{service.group === "main" ? "MAIN SERVICE" : "SPECIAL SERVICE"}</Text>
              <Text style={styles.title}>{service.icon}  {service.title}</Text>
              <Text style={styles.english}>{service.english}</Text>

              <View style={styles.descriptionSection}>
                <Text style={styles.sectionHeading}>✦  وصف</Text>
                <Text style={styles.summary}>{service.shortDescription}</Text>
              </View>

              {!!service.details && (
                <View style={styles.descriptionSection}>
                  <View style={styles.rule} />
                  <Text style={styles.details}>{service.details}</Text>
                </View>
              )}

              <View style={styles.stepsSection}>
                <View style={styles.rule} />
                <Text style={styles.stepsHeading}>⌁  خطوات طلب الخدمة</Text>
                <Text style={styles.detailStep}>١. اضغط على «اطلب هذه الخدمة».</Text>
                <Text style={styles.detailStep}>٢. أدخل بيانات التواصل والعنوان.</Text>
                <Text style={styles.detailStep}>٣. اكتب تفاصيل احتياجك وسنتواصل معك لتأكيد الطلب.</Text>
              </View>

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
  page: { flex: 1, backgroundColor: "#F5F7F6" },
  content: { width: "100%", maxWidth: 1120, alignSelf: "center", padding: 30, paddingTop: 34 },
  back: { color: "#0F766E", fontSize: 13, fontWeight: "700", textAlign: "right", marginBottom: 18, fontFamily: "Arial" },
  image: { width: "100%", height: 390, borderRadius: 28, backgroundColor: "#E8EEEA" },
  info: { backgroundColor: "#FFFFFF", padding: 38, borderRadius: 26, marginTop: 22, borderWidth: 1, borderColor: "#E2E9E4", alignItems: "flex-start", shadowColor: "#173B38", shadowOpacity: 0.06, shadowRadius: 16, shadowOffset: { width: 0, height: 6 }, elevation: 2 },
  kicker: { color: "#0F766E", fontSize: 10, fontWeight: "800", letterSpacing: 1.6, fontFamily: "Arial" },
  title: { color: "#173B38", fontSize: 31, fontWeight: "900", textAlign: "right", marginTop: 10, lineHeight: 46, fontFamily: "Arial" },
  english: { color: "#89958F", fontSize: 11, marginTop: 5, fontFamily: "Arial" },
  descriptionSection: { width: "100%", alignItems: "flex-start", marginTop: 25 },
  sectionHeading: { color: "#0F766E", fontSize: 20, fontWeight: "900", textAlign: "right", marginBottom: 13, fontFamily: "Arial" },
  summary: { color: "#344F46", fontSize: 17, fontWeight: "600", lineHeight: 34, textAlign: "right", width: "100%", fontFamily: "Arial" },
  rule: { height: 1, backgroundColor: "#E5ECE8", width: "100%", marginBottom: 19 },
  details: { color: "#405A51", fontSize: 16, fontWeight: "500", lineHeight: 33, textAlign: "right", width: "100%", fontFamily: "Arial" },
  stepsSection: { width: "100%", alignItems: "flex-start", marginTop: 27 },
  stepsHeading: { color: "#173B38", fontSize: 16, fontWeight: "800", textAlign: "right", marginBottom: 9, fontFamily: "Arial" },
  detailStep: { color: "#405A51", fontSize: 15, fontWeight: "600", lineHeight: 30, marginTop: 6, textAlign: "right", width: "100%", fontFamily: "Arial" },
  button: { backgroundColor: "#0F766E", paddingHorizontal: 23, paddingVertical: 15, borderRadius: 12, marginTop: 27 },
  buttonText: { color: "#FFFFFF", fontWeight: "800", fontSize: 14, fontFamily: "Arial" },
  notFound: { padding: 60, alignItems: "center" }
});
