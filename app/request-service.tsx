import { useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useServices } from "../hooks/useServices";
import { apiRequest } from "../lib/api";
import { SiteFooter, SiteHeader } from "../components/SiteShell";

export default function RequestServiceScreen() {
  const params = useLocalSearchParams<{ service?: string }>();
  const { services } = useServices();
  const selected = services.find(item => item.id === params.service);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [serviceName, setServiceName] = useState(selected?.title ?? "");
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState("");
  const submit = async () => {
    if (!name.trim() || !phone.trim() || !address.trim() || !serviceName.trim()) {
      setFeedback("من فضلك أكمل الاسم ورقم الهاتف والعنوان والخدمة.");
      return;
    }
    setBusy(true);
    setFeedback("");
    try {
      await apiRequest("/api/requests", { method: "POST", body: JSON.stringify({ name, phone, address, service: serviceName, notes }) });
      setFeedback("تم إرسال طلبك بنجاح، وسيتم التواصل معك قريبًا.");
      setName(""); setPhone(""); setAddress(""); setNotes("");
    } catch (error) {
      setFeedback(error instanceof Error ? error.message : "تعذر إرسال الطلب الآن.");
    } finally {
      setBusy(false);
    }
  };
  return (
    <View style={styles.page}>
      <SiteHeader />
      <ScrollView>
        <View style={styles.hero}><Text style={styles.kicker}>REQUEST A SERVICE</Text><Text style={styles.title}>اطلب خدمتك</Text><Text style={styles.subtitle}>املأ البيانات الأساسية، وسنجهّز طلبك لربطه بنظام المتابعة.</Text></View>
        <View style={styles.formWrap}>
          <View style={styles.formCard}>
            <Text style={styles.formTitle}>بيانات طلب الخدمة</Text>
            <Text style={styles.label}>الخدمة المطلوبة</Text>
            <TextInput value={serviceName} onChangeText={setServiceName} placeholder="اكتب أو اختر اسم الخدمة" style={styles.input} />
            <Text style={styles.label}>الاسم</Text>
            <TextInput value={name} onChangeText={setName} placeholder="الاسم بالكامل" style={styles.input} />
            <Text style={styles.label}>رقم الهاتف</Text>
            <TextInput value={phone} onChangeText={setPhone} placeholder="رقم الهاتف للتواصل" keyboardType="phone-pad" style={styles.input} />
            <Text style={styles.label}>العنوان أو المنطقة</Text>
            <TextInput value={address} onChangeText={setAddress} placeholder="المدينة والمنطقة والعنوان" style={styles.input} />
            <Text style={styles.label}>تفاصيل إضافية</Text>
            <TextInput value={notes} onChangeText={setNotes} placeholder="اكتب تفاصيل تساعدنا على فهم طلبك..." style={[styles.input, styles.notes]} multiline />
            <Pressable onPress={submit} disabled={busy} style={[styles.submit, busy && { opacity: 0.6 }]}><Text style={styles.submitText}>{busy ? "جارٍ الإرسال..." : "إرسال الطلب"}</Text></Pressable>
            {!!feedback && <Text style={{ color: feedback.startsWith("تم") ? "#087D63" : "#B42318", textAlign: "center", marginTop: 12, fontSize: 12, fontWeight: "700" }}>{feedback}</Text>}
          </View>
          <Pressable onPress={() => router.push("/services" as never)} style={styles.browse}><Text style={styles.browseText}>لم تحدد الخدمة بعد؟ تصفح الأقسام ←</Text></Pressable>
        </View>
        <SiteFooter />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: "#F6F8F7" },
  hero: { backgroundColor: "#E4F1EC", alignItems: "center", paddingVertical: 42, paddingHorizontal: 20 },
  kicker: { color: "#07877B", fontSize: 10, fontWeight: "900", letterSpacing: 2 },
  title: { color: "#102A34", fontSize: 31, fontWeight: "900", marginTop: 8 },
  subtitle: { color: "#667B7E", fontSize: 13, marginTop: 8, textAlign: "center" },
  formWrap: { width: "100%", maxWidth: 720, alignSelf: "center", padding: 22 },
  formCard: { backgroundColor: "#FFFFFF", borderRadius: 19, padding: 25, borderWidth: 1, borderColor: "#E5ECE8" },
  formTitle: { color: "#102A34", fontSize: 19, fontWeight: "900", textAlign: "right", marginBottom: 12 },
  label: { color: "#415A60", fontSize: 11, fontWeight: "800", marginTop: 14, marginBottom: 7, textAlign: "right" },
  input: { borderWidth: 1, borderColor: "#E3EBE7", backgroundColor: "#F8FAF9", borderRadius: 10, minHeight: 47, paddingHorizontal: 13, color: "#19383F", fontSize: 12, textAlign: "right" },
  notes: { minHeight: 100, paddingTop: 12, textAlignVertical: "top" },
  submit: { backgroundColor: "#07877B", borderRadius: 11, minHeight: 49, alignItems: "center", justifyContent: "center", marginTop: 22 },
  submitText: { color: "#FFFFFF", fontWeight: "900", fontSize: 13 },
  notice: { color: "#9AA6A7", fontSize: 9, textAlign: "center", marginTop: 12 },
  browse: { alignSelf: "center", padding: 18 },
  browseText: { color: "#07877B", fontSize: 12, fontWeight: "900" }
});
