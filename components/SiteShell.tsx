import type { ReactNode } from "react";
import { Pressable, StyleSheet, Text, View, useWindowDimensions } from "react-native";
import * as Linking from "expo-linking";
import { router } from "expo-router";
import { useSiteSettings } from "../hooks/useSiteSettings";

// Add the real APK and iOS distribution URLs here when the builds are ready.
// Keep them empty until the files or approved installation pages exist.
const APP_DOWNLOAD_LINKS = {
  android: "",
  ios: ""
};

type HeaderProps = { active?: string };

function AppDownloadLinks({ compact = false }: { compact?: boolean }) {
  const openDownload = (url: string) => {
    if (url) void Linking.openURL(url);
  };

  return (
    <View style={[styles.downloadLinks, compact && styles.downloadLinksCompact]}>
      <Pressable
        accessibilityRole="link"
        accessibilityLabel="تحميل تطبيق Android"
        disabled={!APP_DOWNLOAD_LINKS.android}
        onPress={() => openDownload(APP_DOWNLOAD_LINKS.android)}
        style={[styles.downloadButton, compact && styles.downloadButtonCompact, !APP_DOWNLOAD_LINKS.android && styles.downloadButtonDisabled]}
      >
        <View style={styles.playMark}><Text style={styles.playMarkText}>▶</Text></View>
        <View>
          <Text style={styles.downloadEyebrow}>تحميل التطبيق</Text>
          <Text style={[styles.downloadLabel, compact && styles.downloadLabelCompact]}>Google Play</Text>
        </View>
      </Pressable>
      <Pressable
        accessibilityRole="link"
        accessibilityLabel="تحميل تطبيق iPhone"
        disabled={!APP_DOWNLOAD_LINKS.ios}
        onPress={() => openDownload(APP_DOWNLOAD_LINKS.ios)}
        style={[styles.downloadButton, compact && styles.downloadButtonCompact, !APP_DOWNLOAD_LINKS.ios && styles.downloadButtonDisabled]}
      >
        <Text style={styles.appleMark}>●</Text>
        <View>
          <Text style={styles.downloadEyebrow}>تحميل التطبيق</Text>
          <Text style={[styles.downloadLabel, compact && styles.downloadLabelCompact]}>iOS</Text>
        </View>
      </Pressable>
    </View>
  );
}

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
        {!compact ? (
          <View style={styles.nav}>
            {links.map(link => (
              <Pressable key={link.key} onPress={() => go(link.path)} style={[styles.navItem, active === link.key && styles.navItemActive]}>
                <Text style={[styles.navText, active === link.key && styles.navActive]}>{link.label}</Text>
              </Pressable>
            ))}
            <AppDownloadLinks />
          </View>
        ) : (
          <AppDownloadLinks compact />
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
  headerWrap: { backgroundColor: "#FFFFFF", borderBottomWidth: 1, borderBottomColor: "#DCECF4", zIndex: 10 },
  header: { width: "100%", maxWidth: 1240, alignSelf: "center", minHeight: 82, paddingHorizontal: 28, flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 22 },
  headerCompact: { minHeight: 68, paddingVertical: 9, paddingHorizontal: 12, gap: 8 },
  brand: { flexDirection: "row", alignItems: "center", gap: 10 },
  brandMark: { width: 42, height: 42, borderRadius: 14, backgroundColor: "#078BCB", alignItems: "center", justifyContent: "center" },
  brandMarkText: { color: "#FFFFFF", fontSize: 25, fontWeight: "900" },
  brandName: { color: "#123B56", fontSize: 19, fontWeight: "900", textAlign: "right" },
  brandTag: { color: "#929A94", fontSize: 10, marginTop: 2, textAlign: "right" },
  nav: { flexDirection: "row", alignItems: "center", gap: 5, flexWrap: "wrap", justifyContent: "center" },
  navItem: { paddingVertical: 11, paddingHorizontal: 14, borderRadius: 11 },
  navItemActive: { backgroundColor: "#E4F5FC" },
  navText: { color: "#6F7973", fontSize: 13, fontWeight: "700" },
  navActive: { color: "#078BCB", fontWeight: "900" },
  downloadLinks: { flexDirection: "row", alignItems: "center", gap: 7, marginStart: 5 },
  downloadLinksCompact: { gap: 4, marginStart: 0 },
  downloadButton: { flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: "#F0F5FF", borderWidth: 1, borderColor: "#CDEBF7", borderRadius: 10, paddingVertical: 7, paddingHorizontal: 9 },
  downloadButtonCompact: { paddingVertical: 6, paddingHorizontal: 6, gap: 3, borderRadius: 9 },
  downloadButtonDisabled: { opacity: 0.72 },
  playMark: { width: 23, height: 23, borderRadius: 7, backgroundColor: "#078BCB", alignItems: "center", justifyContent: "center" },
  playMarkText: { color: "#FFFFFF", fontSize: 11, marginStart: 2 },
  appleMark: { color: "#078BCB", fontSize: 21, fontWeight: "900", width: 23, textAlign: "center" },
  downloadEyebrow: { color: "#7A8AA8", fontSize: 8, textAlign: "left" },
  downloadLabel: { color: "#123B56", fontSize: 10, fontWeight: "900", textAlign: "left" },
  downloadLabelCompact: { fontSize: 9 },
  accountButton: { backgroundColor: "#078BCB", borderRadius: 11, paddingVertical: 12, paddingHorizontal: 17, flexDirection: "row", alignItems: "center", gap: 7 },
  accountButtonCompact: { paddingVertical: 9, paddingHorizontal: 9, gap: 4 },
  accountIcon: { color: "#123B56", fontSize: 13 },
  accountButtonText: { color: "#123B56", fontSize: 12, fontWeight: "800" },
  mobileNav: { width: "100%", backgroundColor: "#FFFFFF", borderTopWidth: 1, borderTopColor: "#ECEEE8", flexDirection: "row", justifyContent: "space-around", paddingHorizontal: 7, paddingTop: 8, paddingBottom: 10 },
  mobileNavItem: { minWidth: 66, alignItems: "center", justifyContent: "center", gap: 5 },
  mobileNavText: { color: "#89918B", fontSize: 11, fontWeight: "700" },
  mobileNavActive: { color: "#078BCB", fontWeight: "900" },
  mobileNavIndicator: { width: 16, height: 3, borderRadius: 3, backgroundColor: "#078BCB" },
  footer: { backgroundColor: "#103D5C", marginTop: 48 },
  footerInner: { width: "100%", maxWidth: 1240, alignSelf: "center", paddingHorizontal: 24, paddingVertical: 42, flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", gap: 34 },
  footerBrand: { width: 300, maxWidth: "100%" },
  footerLogo: { width: 40, height: 40, borderRadius: 13, backgroundColor: "#078BCB", alignItems: "center", justifyContent: "center", marginBottom: 12 },
  footerLogoText: { color: "#FFFFFF", fontWeight: "900", fontSize: 24 },
  footerTitle: { color: "#FFFFFF", fontSize: 21, fontWeight: "900", textAlign: "right" },
  footerDescription: { color: "#D4EAF3", fontSize: 13, lineHeight: 23, marginTop: 10, textAlign: "right" },
  footerColumn: { minWidth: 170, gap: 12 },
  footerHeading: { color: "#FFFFFF", fontSize: 15, fontWeight: "900", marginBottom: 5, textAlign: "right" },
  footerLink: { color: "#D4EAF3", fontSize: 13, textAlign: "right" },
  footerMuted: { color: "#AFCAD8", fontSize: 12, textAlign: "right" },
  footerBottom: { borderTopWidth: 1, borderTopColor: "#4B5750", paddingVertical: 16, paddingHorizontal: 24 },
  footerBottomText: { color: "#AFCAD8", textAlign: "center", fontSize: 11 }
});
