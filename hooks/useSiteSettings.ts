import { useEffect, useState } from "react";
import { apiRequest } from "../lib/api";

export type SiteSettings = {
  siteName: string; siteDescription: string; heroTitle: string; heroSubtitle: string;
  mainSectionTitle: string; mainSectionDescription: string;
  featuredSectionTitle: string; featuredSectionDescription: string;
  contactPhone: string; whatsappNumber: string; contactEmail: string; aboutText: string;
};

export const defaultSiteSettings: SiteSettings = {
  siteName: "خدماتي",
  siteDescription: "منصة تجمع لك الخدمات المنزلية والمهنية في مكان واحد، بخطوات بسيطة وتجربة واضحة.",
  heroTitle: "كل خدمات بيتك في مكان واحد",
  heroSubtitle: "اختَر الخدمة المناسبة، وقدّم طلبك بسهولة.",
  mainSectionTitle: "خدماتنا الرئيسية",
  mainSectionDescription: "كل ما تحتاجه لصيانة وتجديد منزلك في مكان واحد.",
  featuredSectionTitle: "خدمات مميزة",
  featuredSectionDescription: "خدمات إضافية تختصر عليك الوقت والمجهود.",
  contactPhone: "", whatsappNumber: "", contactEmail: "",
  aboutText: "خدماتي منصة تساعدك في الوصول إلى الخدمات المنزلية والمهنية بسهولة."
};

export function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings>(defaultSiteSettings);
  useEffect(() => {
    let active = true;
    apiRequest<{ settings: SiteSettings }>("/api/settings")
      .then(result => { if (active && result.settings) setSettings({ ...defaultSiteSettings, ...result.settings }); })
      .catch(() => {})
    return () => { active = false; };
  }, []);
  return settings;
}
