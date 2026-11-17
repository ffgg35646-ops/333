import { Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useServices } from "../hooks/useServices";
import { SiteFooter, SiteHeader } from "../components/SiteShell";

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
            <Image source={{ uri: service.image }} style={styles.image} />
            <View style={styles.info}>
              <Text style={styles.kicker}>{service.group === "main" ? "MAIN SERVICE" : "SPECIAL SERVICE"}</Text>
              <Text style={styles.title}>{service.icon}  {service.title}</Text>
              <Text style={styles.english}>{service.english}</Text>
              <Text style={styles.summary}>{service.shortDescription}</Text>
              <View style={styles.rule} />
              <Text style={styles.detailsHeading}>تفاصيل الخدمة</Text>
              <Text style={styles.details}>{service.details}</Text>
              <View style={styles.detailPanel}>
                <Text style={styles.detailsHeading}>ماذا تشمل الخدمة؟</Text>
                <Text style={styles.detailBullet}>• فهم احتياجك وتسجيل تفاصيل الخدمة المطلوبة.</Text>
                <Text style={styles.detailBullet}>• مراجعة بيانات الموقع وطبيعة العمل المطلوب.</Text>
                <Text style={styles.detailBullet}>• التواصل معك لتوضيح النطاق والتفاصيل قبل التنفيذ.</Text>
                <Text style={styles.detailBullet}>• الاتفاق على الموعد والتكلفة بعد مراجعة الطلب.</Text>
              </View>
              <View style={styles.detailPanel}>
                <Text style={styles.detailsHeading}>خطوات طلب الخدمة</Text>
                <Text style={styles.detailStep}>١. اضغط على «اطلب هذه الخدمة».</Text>
                <Text style={styles.detailStep}>٢. أدخل بيانات التواصل والعنوان.</Text>
                <Text style={styles.detailStep}>٣. اكتب تفاصيل احتياجك وسنتواصل معك لتأكيد الطلب.</Text>
              </View>
              <Text style={styles.note}>ملاحظة: تفاصيل التنفيذ والتكلفة النهائية يتم تأكيدها معك بعد مراجعة طبيعة الخدمة ومكانها.</Text>
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
  content: { width: "100%", maxWidth: 1000, alignSelf: "center", padding: 24, paddingTop: 28 },
  back: { color: "#0F766E", fontSize: 13, fontWeight: "800", textAlign: "right", marginBottom: 18 , fontFamily: "Arial" },
  image: { width: "100%", height: 340, borderRadius: 26, backgroundColor: "#E8EEEA" },
  info: { backgroundColor: "#FFFFFF", padding: 32, borderRadius: 26, marginTop: 22, borderWidth: 1, borderColor: "#E2E9E4", alignItems: "flex-start", shadowColor: "#173B38", shadowOpacity: 0.06, shadowRadius: 14, shadowOffset: { width: 0, height: 5 }, elevation: 2 },
  kicker: { color: "#0F766E", fontSize: 10, fontWeight: "900", letterSpacing: 2 , fontFamily: "Arial" },
  title: { color: "#173B38", fontSize: 28, fontWeight: "900", textAlign: "right", marginTop: 9 , fontFamily: "Arial" },
  english: { color: "#89958F", fontSize: 12, marginTop: 6 , fontFamily: "Arial" },
  summary: { color: "#536A65", fontSize: 15, lineHeight: 27, marginTop: 18, textAlign: "right" , fontFamily: "Arial" },
  rule: { height: 1, backgroundColor: "#DCE7E3", width: "100%", marginVertical: 20 },
  detailsHeading: { color: "#173B38", fontSize: 18, fontWeight: "900", textAlign: "right" , fontFamily: "Arial" },
  details: { color: "#536A65", fontSize: 14, lineHeight: 29, marginTop: 10, textAlign: "right" , fontFamily: "Arial" },
  detailPanel: { width: "100%", backgroundColor: "#F6F9F7", borderRadius: 14, padding: 18, marginTop: 16, borderWidth: 1, borderColor: "#DCE7E3", alignItems: "flex-start" },
  detailBullet: { color: "#536A65", fontSize: 13, lineHeight: 26, marginTop: 5, textAlign: "right" , fontFamily: "Arial" },
  detailStep: { color: "#536A65", fontSize: 13, lineHeight: 27, marginTop: 4, textAlign: "right" , fontFamily: "Arial" },
  note: { color: "#65766F", fontSize: 12, lineHeight: 22, marginTop: 16, textAlign: "right", backgroundColor: "#E6F2EF", padding: 13, borderRadius: 10, width: "100%" , fontFamily: "Arial" },
  button: { backgroundColor: "#0F766E", paddingHorizontal: 23, paddingVertical: 15, borderRadius: 12, marginTop: 25 },
  buttonText: { color: "#173B38", fontWeight: "900", fontSize: 13 , fontFamily: "Arial" },
  notFound: { padding: 60, alignItems: "center" }
});
