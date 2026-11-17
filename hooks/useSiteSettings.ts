import { useEffect, useState } from "react";
import { apiRequest } from "../lib/api";
import { readPublicCache, writePublicCache } from "../lib/public-cache";

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

const SETTINGS_CACHE_KEY = "site-settings.v1";

export function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings>(defaultSiteSettings);

  useEffect(() => {
    let active = true;
    let networkFinished = false;

    void readPublicCache<SiteSettings>(SETTINGS_CACHE_KEY).then(cached => {
      if (active && !networkFinished && cached) {
        setSettings({ ...defaultSiteSettings, ...cached });
      }
    });

    // Keep cached settings on screen and refresh them quietly in the background.
    apiRequest<{ settings: SiteSettings }>("/api/settings")
      .then(result => {
        if (!result.settings) return;
        networkFinished = true;
        const next = { ...defaultSiteSettings, ...result.settings };
        if (active) setSettings(next);
        void writePublicCache(SETTINGS_CACHE_KEY, next);
      })
      .catch(() => {
        // Defaults or the last cached settings remain available offline.
      });

    return () => { active = false; };
  }, []);

  return settings;
}
