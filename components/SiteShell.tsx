import type { ReactNode } from "react";
import { Pressable, StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { router } from "expo-router";
import { useSiteSettings } from "../hooks/useSiteSettings";

type HeaderProps = { active?: string };

export function SiteHeader({ active }: HeaderProps) {
  const { width } = useWindowDimensions();
  const compact = width < 720;
  const settings = useSiteSettings();
  const go = (path: string) => router.push(path as never);
  const links = [
    { key: "home", label: "الرئيسية", path: "/" },
    { key: "services", label: "الخدمات", path: "/services" },
    { key: "request", label: "اطلب خدمة", path: "/request-service" },
    { key: "about", label: "من نحن", path: "/about" }
  ];
  return (
    <View style={styles.headerWrap}>
      <View style={[styles.header, compact && styles.headerCompact]}>
        <Pressable onPress={() => go("/")} style={styles.brand}>
          <View style={styles.brandMark}><Text style={styles.brandMarkText}>خ</Text></View>
          <View>
            <Text style={styles.brandName}>{settings.siteName}</Text>
            <Text style={styles.brandTag}>كل خدماتك في مكان واحد</Text>
          </View>
        </Pressable>
        {!compact && (
          <View style={styles.nav}>
            {links.map(link => (
              <Pressable key={link.key} onPress={() => go(link.path)} style={[styles.navItem, active === link.key && styles.navItemActive]}>
                <Text style={[styles.navText, active === link.key && styles.navActive]}>{link.label}</Text>
              </Pressable>
            ))}
          </View>
        )}
        <Pressable onPress={() => go("/admin-login")} style={[styles.accountButton, compact && styles.accountButtonCompact]}>
          <Text style={styles.accountIcon}>◉</Text>
          <Text style={styles.accountButtonText}>حسابي</Text>
        </Pressable>
      </View>
      {compact && (
        <View style={styles.mobileNav}>
          {links.slice(0, 3).map(link => (
            <Pressable key={link.key} onPress={() => go(link.path)} style={styles.mobileNavItem}>
              <Text style={[styles.mobileNavText, active === link.key && styles.mobileNavActive]}>{link.label}</Text>
              {active === link.key && <View style={styles.mobileNavIndicator} />}
            </Pressable>
          ))}
          <Pressable onPress={() => go("/admin-login")} style={styles.mobileNavItem}>
            <Text style={styles.mobileNavText}>حسابي</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

type FooterProps = { children?: ReactNode };
export function SiteFooter({ children }: FooterProps) {
  const go = (path: string) => router.push(path as never);
  const settings = useSiteSettings();
  return (
    <View style={styles.footer}>
      <View style={styles.footerInner}>
        <View style={styles.footerBrand}>
          <View style={styles.footerLogo}><Text style={styles.footerLogoText}>خ</Text></View>
          <Text style={styles.footerTitle}>{settings.siteName}</Text>
          <Text style={styles.footerDescription}>{settings.siteDescription}</Text>
        </View>
        <View style={styles.footerColumn}>
          <Text style={styles.footerHeading}>روابط مهمة</Text>
          <Pressable onPress={() => go("/")}><Text style={styles.footerLink}>الرئيسية</Text></Pressable>
          <Pressable onPress={() => go("/services")}><Text style={styles.footerLink}>كل الخدمات</Text></Pressable>
          <Pressable onPress={() => go("/request-service")}><Text style={styles.footerLink}>اطلب خدمة</Text></Pressable>
          <Pressable onPress={() => go("/about")}><Text style={styles.footerLink}>من نحن</Text></Pressable>
        </View>
        <View style={styles.footerColumn}>
          <Text style={styles.footerHeading}>خدماتي</Text>
          <Text style={styles.footerMuted}>خدمات رئيسية ومميزة</Text>
          <Text style={styles.footerMuted}>تجربة واحدة على الويب والموبايل</Text>
          <Text style={styles.footerMuted}>إدارة منظمة للأقسام</Text>
          {!!settings.contactPhone && <Text style={styles.footerMuted}>الهاتف: {settings.contactPhone}</Text>}
          {!!settings.whatsappNumber && <Text style={styles.footerMuted}>واتساب: {settings.whatsappNumber}</Text>}
          {!!settings.contactEmail && <Text style={styles.footerMuted}>البريد: {settings.contactEmail}</Text>}
          {children}
        </View>
      </View>
      <View style={styles.footerBottom}><Text style={styles.footerBottomText}>© {new Date().getFullYear()} خدماتي. جميع الحقوق محفوظة.</Text></View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerWrap: { backgroundColor: "#FBFBF8", borderBottomWidth: 1, borderBottomColor: "#E9EBE5", zIndex: 10 },
  header: { width: "100%", maxWidth: 1240, alignSelf: "center", minHeight: 78, paddingHorizontal: 24, flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 18 },
  headerCompact: { minHeight: 68, paddingVertical: 9, paddingHorizontal: 17 },
  brand: { flexDirection: "row", alignItems: "center", gap: 10 },
  brandMark: { width: 42, height: 42, borderRadius: 14, backgroundColor: "#668F84", alignItems: "center", justifyContent: "center" },
  brandMarkText: { color: "#FFFFFF", fontSize: 25, fontWeight: "900" },
  brandName: { color: "#343D39", fontSize: 19, fontWeight: "900", textAlign: "right" },
  brandTag: { color: "#929A94", fontSize: 10, marginTop: 2, textAlign: "right" },
  nav: { flexDirection: "row", alignItems: "center", gap: 7 },
  navItem: { paddingVertical: 10, paddingHorizontal: 13, borderRadius: 10 },
  navItemActive: { backgroundColor: "#EDF3EF" },
  navText: { color: "#6F7973", fontSize: 13, fontWeight: "700" },
  navActive: { color: "#527F73", fontWeight: "900" },
  accountButton: { backgroundColor: "#414B46", borderRadius: 11, paddingVertical: 11, paddingHorizontal: 16, flexDirection: "row", alignItems: "center", gap: 7 },
  accountButtonCompact: { paddingVertical: 9, paddingHorizontal: 12 },
  accountIcon: { color: "#DCE9E2", fontSize: 13 },
  accountButtonText: { color: "#FFFFFF", fontSize: 12, fontWeight: "800" },
  mobileNav: { width: "100%", backgroundColor: "#FBFBF8", borderTopWidth: 1, borderTopColor: "#ECEEE8", flexDirection: "row", justifyContent: "space-around", paddingHorizontal: 7, paddingTop: 8, paddingBottom: 10 },
  mobileNavItem: { minWidth: 66, alignItems: "center", justifyContent: "center", gap: 5 },
  mobileNavText: { color: "#89918B", fontSize: 11, fontWeight: "700" },
  mobileNavActive: { color: "#527F73", fontWeight: "900" },
  mobileNavIndicator: { width: 16, height: 3, borderRadius: 3, backgroundColor: "#7FA89B" },
  footer: { backgroundColor: "#343E39", marginTop: 34 },
  footerInner: { width: "100%", maxWidth: 1240, alignSelf: "center", paddingHorizontal: 24, paddingVertical: 42, flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", gap: 34 },
  footerBrand: { width: 300, maxWidth: "100%" },
  footerLogo: { width: 40, height: 40, borderRadius: 13, backgroundColor: "#668F84", alignItems: "center", justifyContent: "center", marginBottom: 12 },
  footerLogoText: { color: "#FFFFFF", fontWeight: "900", fontSize: 24 },
  footerTitle: { color: "#FFFFFF", fontSize: 21, fontWeight: "900", textAlign: "right" },
  footerDescription: { color: "#D0D8D2", fontSize: 13, lineHeight: 23, marginTop: 10, textAlign: "right" },
  footerColumn: { minWidth: 170, gap: 12 },
  footerHeading: { color: "#FFFFFF", fontSize: 15, fontWeight: "900", marginBottom: 5, textAlign: "right" },
  footerLink: { color: "#D4DDD6", fontSize: 13, textAlign: "right" },
  footerMuted: { color: "#B2BDB5", fontSize: 12, textAlign: "right" },
  footerBottom: { borderTopWidth: 1, borderTopColor: "#4B5750", paddingVertical: 16, paddingHorizontal: 24 },
  footerBottomText: { color: "#B2BDB5", textAlign: "center", fontSize: 11 }
});
