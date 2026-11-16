import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getDb } from "../_lib/db";
import { requireAdmin } from "../_lib/auth";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!requireAdmin(req)) return res.status(401).json({ error: "غير مصرح. سجّل دخول الإدارة." });
  const id = String(req.query.id || "");
  if (!id) return res.status(400).json({ error: "معرّف الخدمة مطلوب." });

  try {
    const services = (await getDb()).collection("services");
    if (req.method === "PUT") {
      const body = req.body || {};
      const update = {
        title: String(body.title || "").trim(),
        english: String(body.english || ""),
        shortDescription: String(body.shortDescription || ""),
        details: String(body.details || ""),
        image: String(body.image || ""),
        group: body.group === "featured" ? "featured" : "main",
        icon: String(body.icon || "✦"),
        active: body.active !== false,
        order: Number.isFinite(Number(body.order)) ? Number(body.order) : 0,
        updatedAt: new Date()
      };
      if (!update.title) return res.status(400).json({ error: "اسم الخدمة مطلوب." });
      const result = await services.updateOne({ id }, { $set: update });
      return result.matchedCount ? res.status(200).json({ ok: true }) : res.status(404).json({ error: "الخدمة غير موجودة." });
    }
    if (req.method === "DELETE") {
      const result = await services.deleteOne({ id });
      return result.deletedCount ? res.status(200).json({ ok: true }) : res.status(404).json({ error: "الخدمة غير موجودة." });
    }
    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error("service mutation failed", error);
    return res.status(500).json({ error: "تعذر حفظ التغييرات." });
  }
}
