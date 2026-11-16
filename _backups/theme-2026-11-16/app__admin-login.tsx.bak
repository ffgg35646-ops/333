import { useState } from "react";
import { apiRequest, setAdminToken } from "../lib/api";
import { ImageBackground, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { router } from "expo-router";

export default function AdminLoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      setError("أدخل البريد الإلكتروني وكلمة المرور.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const result = await apiRequest<{ token: string }>("/api/admin/login", {
        method: "POST",
        body: JSON.stringify({ email, password })
      });
      await setAdminToken(result.token);
      router.replace("/admin" as never);
    } catch (err) {
      setError(err instanceof Error ? err.message : "تعذر تسجيل الدخول.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.page}>
      <View style={styles.topBar}>
        <Pressable onPress={() => router.push("/" as never)} style={styles.brand}>
          <View style={styles.logo}><Text style={styles.logoText}>خ</Text></View>
          <View><Text style={styles.brandName}>خدماتي</Text><Text style={styles.brandSub}>بوابة الإدارة</Text></View>
        </Pressable>
        <Pressable onPress={() => router.push("/" as never)}><Text style={styles.back}>العودة للموقع ←</Text></Pressable>
      </View>
      <View style={styles.body}>
        <ImageBackground source={{ uri: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1200&q=85" }} style={styles.visual} imageStyle={styles.visualImage}>
          <View style={styles.visualShade} />
          <View style={styles.visualCopy}>
            <Text style={styles.visualEyebrow}>KHADAMATI CONTROL CENTER</Text>
            <Text style={styles.visualTitle}>إدارة خدماتك،{"\n"}بكل سهولة.</Text>
            <Text style={styles.visualText}>مكان واحد لتنظيم الأقسام ومتابعة تجربة خدماتي.</Text>
          </View>
        </ImageBackground>
        <View style={styles.formSide}>
          <View style={styles.formCard}>
            <View style={styles.formIcon}><Text style={styles.formIconText}>⌘</Text></View>
            <Text style={styles.heading}>مرحبًا بعودتك</Text>
            <Text style={styles.subheading}>سجّل الدخول للوصول إلى لوحة التحكم</Text>
            <Text style={styles.label}>البريد الإلكتروني</Text>
            <TextInput value={email} onChangeText={setEmail} placeholder="admin@example.com" placeholderTextColor="#A4B0B4" keyboardType="email-address" autoCapitalize="none" style={styles.input} />
            <Text style={styles.label}>كلمة المرور</Text>
            <View style={styles.passwordWrap}>
              <TextInput value={password} onChangeText={setPassword} placeholder="أدخل كلمة المرور" placeholderTextColor="#A4B0B4" secureTextEntry={!showPassword} style={styles.passwordInput} />
              <Pressable onPress={() => setShowPassword(value => !value)}><Text style={styles.showPassword}>{showPassword ? "إخفاء" : "إظهار"}</Text></Pressable>
            </View>
            <Pressable onPress={handleLogin} disabled={busy} style={[styles.submit, busy && { opacity: 0.65 }]}><Text style={styles.submitText}>{busy ? "جارٍ التحقق..." : "تسجيل الدخول"}</Text></Pressable>
            {!!error && <Text style={{ color: "#B42318", fontSize: 12, marginTop: 12, textAlign: "center" }}>{error}</Text>}
            <Text style={styles.notice}>الدخول محمي بحساب الإدارة المسجل في قاعدة البيانات.</Text>
          </View>
        </View>
      </View>
      <Text style={styles.copyright}>© {new Date().getFullYear()} خدماتي · لوحة إدارة المنصة</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { flexGrow: 1, minHeight: "100%", backgroundColor: "#F4F7F6" },
  topBar: { width: "100%", maxWidth: 1240, alignSelf: "center", minHeight: 82, paddingHorizontal: 24, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  brand: { flexDirection: "row", alignItems: "center", gap: 10 },
  logo: { width: 44, height: 44, backgroundColor: "#07877B", borderRadius: 14, alignItems: "center", justifyContent: "center" },
  logoText: { color: "#FFFFFF", fontSize: 26, fontWeight: "900" },
  brandName: { color: "#102A34", fontSize: 18, fontWeight: "900", textAlign: "right" },
  brandSub: { color: "#819095", fontSize: 11, marginTop: 3, textAlign: "right" },
  back: { color: "#07877B", fontSize: 12, fontWeight: "800" },
  body: { width: "100%", maxWidth: 1160, alignSelf: "center", flex: 1, minHeight: 610, paddingHorizontal: 22, paddingVertical: 24, flexDirection: "row", gap: 24 },
  visual: { flex: 1, minHeight: 560, borderRadius: 24, overflow: "hidden", backgroundColor: "#102A34", justifyContent: "flex-end" },
  visualImage: { borderRadius: 24 },
  visualShade: { ...StyleSheet.absoluteFill, backgroundColor: "rgba(12, 39, 44, 0.74)" },
  visualCopy: { padding: 38, alignItems: "flex-start" },
  visualEyebrow: { color: "#A9E0D7", fontSize: 9, fontWeight: "900", letterSpacing: 2 },
  visualTitle: { color: "#FFFFFF", fontSize: 38, fontWeight: "900", lineHeight: 52, marginTop: 15, textAlign: "right" },
  visualText: { color: "#D0DEDE", fontSize: 14, lineHeight: 25, marginTop: 12, textAlign: "right" },
  formSide: { flex: 1, justifyContent: "center", alignItems: "center" },
  formCard: { width: "100%", maxWidth: 470, backgroundColor: "#FFFFFF", borderRadius: 23, padding: 30, borderWidth: 1, borderColor: "#E6ECE9", shadowColor: "#173A3C", shadowOpacity: 0.06, shadowRadius: 20, shadowOffset: { width: 0, height: 8 }, elevation: 3 },
  formIcon: { width: 52, height: 52, backgroundColor: "#E5F4EF", borderRadius: 17, alignItems: "center", justifyContent: "center", marginBottom: 19, alignSelf: "flex-end" },
  formIconText: { color: "#07877B", fontSize: 28, fontWeight: "900" },
  heading: { color: "#102A34", fontSize: 26, fontWeight: "900", textAlign: "right" },
  subheading: { color: "#829095", fontSize: 12, marginTop: 8, marginBottom: 28, textAlign: "right" },
  label: { color: "#334D54", fontSize: 12, fontWeight: "800", marginBottom: 8, marginTop: 14, textAlign: "right" },
  input: { width: "100%", height: 51, backgroundColor: "#F7F9F8", borderWidth: 1, borderColor: "#E4EBE8", borderRadius: 11, paddingHorizontal: 14, color: "#17343D", fontSize: 13, textAlign: "left" },
  passwordWrap: { width: "100%", height: 51, backgroundColor: "#F7F9F8", borderWidth: 1, borderColor: "#E4EBE8", borderRadius: 11, paddingHorizontal: 14, flexDirection: "row", alignItems: "center", gap: 10 },
  passwordInput: { flex: 1, color: "#17343D", fontSize: 13, textAlign: "right", height: "100%" },
  showPassword: { color: "#07877B", fontSize: 11, fontWeight: "800" },
  submit: { height: 52, backgroundColor: "#07877B", borderRadius: 12, alignItems: "center", justifyContent: "center", marginTop: 24 },
  submitText: { color: "#FFFFFF", fontWeight: "900", fontSize: 14 },
  notice: { color: "#9AA6A7", fontSize: 10, lineHeight: 18, marginTop: 12, textAlign: "center" },
  previewDivider: { flexDirection: "row", alignItems: "center", gap: 12, marginTop: 22 },
  line: { height: 1, backgroundColor: "#E8EEEB", flex: 1 },
  or: { color: "#9AA6A7", fontSize: 10 },
  preview: { borderWidth: 1, borderColor: "#D7E9E3", borderRadius: 11, paddingVertical: 13, alignItems: "center", marginTop: 14 },
  previewText: { color: "#07877B", fontWeight: "900", fontSize: 12 },
  copyright: { color: "#93A1A3", fontSize: 10, textAlign: "center", padding: 20 }
});
