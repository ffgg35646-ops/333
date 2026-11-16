import type { VercelRequest, VercelResponse } from "@vercel/node";
import { ObjectId } from "mongodb";
import { getDb } from "../_lib/db";
import { getSession } from "../_lib/auth";

const allowed = new Set(["new", "contacted", "in_progress", "completed", "cancelled"]);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!getSession(req)) return res.status(401).json({ error: "غير مصرح." });
  const id = String(req.query.id || "");
  if (!ObjectId.isValid(id)) return res.status(400).json({ error: "معرّف الطلب غير صحيح." });
  try {
    const requests = (await getDb()).collection("requests");
    if (req.method === "PUT") {
      const status = String(req.body?.status || "");
      if (!allowed.has(status)) return res.status(400).json({ error: "حالة الطلب غير صحيحة." });
      const result = await requests.updateOne({ _id: new ObjectId(id) }, { $set: { status, updatedAt: new Date() } });
      return result.matchedCount ? res.status(200).json({ ok: true }) : res.status(404).json({ error: "الطلب غير موجود." });
    }
    if (req.method === "DELETE") {
      const result = await requests.deleteOne({ _id: new ObjectId(id) });
      return result.deletedCount ? res.status(200).json({ ok: true }) : res.status(404).json({ error: "الطلب غير موجود." });
    }
    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error("request mutation failed", error);
    return res.status(500).json({ error: "تعذر تحديث الطلب." });
  }
}
