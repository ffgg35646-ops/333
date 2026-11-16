import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getDb } from "./_lib/db";
import { getSession } from "./_lib/auth";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const requests = (await getDb()).collection("requests");
    if (req.method === "POST") {
      const name = String(req.body?.name || "").trim();
      const phone = String(req.body?.phone || "").trim();
      const address = String(req.body?.address || "").trim();
      const service = String(req.body?.service || "").trim();
      const notes = String(req.body?.notes || "").trim();
      if (!name || !phone || !address || !service) return res.status(400).json({ error: "الاسم ورقم الهاتف والعنوان والخدمة مطلوبة." });
      if (name.length > 120 || phone.length > 40 || address.length > 500 || service.length > 160 || notes.length > 3000) return res.status(400).json({ error: "بعض البيانات أطول من الحد المسموح." });
      const doc = { name, phone, address, service, notes, status: "new", createdAt: new Date(), updatedAt: new Date() };
      const result = await requests.insertOne(doc);
      return res.status(201).json({ request: { id: result.insertedId.toString(), ...doc } });
    }
    if (req.method === "GET") {
      if (!getSession(req)) return res.status(401).json({ error: "غير مصرح." });
      const docs = await requests.find({}).sort({ createdAt: -1 }).limit(500).toArray();
      return res.status(200).json({ requests: docs.map(({ _id, ...doc }) => ({ id: _id.toString(), ...doc })) });
    }
    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error("requests api failed", error);
    return res.status(500).json({ error: "تعذر تنفيذ طلب الخدمة." });
  }
}
