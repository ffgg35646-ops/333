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
  const [compoundName, setCompoundName] = useState("");
  const [propertyNumber, setPropertyNumber] = useState("");
  const [propertyName, setPropertyName] = useState("");
  const [serviceName, setServiceName] = useState(selected?.title ?? "");
  const [serviceDropdownOpen, setServiceDropdownOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState("");

  const submit = async () => {
    if (!name.trim() || !phone.trim() || !compoundName.trim() || !propertyNumber.trim() || !propertyName.trim() || !serviceName.trim()) {
      setFeedback("من فضلك أكمل جميع البيانات المطلوبة.");
      return;
    }
    setBusy(true);
    setFeedback("");
    try {
      await apiRequest("/api/requests", {
        method: "POST",
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          compoundName: compoundName.trim(),
          propertyNumber: propertyNumber.trim(),
          propertyName: propertyName.trim(),
          address: `الكمباوند: ${compoundName.trim()} - رقم العقار: ${propertyNumber.trim()} - اسم العقار: ${propertyName.trim()}`,
          service: serviceName.trim()
        })
      });
      Alert.alert("خدماتي", "سيتم التواصل معك قريبًا.");
      setName(""); setPhone(""); setCompoundName(""); setPropertyNumber(""); setPropertyName("");
    } catch (error) {
      setFeedback(error instanceof Error ? error.message : "تعذر إرسال الطلب الآن، حاول مرة أخرى.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <View style={styles.page}>
      <SiteHeader />
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.brandRow}>
          <View style={styles.logoCircle}><Text style={styles.logoText}>خ</Text><Text style={styles.logoCaption}>خدماتي</Text></View>
          <View style={styles.formHeading}><Text style={styles.kicker}>KHADAMATI</Text><Text style={styles.title}>اطلب خدمة</Text><Text style={styles.subtitle}>سجّل بياناتك وسنتواصل معك قريبًا.</Text></View>
          <View style={styles.authorityCircle}><Text style={styles.authorityMark}>هيئة</Text><Text style={styles.authorityCaption}>المجتمعات العمرانية</Text></View>
        </View>
        <View style={styles.formWrap}>
          <View style={styles.formCard}>
            <Text style={styles.formTitle}>بيانات العميل</Text>
            <Text style={styles.label}>الاسم ثلاثي</Text>
            <TextInput value={name} onChangeText={setName} placeholder="اكتب الاسم الثلاثي" style={styles.input} textAlign="right" />
            <Text style={styles.label}>رقم التليفون</Text>
            <TextInput value={phone} onChangeText={setPhone} placeholder="اكتب رقم التليفون" keyboardType="phone-pad" style={styles.input} textAlign="right" />
            <Text style={styles.label}>اسم الكمباوند</Text>
            <TextInput value={compoundName} onChangeText={setCompoundName} placeholder="اكتب اسم الكمباوند" style={styles.input} textAlign="right" />
            <Text style={styles.label}>رقم العقار</Text>
            <TextInput value={propertyNumber} onChangeText={setPropertyNumber} placeholder="اكتب رقم العقار" style={styles.input} textAlign="right" />
            <Text style={styles.label}>اسم العقار</Text>
            <TextInput value={propertyName} onChangeText={setPropertyName} placeholder="اكتب اسم العقار" style={styles.input} textAlign="right" />
            <Text style={styles.label}>الخدمة المطلوبة</Text>
            <Pressable
              onPress={() => setServiceDropdownOpen(open => !open)}
              style={[styles.input, styles.dropdownTrigger]}
              accessibilityRole="button"
              accessibilityState={{ expanded: serviceDropdownOpen }}
            >
              <Text style={[styles.dropdownValue, !serviceName && styles.dropdownPlaceholder]}>{serviceName || "اختر الخدمة المطلوبة"}</Text>
              <Text style={styles.dropdownArrow}>{serviceDropdownOpen ? "⌃" : "⌄"}</Text>
            </Pressable>
            {serviceDropdownOpen && (
              <View style={styles.dropdownList}>
                <ScrollView nestedScrollEnabled style={styles.dropdownScroll} keyboardShouldPersistTaps="handled">
                  {services.filter(item => item.active !== false).map(item => (
                    <Pressable
                      key={item.id}
                      onPress={() => { setServiceName(item.title); setServiceDropdownOpen(false); }}
                      style={[styles.dropdownOption, serviceName === item.title && styles.dropdownOptionSelected]}
                    >
                      <Text style={[styles.dropdownOptionText, serviceName === item.title && styles.dropdownOptionTextSelected]}>{item.title}</Text>
                      <Text style={styles.dropdownOptionIcon}>{item.icon}</Text>
                    </Pressable>
                  ))}
                  {!services.some(item => item.active !== false) && <Text style={styles.dropdownEmpty}>لا توجد خدمات متاحة حاليًا.</Text>}
                </ScrollView>
              </View>
            )}
            <Pressable onPress={submit} disabled={busy} style={[styles.submit, busy && { opacity: 0.6 }]}>
              <Text style={styles.submitText}>{busy ? "جارٍ إرسال الطلب..." : "إرسال الطلب"}</Text>
            </Pressable>
            {!!feedback && <Text style={styles.error}>{feedback}</Text>}
          </View>
          <Text style={styles.welcome}>أهلاً بك في خدماتي، نسعد بخدمتك {name.trim() ? `يا ${name.trim()}` : ""}</Text>
          <Pressable onPress={() => router.push("/services" as never)} style={styles.browse}><Text style={styles.browseText}>تصفح الخدمات ←</Text></Pressable>
        </View>
        <SiteFooter />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: "#F7F9FF" },
  scrollContent: { flexGrow: 1 },
  brandRow: { width: "100%", maxWidth: 900, alignSelf: "center", paddingHorizontal: 20, paddingTop: 30, paddingBottom: 20, flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 12 },
  logoCircle: { width: 86, height: 86, borderRadius: 43, backgroundColor: "#087D73", alignItems: "center", justifyContent: "center", borderWidth: 3, borderColor: "#D5EAE4" },
  logoText: { color: "#FFFFFF", fontSize: 32, fontWeight: "900" },
  logoCaption: { color: "#FFFFFF", fontSize: 10, fontWeight: "900" },
  authorityCircle: { width: 86, height: 86, borderRadius: 43, backgroundColor: "#FFFFFF", borderWidth: 2, borderColor: "#D7E2DE", alignItems: "center", justifyContent: "center", padding: 7 },
  authorityMark: { color: "#234D50", fontSize: 18, fontWeight: "900" },
  authorityCaption: { color: "#526B6A", fontSize: 8, fontWeight: "800", textAlign: "center" },
  formHeading: { flex: 1, alignItems: "center" },
  kicker: { color: "#0738C8", fontSize: 10, fontWeight: "900", letterSpacing: 2 },
  title: { color: "#10245F", fontSize: 29, fontWeight: "900", marginTop: 5 },
  subtitle: { color: "#667B7E", fontSize: 12, marginTop: 6, textAlign: "center" },
  formWrap: { width: "100%", maxWidth: 650, alignSelf: "center", paddingHorizontal: 20, paddingBottom: 22 },
  formCard: { backgroundColor: "#FFFFFF", borderRadius: 19, padding: 24, borderWidth: 1, borderColor: "#E1E8F8" },
  formTitle: { color: "#10245F", fontSize: 18, fontWeight: "900", textAlign: "right", marginBottom: 8 },
  label: { color: "#415A60", fontSize: 12, fontWeight: "800", marginTop: 14, marginBottom: 7, textAlign: "right" },
  input: { borderWidth: 1, borderColor: "#E1E8F8", backgroundColor: "#F7F9FF", borderRadius: 10, minHeight: 49, paddingHorizontal: 13, color: "#19383F", fontSize: 13 },
  dropdownTrigger: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  dropdownValue: { color: "#19383F", fontSize: 13, flex: 1, textAlign: "right" },
  dropdownPlaceholder: { color: "#8A9B98" },
  dropdownArrow: { color: "#0738C8", fontSize: 23, fontWeight: "900", marginLeft: 8 },
  dropdownList: { marginTop: 6, borderWidth: 1, borderColor: "#DCE8E2", borderRadius: 11, backgroundColor: "#FFFFFF", overflow: "hidden" },
  dropdownScroll: { maxHeight: 220 },
  dropdownOption: { minHeight: 45, paddingHorizontal: 13, flexDirection: "row", alignItems: "center", justifyContent: "space-between", borderBottomWidth: 1, borderBottomColor: "#EEF2F0" },
  dropdownOptionSelected: { backgroundColor: "#EAF6F2" },
  dropdownOptionText: { color: "#29464A", fontSize: 13, textAlign: "right", flex: 1 },
  dropdownOptionTextSelected: { color: "#087D73", fontWeight: "900" },
  dropdownOptionIcon: { fontSize: 16, marginLeft: 10 },
  dropdownEmpty: { color: "#7B8D89", padding: 14, textAlign: "center", fontSize: 12 },
  submit: { backgroundColor: "#FFC52F", borderRadius: 11, minHeight: 50, alignItems: "center", justifyContent: "center", marginTop: 24 },
  submitText: { color: "#FFFFFF", fontWeight: "900", fontSize: 14 },
  error: { color: "#B42318", textAlign: "center", marginTop: 12, fontSize: 12, fontWeight: "700" },
  welcome: { color: "#365B58", fontSize: 14, fontWeight: "800", textAlign: "center", marginTop: 20 },
  browse: { alignSelf: "center", padding: 16 },
  browseText: { color: "#0738C8", fontSize: 12, fontWeight: "900" }
});
