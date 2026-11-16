import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getDb } from "./_lib/db";
import { getSession } from "./_lib/auth";

export const defaultSettings = {
  siteName: "خدماتي",
  siteDescription: "منصة تجمع لك الخدمات المنزلية والمهنية في مكان واحد، بخطوات بسيطة وتجربة واضحة.",
  heroTitle: "كل خدمات بيتك في مكان واحد",
  heroSubtitle: "اختَر الخدمة المناسبة، وقدّم طلبك بسهولة.",
  mainSectionTitle: "خدماتنا الرئيسية",
  mainSectionDescription: "كل ما تحتاجه لصيانة وتجديد منزلك في مكان واحد.",
  featuredSectionTitle: "خدمات مميزة",
  featuredSectionDescription: "خدمات إضافية تختصر عليك الوقت والمجهود.",
  contactPhone: "",
  whatsappNumber: "",
  contactEmail: "",
  aboutText: "خدماتي منصة تساعدك في الوصول إلى الخدمات المنزلية والمهنية بسهولة."
};

const editable = Object.keys(defaultSettings);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const collection = (await getDb()).collection("settings");
    if (req.method === "GET") {
      const saved = await collection.findOne({ key: "site" });
      const { _id, ...values } = saved || {};
      return res.status(200).json({ settings: { ...defaultSettings, ...values } });
    }
    if (req.method === "PUT") {
      if (!getSession(req)) return res.status(401).json({ error: "غير مصرح." });
      const updates: Record<string, string> = {};
      for (const key of editable) {
        const value = req.body?.[key];
        if (value !== undefined) {
          const normalized = String(value).trim();
          if (normalized.length > 2000) return res.status(400).json({ error: "أحد الحقول يتجاوز الحد المسموح." });
          updates[key] = normalized;
        }
      }
      await collection.updateOne({ key: "site" }, { $set: { ...updates, key: "site", updatedAt: new Date() }, $setOnInsert: { createdAt: new Date() } }, { upsert: true });
      const saved = await collection.findOne({ key: "site" });
      const { _id, ...values } = saved || {};
      return res.status(200).json({ settings: { ...defaultSettings, ...values } });
    }
    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error("settings api failed", error);
    return res.status(500).json({ error: "تعذر تحميل أو حفظ إعدادات المنصة." });
  }
}
