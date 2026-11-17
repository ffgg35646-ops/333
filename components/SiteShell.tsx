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
      </View>
      {compact && (
        <View style={styles.mobileNav}>
          {links.filter(link => link.key !== "about").map(link => (
            <Pressable
              key={link.key}
              onPress={() => go(link.path)}
              accessibilityRole="button"
              accessibilityLabel={link.label}
              style={[styles.mobileNavItem, link.key === "request" && styles.mobileRequestItem]}
            >
              <Text style={[styles.mobileNavText, active === link.key && styles.mobileNavActive, link.key === "request" && styles.mobileRequestText]}>{link.label}</Text>
              {active === link.key && link.key !== "request" && <View style={styles.mobileNavIndicator} />}
            </Pressable>
          ))}
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
  headerWrap: { backgroundColor: "#FFFFFF", borderBottomWidth: 1, borderBottomColor: "#E2EAE5", zIndex: 10, shadowColor: "#173B38", shadowOpacity: 0.035, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 2 },
  header: { width: "100%", maxWidth: 1320, alignSelf: "center", minHeight: 88, paddingHorizontal: 30, flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 22 },
  headerCompact: { minHeight: 68, paddingVertical: 9, paddingHorizontal: 12, gap: 8 },
  brand: { flexDirection: "row", alignItems: "center", gap: 10 },
  brandMark: { width: 48, height: 48, borderRadius: 16, backgroundColor: "#173B38", alignItems: "center", justifyContent: "center", borderWidth: 2, borderColor: "#A7D8CC", shadowColor: "#0F766E", shadowOpacity: 0.22, shadowRadius: 9, shadowOffset: { width: 0, height: 3 }, elevation: 4 },
  brandMarkText: { color: "#A7D8CC", fontSize: 27, fontWeight: "900" , fontFamily: "Arial" },
  brandName: { color: "#173B38", fontSize: 19, fontWeight: "900", textAlign: "right" , fontFamily: "Arial" },
  brandTag: { color: "#89958F", fontSize: 10, marginTop: 2, textAlign: "right" , fontFamily: "Arial" },
  nav: { flexDirection: "row", alignItems: "center", gap: 7, flexWrap: "wrap", justifyContent: "center", backgroundColor: "#F5F7F5", padding: 6, borderRadius: 16, borderWidth: 1, borderColor: "#E4EEF3" },
  navItem: { paddingVertical: 12, paddingHorizontal: 16, borderRadius: 12 },
  navItemActive: { backgroundColor: "#E6F2EF" },
  navText: { color: "#65736D", fontSize: 13, fontWeight: "700" , fontFamily: "Arial" },
  navActive: { color: "#0F766E", fontWeight: "900" , fontFamily: "Arial" },
  downloadLinks: { flexDirection: "row", alignItems: "center", gap: 7, marginStart: 5 },
  downloadLinksCompact: { gap: 4, marginStart: 0 },
  downloadButton: { flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: "#F0F5F2", borderWidth: 1, borderColor: "#C9DED8", borderRadius: 10, paddingVertical: 7, paddingHorizontal: 9 },
  downloadButtonCompact: { paddingVertical: 6, paddingHorizontal: 6, gap: 3, borderRadius: 9 },
  downloadButtonDisabled: { opacity: 0.72 },
  playMark: { width: 18, height: 18, borderRadius: 6, backgroundColor: "#0F766E", alignItems: "center", justifyContent: "center" },
  playMarkText: { color: "#FFFFFF", fontSize: 9, marginStart: 2 , fontFamily: "Arial" },
  appleMark: { color: "#0F766E", fontSize: 16, fontWeight: "900", width: 18, textAlign: "center" , fontFamily: "Arial" },
  downloadEyebrow: { color: "#7A8AA8", fontSize: 8, textAlign: "left" , fontFamily: "Arial" },
  downloadLabel: { color: "#173B38", fontSize: 10, fontWeight: "900", textAlign: "left" , fontFamily: "Arial" },
  downloadLabelCompact: { fontSize: 9 },
  accountButton: { backgroundColor: "#0F766E", borderRadius: 11, paddingVertical: 12, paddingHorizontal: 17, flexDirection: "row", alignItems: "center", gap: 7 },
  accountButtonCompact: { paddingVertical: 9, paddingHorizontal: 9, gap: 4 },
  accountIcon: { color: "#173B38", fontSize: 13 , fontFamily: "Arial" },
  accountButtonText: { color: "#173B38", fontSize: 12, fontWeight: "800" , fontFamily: "Arial" },
  mobileNav: { position: "fixed" as any, left: 0, right: 0, bottom: 0, zIndex: 1000, width: "100%", backgroundColor: "rgba(255,255,255,0.98)", borderTopWidth: 1, borderTopColor: "#DCE7E3", flexDirection: "row", justifyContent: "space-around", alignItems: "center", paddingHorizontal: 10, paddingTop: 9, paddingBottom: 12, shadowColor: "#173B38", shadowOpacity: 0.12, shadowRadius: 16, shadowOffset: { width: 0, height: -5 }, elevation: 12 },
  mobileNavItem: { flex: 1, minHeight: 40, alignItems: "center", justifyContent: "center", gap: 4 },
  mobileNavText: { color: "#89918B", fontSize: 11, fontWeight: "700" , fontFamily: "Arial" },
  mobileNavActive: { color: "#0F766E", fontWeight: "900" , fontFamily: "Arial" },
  mobileRequestItem: { flex: 1.35, minHeight: 44, marginHorizontal: 5, borderRadius: 14, backgroundColor: "#16A34A", shadowColor: "#16A34A", shadowOpacity: 0.28, shadowRadius: 9, shadowOffset: { width: 0, height: 3 }, elevation: 5 },
  mobileRequestText: { color: "#FFFFFF", fontSize: 12, fontWeight: "900" , fontFamily: "Arial" },
  mobileNavIndicator: { width: 16, height: 3, borderRadius: 3, backgroundColor: "#0F766E" },
  footer: { backgroundColor: "#173B38", marginTop: 52 },
  footerInner: { width: "100%", maxWidth: 1240, alignSelf: "center", paddingHorizontal: 24, paddingVertical: 42, flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", gap: 34 },
  footerBrand: { width: 300, maxWidth: "100%" },
  footerLogo: { width: 40, height: 40, borderRadius: 13, backgroundColor: "#0F766E", alignItems: "center", justifyContent: "center", marginBottom: 12 },
  footerLogoText: { color: "#FFFFFF", fontWeight: "900", fontSize: 24 , fontFamily: "Arial" },
  footerTitle: { color: "#FFFFFF", fontSize: 21, fontWeight: "900", textAlign: "right" , fontFamily: "Arial" },
  footerDescription: { color: "#DCEBE5", fontSize: 13, lineHeight: 23, marginTop: 10, textAlign: "right" , fontFamily: "Arial" },
  footerColumn: { minWidth: 170, gap: 12 },
  footerHeading: { color: "#FFFFFF", fontSize: 15, fontWeight: "900", marginBottom: 5, textAlign: "right" , fontFamily: "Arial" },
  footerLink: { color: "#DCEBE5", fontSize: 13, textAlign: "right" , fontFamily: "Arial" },
  footerMuted: { color: "#B7CBC4", fontSize: 12, textAlign: "right" , fontFamily: "Arial" },
  footerBottom: { borderTopWidth: 1, borderTopColor: "#4B5750", paddingVertical: 16, paddingHorizontal: 24 },
  footerBottomText: { color: "#B7CBC4", textAlign: "center", fontSize: 11 , fontFamily: "Arial" },
});
