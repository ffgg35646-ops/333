import { ReactNode } from "react";
import { Pressable, StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { router } from "expo-router";

type HeaderProps = { active?: string };

export function SiteHeader({ active }: HeaderProps) {
  const { width } = useWindowDimensions();
  const compact = width < 720;
  const go = (path: string) => router.push(path as never);
  return (
    <View style={styles.headerWrap}>
      <View style={[styles.header, compact && styles.headerCompact]}>
        <Pressable onPress={() => go("/")} style={styles.brand}>
          <View style={styles.brandMark}><Text style={styles.brandMarkText}>خ</Text></View>
          <View>
            <Text style={styles.brandName}>خدماتي</Text>
            <Text style={styles.brandTag}>كل خدماتك في مكان واحد</Text>
          </View>
        </Pressable>
        <View style={[styles.nav, compact && styles.navCompact]}>
          <Pressable onPress={() => go("/")} style={styles.navItem}><Text style={[styles.navText, active === "home" && styles.navActive]}>الرئيسية</Text></Pressable>
          <Pressable onPress={() => go("/services")} style={styles.navItem}><Text style={[styles.navText, active === "services" && styles.navActive]}>الخدمات</Text></Pressable>
          <Pressable onPress={() => go("/request-service")} style={styles.navItem}><Text style={styles.navText}>اطلب خدمة</Text></Pressable>
          {!compact && <Pressable onPress={() => go("/about")} style={styles.navItem}><Text style={[styles.navText, active === "about" && styles.navActive]}>من نحن</Text></Pressable>}
        </View>
        <Pressable onPress={() => go("/admin-login")} style={[styles.adminButton, compact && styles.adminButtonCompact]}>
          <Text style={styles.adminButtonText}>دخول الإدارة</Text>
        </Pressable>
      </View>
      {compact && <Pressable onPress={() => go("/about")} style={styles.mobileAbout}><Text style={styles.mobileAboutText}>من نحن</Text></Pressable>}
    </View>
  );
}

type FooterProps = { children?: ReactNode };
export function SiteFooter({ children }: FooterProps) {
  const go = (path: string) => router.push(path as never);
  return (
    <View style={styles.footer}>
      <View style={styles.footerInner}>
        <View style={styles.footerBrand}>
          <View style={styles.footerLogo}><Text style={styles.footerLogoText}>خ</Text></View>
          <Text style={styles.footerTitle}>خدماتي</Text>
          <Text style={styles.footerDescription}>منصة تجمع لك الخدمات المنزلية والمهنية في مكان واحد، بخطوات بسيطة وتجربة واضحة.</Text>
        </View>
        <View style={styles.footerColumn}>
          <Text style={styles.footerHeading}>روابط مهمة</Text>
          <Pressable onPress={() => go("/")}><Text style={styles.footerLink}>الرئيسية</Text></Pressable>
          <Pressable onPress={() => go("/services")}><Text style={styles.footerLink}>كل الخدمات</Text></Pressable>
          <Pressable onPress={() => go("/request-service")}><Text style={styles.footerLink}>اطلب خدمة</Text></Pressable>
          <Pressable onPress={() => go("/about")}><Text style={styles.footerLink}>About Us · من نحن</Text></Pressable>
        </View>
        <View style={styles.footerColumn}>
          <Text style={styles.footerHeading}>خدماتي</Text>
          <Text style={styles.footerMuted}>خدمات رئيسية ومميزة</Text>
          <Text style={styles.footerMuted}>تجربة واحدة على الويب والموبايل</Text>
          <Text style={styles.footerMuted}>إدارة منظمة للأقسام</Text>
          {children}
        </View>
      </View>
      <View style={styles.footerBottom}><Text style={styles.footerBottomText}>© {new Date().getFullYear()} خدماتي. جميع الحقوق محفوظة.</Text></View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerWrap: { backgroundColor: "#FFFFFF", borderBottomWidth: 1, borderBottomColor: "#E9EEF2", zIndex: 10 },
  header: { width: "100%", maxWidth: 1240, alignSelf: "center", minHeight: 86, paddingHorizontal: 24, flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 18 },
  headerCompact: { flexWrap: "wrap", justifyContent: "center", paddingVertical: 12, gap: 12 },
  brand: { flexDirection: "row", alignItems: "center", gap: 10 },
  brandMark: { width: 46, height: 46, borderRadius: 15, backgroundColor: "#0C756C", alignItems: "center", justifyContent: "center" },
  brandMarkText: { color: "#FFFFFF", fontSize: 27, fontWeight: "900" },
  brandName: { color: "#102A34", fontSize: 20, fontWeight: "900", textAlign: "right" },
  brandTag: { color: "#7D8B91", fontSize: 10, marginTop: 2, textAlign: "right" },
  nav: { flexDirection: "row", alignItems: "center", gap: 24 },
  navCompact: { width: "100%", justifyContent: "center", gap: 18 },
  navItem: { paddingVertical: 8 },
  navText: { color: "#52636A", fontSize: 14, fontWeight: "700" },
  navActive: { color: "#07877B" },
  adminButton: { backgroundColor: "#102A34", borderRadius: 12, paddingVertical: 12, paddingHorizontal: 18 },
  adminButtonCompact: { paddingVertical: 9, paddingHorizontal: 14 },
  adminButtonText: { color: "#FFFFFF", fontSize: 12, fontWeight: "800" },
  mobileAbout: { alignSelf: "center", paddingBottom: 10 },
  mobileAboutText: { color: "#52636A", fontSize: 12, fontWeight: "700" },
  footer: { backgroundColor: "#102A34", marginTop: 34 },
  footerInner: { width: "100%", maxWidth: 1240, alignSelf: "center", paddingHorizontal: 24, paddingVertical: 42, flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", gap: 34 },
  footerBrand: { width: 300, maxWidth: "100%" },
  footerLogo: { width: 40, height: 40, borderRadius: 13, backgroundColor: "#0E8F83", alignItems: "center", justifyContent: "center", marginBottom: 12 },
  footerLogoText: { color: "#FFFFFF", fontWeight: "900", fontSize: 24 },
  footerTitle: { color: "#FFFFFF", fontSize: 21, fontWeight: "900", textAlign: "right" },
  footerDescription: { color: "#BDCCD0", fontSize: 13, lineHeight: 23, marginTop: 10, textAlign: "right" },
  footerColumn: { minWidth: 170, gap: 12 },
  footerHeading: { color: "#FFFFFF", fontSize: 15, fontWeight: "900", marginBottom: 5, textAlign: "right" },
  footerLink: { color: "#C5D2D5", fontSize: 13, textAlign: "right" },
  footerMuted: { color: "#91A7AD", fontSize: 12, textAlign: "right" },
  footerBottom: { borderTopWidth: 1, borderTopColor: "#2A434B", paddingVertical: 16, paddingHorizontal: 24 },
  footerBottomText: { color: "#91A7AD", textAlign: "center", fontSize: 11 }
});
