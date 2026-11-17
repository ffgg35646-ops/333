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

function BrandMark({ footer = false }: { footer?: boolean }) {
  return (
    <View style={[styles.brandMark, footer && styles.footerLogo]}>
      <View style={styles.brandRoofLeft} />
      <View style={styles.brandRoofRight} />
      <View style={styles.brandHouse}>
        <View style={styles.brandWindowRow}><View style={styles.brandWindow} /><View style={styles.brandWindow} /></View>
        <View style={styles.brandWindowRow}><View style={styles.brandWindow} /><View style={styles.brandWindow} /></View>
      </View>
      <View style={styles.brandHand} />
      <View style={[styles.brandMarkAccent, footer && styles.footerLogoAccent]} />
    </View>
  );
}

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
    <>
      <View style={[styles.headerWrap, !compact && styles.headerWrapDesktop]}>
      <View style={[styles.header, compact && styles.headerCompact]}>
        <Pressable onPress={() => go("/")} style={[styles.brand, !compact && styles.brandDesktop]}>
          <BrandMark />
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
      </View>
      {compact && (
        <View style={styles.mobileNav}>
          {[links[0], links[2], links[1]].map(link => (
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
    </>
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
          <BrandMark footer />
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
  headerWrap: { backgroundColor: "rgba(23,59,56,0.70)", borderBottomWidth: 1, borderBottomColor: "rgba(255,255,255,0.14)", zIndex: 10, shadowColor: "#102E2B", shadowOpacity: 0.16, shadowRadius: 16, shadowOffset: { width: 0, height: 5 }, elevation: 3, ...( { backdropFilter: "blur(18px) saturate(120%)", WebkitBackdropFilter: "blur(18px) saturate(120%)" } as any) },
  headerWrapDesktop: { backgroundColor: "rgba(48,56,59,0.76)", borderBottomColor: "rgba(255,255,255,0.14)", borderBottomWidth: 1, shadowColor: "#101719", shadowOpacity: 0.12, shadowRadius: 18, shadowOffset: { width: 0, height: 5 }, ...( { backdropFilter: "blur(22px) saturate(145%)", WebkitBackdropFilter: "blur(22px) saturate(145%)" } as any) },
  header: { width: "100%", maxWidth: 1600, alignSelf: "center", minHeight: 72, paddingHorizontal: 30, flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 18 },
  headerCompact: { minHeight: 68, paddingVertical: 9, paddingHorizontal: 12, gap: 8 },
  brand: { flexDirection: "row", alignItems: "center", gap: 10 },
  brandDesktop: { position: "absolute", right: 30, zIndex: 3 },
  brandMark: { width: 58, height: 52, backgroundColor: "transparent", alignItems: "center", justifyContent: "center" },
  brandRoofLeft: { position: "absolute", top: 8, left: 7, width: 29, height: 5, borderRadius: 4, backgroundColor: "#16D2CF", transform: [{ rotate: "-39deg" }] },
  brandRoofRight: { position: "absolute", top: 8, right: 7, width: 29, height: 5, borderRadius: 4, backgroundColor: "#16D2CF", transform: [{ rotate: "39deg" }] },
  brandHouse: { position: "absolute", top: 15, width: 26, height: 23, borderTopWidth: 0, alignItems: "center", justifyContent: "center", gap: 3 },
  brandWindowRow: { flexDirection: "row", gap: 3 },
  brandWindow: { width: 7, height: 7, backgroundColor: "#FFFFFF" },
  brandHand: { position: "absolute", bottom: 5, width: 42, height: 8, borderRadius: 12, backgroundColor: "#16D2CF", transform: [{ rotate: "-7deg" }] },
  brandMarkAccent: { position: "absolute", width: 8, height: 8, borderRadius: 4, right: 8, bottom: 7, backgroundColor: "#2DD4BF", borderWidth: 1, borderColor: "#173B38" },
  brandName: { color: "#FFFFFF", fontSize: 19, fontWeight: "900", textAlign: "right" , fontFamily: "Arial" },
  brandTag: { color: "#C3D3D7", fontSize: 10, marginTop: 2, textAlign: "right" , fontFamily: "Arial" },
  nav: { position: "absolute", left: 0, right: 0, zIndex: 2, flexDirection: "row", alignItems: "center", gap: 5, flexWrap: "wrap", justifyContent: "center", backgroundColor: "rgba(255,255,255,0.055)", paddingVertical: 3, paddingHorizontal: 5, borderRadius: 14, borderWidth: 1, borderColor: "rgba(255,255,255,0.14)", shadowColor: "#101719", shadowOpacity: 0.10, shadowRadius: 14, shadowOffset: { width: 0, height: 3 }, ...( { backdropFilter: "blur(18px) saturate(120%)", WebkitBackdropFilter: "blur(18px) saturate(120%)" } as any) },
  navItem: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 10 },
  navItemActive: { backgroundColor: "#E6F2EF" },
  navText: { color: "#FFFFFF", fontSize: 13, fontWeight: "700" , fontFamily: "Arial" },
  navActive: { color: "#16D2CF", fontWeight: "900" , fontFamily: "Arial" },
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
  mobileNav: { position: "fixed" as any, left: 0, right: 0, bottom: 0, zIndex: 1000, width: "100%", backgroundColor: "#FFFFFF", borderTopWidth: 1, borderTopColor: "#E8EFEC", flexDirection: "row", justifyContent: "space-around", alignItems: "center", paddingHorizontal: 10, paddingTop: 9, paddingBottom: 12, shadowColor: "#173B38", shadowOpacity: 0.10, shadowRadius: 16, shadowOffset: { width: 0, height: -5 }, elevation: 12 },
  mobileNavItem: { flex: 1, minHeight: 40, alignItems: "center", justifyContent: "center", gap: 4 },
  mobileNavText: { color: "#111827", fontSize: 12, fontWeight: "800" , fontFamily: "Arial" },
  mobileNavActive: { color: "#000000", fontWeight: "900" , fontFamily: "Arial" },
  mobileRequestItem: { flex: 1, minHeight: 44, marginHorizontal: 5, borderRadius: 14, backgroundColor: "#0F766E", borderWidth: 1, borderColor: "#0F766E" },
  mobileRequestText: { color: "#FFFFFF", fontSize: 12, fontWeight: "900" , fontFamily: "Arial" },
  mobileNavIndicator: { width: 16, height: 3, borderRadius: 3, backgroundColor: "#0F766E" },
  footer: { backgroundColor: "#173B38", marginTop: 52 },
  footerInner: { width: "100%", maxWidth: 1240, alignSelf: "center", paddingHorizontal: 24, paddingVertical: 42, flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", gap: 34 },
  footerBrand: { width: 300, maxWidth: "100%" },
  footerLogo: { width: 48, height: 44, backgroundColor: "transparent", alignItems: "center", justifyContent: "center", marginBottom: 12 },
  footerLogoText: { color: "#FFFFFF", fontWeight: "900", fontSize: 30, lineHeight: 34, fontFamily: "Arial" },
  footerLogoAccent: { width: 7, height: 7, right: 6, bottom: 5 },
  footerTitle: { color: "#FFFFFF", fontSize: 21, fontWeight: "900", textAlign: "right" , fontFamily: "Arial" },
  footerDescription: { color: "#DCEBE5", fontSize: 13, lineHeight: 23, marginTop: 10, textAlign: "right" , fontFamily: "Arial" },
  footerColumn: { minWidth: 170, gap: 12 },
  footerHeading: { color: "#FFFFFF", fontSize: 15, fontWeight: "900", marginBottom: 5, textAlign: "right" , fontFamily: "Arial" },
  footerLink: { color: "#DCEBE5", fontSize: 13, textAlign: "right" , fontFamily: "Arial" },
  footerMuted: { color: "#B7CBC4", fontSize: 12, textAlign: "right" , fontFamily: "Arial" },
  footerBottom: { borderTopWidth: 1, borderTopColor: "#4B5750", paddingVertical: 16, paddingHorizontal: 24 },
  footerBottomText: { color: "#B7CBC4", textAlign: "center", fontSize: 11 , fontFamily: "Arial" },
});
