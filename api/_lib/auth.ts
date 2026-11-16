import { createHmac, timingSafeEqual } from "node:crypto";
import type { VercelRequest } from "@vercel/node";

const secret = process.env.ADMIN_SESSION_SECRET;
if (!secret || secret.length < 32) throw new Error("ADMIN_SESSION_SECRET must be at least 32 characters");

type Session = { sub: string; email: string; role: "admin"; exp: number };

function signature(value: string) {
  return createHmac("sha256", secret!).update(value).digest("base64url");
}

export function createSession(admin: { _id: { toString(): string }; email: string }) {
  const payload: Session = {
    sub: admin._id.toString(),
    email: admin.email,
    role: "admin",
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 12
  };
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return body + "." + signature(body);
}

export function getSession(req: VercelRequest): Session | null {
  const header = req.headers.authorization || "";
  const bearer = Array.isArray(header) ? header[0] : header;
  const cookieHeader = req.headers.cookie || "";
  const cookie = (Array.isArray(cookieHeader) ? cookieHeader[0] : cookieHeader)
    .split(";").map(v => v.trim()).find(v => v.startsWith("khadamati_admin="))?.slice("khadamati_admin=".length);
  const token = bearer.startsWith("Bearer ") ? bearer.slice(7) : cookie;
  if (!token) return null;
  const [body, supplied] = token.split(".");
  if (!body || !supplied) return null;
  const expected = signature(body);
  const a = Buffer.from(supplied);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    const session = JSON.parse(Buffer.from(body, "base64url").toString()) as Session;
    if (session.role !== "admin" || session.exp < Math.floor(Date.now() / 1000)) return null;
    return session;
  } catch {
    return null;
  }
}

export function requireAdmin(req: VercelRequest) {
  return getSession(req);
}
