import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getDb } from "./_lib/db";
import { requireAdmin, getSession } from "./_lib/auth";
import { allServices } from "../data/services";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const db = await getDb();
    const services = db.collection("services");

    if (req.method === "GET") {
      // One-time upgrade from the old two-list catalogue to the eight-category catalogue.
      const categorizedCount = await services.countDocuments({ categoryId: { $exists: true } });
      if (categorizedCount === 0) {
        const operations = allServices.map(item => ({
          updateOne: {
            filter: { id: item.id },
            update: { $set: { ...item, active: true, updatedAt: new Date() }, $setOnInsert: { createdAt: new Date() } },
            upsert: true
          }
        }));
        if (operations.length) await services.bulkWrite(operations, { ordered: false });
        await services.updateMany({ categoryId: { $exists: false } }, { $set: { active: false, updatedAt: new Date() } });
      }
      const filter = getSession(req) ? {} : { active: { $ne: false } };
      const items = await services.find(filter).sort({ order: 1, title: 1 }).toArray();
      return res.status(200).json({ services: items.map(({ _id, ...item }) => item) });
    }

    if (!requireAdmin(req)) return res.status(401).json({ error: "غير مصرح. سجّل دخول الإدارة." });

    if (req.method === "POST") {
      const body = req.body || {};
      const title = String(body.title || "").trim();
      const id = String(body.id || "").trim();
      if (!title || !id) return res.status(400).json({ error: "اسم الخدمة ومعرّفها مطلوبان." });
      const item = {
        id, title,
        english: String(body.english || ""),
        shortDescription: String(body.shortDescription || ""),
        details: String(body.details || ""),
        image: String(body.image || ""),
        group: body.group === "featured" ? "featured" : "main",
        categoryId: String(body.categoryId || "maintenance"),
        categoryTitle: String(body.categoryTitle || "الصيانة"),
        categoryEnglish: String(body.categoryEnglish || "Maintenance"),
        icon: String(body.icon || "✦"),
        active: body.active !== false,
        order: Number.isFinite(Number(body.order)) ? Number(body.order) : 0,
        updatedAt: new Date()
      };
      await services.insertOne(item);
      return res.status(201).json({ service: item });
    }
    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error("services api failed", error);
    return res.status(500).json({ error: "تعذر تحميل الخدمات أو حفظها." });
  }
}
