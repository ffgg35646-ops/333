import type { VercelRequest, VercelResponse } from "@vercel/node";
import { scrypt as scryptCallback, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import { getDb } from "../_lib/db";
import { createSession } from "../_lib/auth";

const scrypt = promisify(scryptCallback);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  try {
    const email = String(req.body?.email || "").trim().toLowerCase();
    const password = String(req.body?.password || "");
    if (!email || !password || password.length > 200) return res.status(400).json({ error: "أدخل البريد الإلكتروني وكلمة المرور." });

    const db = await getDb();
    const admin = await db.collection("admins").findOne({ email, active: true });
    if (!admin?.passwordHash || typeof admin.passwordSalt !== "string") {
      return res.status(401).json({ error: "بيانات الدخول غير صحيحة." });
    }

    const derived = await scrypt(password, admin.passwordSalt, 64) as Buffer;
    const stored = Buffer.from(admin.passwordHash, "hex");
    if (stored.length !== derived.length || !timingSafeEqual(stored, derived)) {
      return res.status(401).json({ error: "بيانات الدخول غير صحيحة." });
    }

    const token = createSession(admin as any);
    res.setHeader("Set-Cookie", `khadamati_admin=${token}; HttpOnly; Secure; SameSite=None; Path=/; Max-Age=43200`);
    return res.status(200).json({ token, admin: { email: admin.email, name: admin.name || "مدير المنصة" } });
  } catch (error) {
    console.error("admin login failed", error);
    return res.status(500).json({ error: "تعذر تسجيل الدخول حاليًا." });
  }
}
