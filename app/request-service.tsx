import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useServices } from "../hooks/useServices";
import { serviceCategories } from "../data/services";
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
  const [categoryId, setCategoryId] = useState(selected?.categoryId ?? "");
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [serviceName, setServiceName] = useState(selected?.title ?? "");
  const [serviceDropdownOpen, setServiceDropdownOpen] = useState(false);
  const availableServices = services.filter(item => item.active !== false && item.categoryId === categoryId);
  const selectedCategory = serviceCategories.find(item => item.id === categoryId);
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState("");

  const submit = async () => {
    const cleanName = name.trim();
    const cleanPhone = phone.trim();
    const normalizedPhone = cleanPhone.replace(/[٠-٩]/g, digit => String("٠١٢٣٤٥٦٧٨٩".indexOf(digit)));
    if (!cleanName) { setFeedback("من فضلك اكتب الاسم الثلاثي."); return; }
    if (cleanName.split(/\s+/).length < 3) { setFeedback("من فضلك اكتب الاسم كاملًا (ثلاثة أسماء على الأقل)."); return; }
    if (!cleanPhone) { setFeedback("من فضلك أدخل رقم التليفون."); return; }
    if (!/^[0-9+()\s-]+$/.test(normalizedPhone)) { setFeedback("رقم التليفون غير صحيح. من فضلك أدخل أرقامًا فقط."); return; }
    const phoneDigits = normalizedPhone.replace(/\D/g, "");
    if (phoneDigits.length < 10 || phoneDigits.length > 15) { setFeedback("رقم التليفون غير مكتمل أو أطول من اللازم. من فضلك راجع الرقم."); return; }
    if (!compoundName.trim()) { setFeedback("من فضلك اكتب اسم الكمباوند."); return; }
    if (!propertyNumber.trim()) { setFeedback("من فضلك أدخل رقم العقار."); return; }
    if (!propertyName.trim()) { setFeedback("من فضلك اكتب اسم العقار."); return; }
    if (!categoryId) { setFeedback("من فضلك اختر القسم."); return; }
    if (!serviceName.trim()) { setFeedback("من فضلك اختر الخدمة المطلوبة."); return; }
    setBusy(true);
    setFeedback("");
    try {
      await apiRequest("/api/requests", {
        method: "POST",
        body: JSON.stringify({
          name: cleanName,
          phone: cleanPhone,
          compoundName: compoundName.trim(),
          propertyNumber: propertyNumber.trim(),
          propertyName: propertyName.trim(),
          address: `الكمباوند: ${compoundName.trim()} - رقم العقار: ${propertyNumber.trim()} - اسم العقار: ${propertyName.trim()}`,
          service: serviceName.trim()
        })
      });
      setFeedback("تم إرسال طلبك بنجاح، برجاء الانتظار وسيتم التواصل معك قريبًا عبر الهاتف.");
      setName(""); setPhone(""); setCompoundName(""); setPropertyNumber(""); setPropertyName("");
    } catch {
      setFeedback("لم نتمكن من إرسال الطلب حاليًا بسبب مشكلة في الاتصال. بياناتك لم تُرسل، حاول مرة أخرى بعد قليل.");
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
            <Text style={styles.label}>القسم</Text>
            <Pressable
              onPress={() => { setCategoryDropdownOpen(open => !open); setServiceDropdownOpen(false); }}
              style={[styles.input, styles.dropdownTrigger]}
              accessibilityRole="button"
              accessibilityState={{ expanded: categoryDropdownOpen }}
            >
              <Text style={[styles.dropdownValue, !selectedCategory && styles.dropdownPlaceholder]}>{selectedCategory ? `${selectedCategory.icon}  ${selectedCategory.title}` : "اختر القسم"}</Text>
              <Text style={styles.dropdownArrow}>{categoryDropdownOpen ? "⌃" : "⌄"}</Text>
            </Pressable>
            {categoryDropdownOpen && (
              <View style={styles.dropdownList}>
                {serviceCategories.map(category => (
                  <Pressable key={category.id} onPress={() => { setCategoryId(category.id); setServiceName(""); setCategoryDropdownOpen(false); setServiceDropdownOpen(true); }} style={[styles.dropdownOption, categoryId === category.id && styles.dropdownOptionSelected]}>
                    <Text style={[styles.dropdownOptionText, categoryId === category.id && styles.dropdownOptionTextSelected]}>{category.title}</Text>
                    <Text style={styles.dropdownOptionIcon}>{category.icon}</Text>
                  </Pressable>
                ))}
              </View>
            )}
            <Text style={styles.label}>الخدمة المطلوبة</Text>
            <Pressable
              onPress={() => { if (categoryId) setServiceDropdownOpen(open => !open); }}
              style={[styles.input, styles.dropdownTrigger]}
              accessibilityRole="button"
              accessibilityState={{ expanded: serviceDropdownOpen }}
            >
              <Text style={[styles.dropdownValue, !serviceName && styles.dropdownPlaceholder]}>{serviceName || (categoryId ? "اختر الخدمة المطلوبة" : "اختر القسم أولاً")}</Text>
              <Text style={styles.dropdownArrow}>{serviceDropdownOpen ? "⌃" : "⌄"}</Text>
            </Pressable>
            {serviceDropdownOpen && (
              <View style={styles.dropdownList}>
                <ScrollView nestedScrollEnabled style={styles.dropdownScroll} keyboardShouldPersistTaps="handled">
                  {availableServices.map(item => (
                    <Pressable
                      key={item.id}
                      onPress={() => { setServiceName(item.title); setServiceDropdownOpen(false); }}
                      style={[styles.dropdownOption, serviceName === item.title && styles.dropdownOptionSelected]}
                    >
                      <Text style={[styles.dropdownOptionText, serviceName === item.title && styles.dropdownOptionTextSelected]}>{item.title}</Text>
                      <Text style={styles.dropdownOptionIcon}>{item.icon}</Text>
                    </Pressable>
                  ))}
                  {!availableServices.length && <Text style={styles.dropdownEmpty}>لا توجد خدمات متاحة في هذا القسم حاليًا.</Text>}
                </ScrollView>
              </View>
            )}
            <Pressable onPress={submit} disabled={busy} style={[styles.submit, busy && { opacity: 0.6 }]}>
              <Text style={styles.submitText}>{busy ? "جارٍ إرسال الطلب..." : "إرسال الطلب"}</Text>
            </Pressable>
            {!!feedback && <Text style={[styles.feedback, feedback.startsWith("تم إرسال") ? styles.success : styles.error]}>{feedback}</Text>}
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
  page: { flex: 1, backgroundColor: "#F5F7F6" },
  scrollContent: { flexGrow: 1 },
  brandRow: { width: "100%", maxWidth: 900, alignSelf: "center", paddingHorizontal: 24, paddingTop: 38, paddingBottom: 28, flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 12 },
  logoCircle: { width: 86, height: 86, borderRadius: 43, backgroundColor: "#0F766E", alignItems: "center", justifyContent: "center", borderWidth: 3, borderColor: "#C9DED8" },
  logoText: { color: "#FFFFFF", fontSize: 32, fontWeight: "900" , fontFamily: "Arial" },
  logoCaption: { color: "#FFFFFF", fontSize: 10, fontWeight: "900" , fontFamily: "Arial" },
  authorityCircle: { width: 86, height: 86, borderRadius: 43, backgroundColor: "#FFFFFF", borderWidth: 2, borderColor: "#C9DED8", alignItems: "center", justifyContent: "center", padding: 7 },
  authorityMark: { color: "#173B38", fontSize: 18, fontWeight: "900" , fontFamily: "Arial" },
  authorityCaption: { color: "#687C75", fontSize: 8, fontWeight: "800", textAlign: "center" , fontFamily: "Arial" },
  formHeading: { flex: 1, alignItems: "center" },
  kicker: { color: "#0F766E", fontSize: 10, fontWeight: "900", letterSpacing: 2 , fontFamily: "Arial" },
  title: { color: "#173B38", fontSize: 29, fontWeight: "900", marginTop: 5 , fontFamily: "Arial" },
  subtitle: { color: "#687C75", fontSize: 12, marginTop: 6, textAlign: "center" , fontFamily: "Arial" },
  formWrap: { width: "100%", maxWidth: 650, alignSelf: "center", paddingHorizontal: 20, paddingBottom: 22 },
  formCard: { backgroundColor: "#FFFFFF", borderRadius: 26, padding: 30, borderWidth: 1, borderColor: "#E2E9E4", shadowColor: "#173B38", shadowOpacity: 0.06, shadowRadius: 16, shadowOffset: { width: 0, height: 5 }, elevation: 2 },
  formTitle: { color: "#173B38", fontSize: 18, fontWeight: "900", textAlign: "right", marginBottom: 8 , fontFamily: "Arial" },
  label: { color: "#36596B", fontSize: 12, fontWeight: "800", marginTop: 14, marginBottom: 7, textAlign: "right" , fontFamily: "Arial" },
  input: { borderWidth: 1, borderColor: "#DCE7E3", backgroundColor: "#F5F7F6", borderRadius: 10, minHeight: 49, paddingHorizontal: 13, color: "#234541", fontSize: 13 , fontFamily: "Arial" },
  dropdownTrigger: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  dropdownValue: { color: "#234541", fontSize: 13, flex: 1, textAlign: "right" , fontFamily: "Arial" },
  dropdownPlaceholder: { color: "#89958F" , fontFamily: "Arial" },
  dropdownArrow: { color: "#0F766E", fontSize: 23, fontWeight: "900", marginLeft: 8 , fontFamily: "Arial" },
  dropdownList: { marginTop: 6, borderWidth: 1, borderColor: "#DCE7E3", borderRadius: 11, backgroundColor: "#FFFFFF", overflow: "hidden" },
  dropdownScroll: { maxHeight: 220 },
  dropdownOption: { minHeight: 45, paddingHorizontal: 13, flexDirection: "row", alignItems: "center", justifyContent: "space-between", borderBottomWidth: 1, borderBottomColor: "#E9EFEB" },
  dropdownOptionSelected: { backgroundColor: "#E6F2EF" },
  dropdownOptionText: { color: "#31534E", fontSize: 13, textAlign: "right", flex: 1 , fontFamily: "Arial" },
  dropdownOptionTextSelected: { color: "#0F766E", fontWeight: "900" , fontFamily: "Arial" },
  dropdownOptionIcon: { fontSize: 16, marginLeft: 10 },
  dropdownEmpty: { color: "#7B8D89", padding: 14, textAlign: "center", fontSize: 12 , fontFamily: "Arial" },
  submit: { backgroundColor: "#0F766E", borderRadius: 11, minHeight: 50, alignItems: "center", justifyContent: "center", marginTop: 24 },
  submitText: { color: "#FFFFFF", fontWeight: "900", fontSize: 14 , fontFamily: "Arial" },
  feedback: { textAlign: "center", marginTop: 12, paddingHorizontal: 12, fontSize: 13, fontWeight: "700", lineHeight: 21, fontFamily: "Arial" },
  error: { color: "#B5473B" },
  success: { color: "#0F766E" },
  welcome: { color: "#36596B", fontSize: 14, fontWeight: "800", textAlign: "center", marginTop: 20 , fontFamily: "Arial" },
  browse: { alignSelf: "center", padding: 16 },
  browseText: { color: "#0F766E", fontSize: 12, fontWeight: "900" , fontFamily: "Arial" },
});
