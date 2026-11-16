import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getSession } from "../_lib/auth";

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });
  const session = getSession(req);
  if (!session) return res.status(401).json({ error: "يجب تسجيل الدخول مرة أخرى." });
  return res.status(200).json({ admin: { email: session.email, role: session.role } });
}
