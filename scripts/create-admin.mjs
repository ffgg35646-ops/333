import { MongoClient } from "mongodb";
import { randomBytes, scryptSync } from "node:crypto";

const { MONGODB_URI, MONGODB_DB = "khadamati", ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_NAME = "مدير خدماتي" } = process.env;
if (!MONGODB_URI || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
  throw new Error("Set MONGODB_URI, ADMIN_EMAIL and ADMIN_PASSWORD before running this script.");
}
if (ADMIN_PASSWORD.length < 12) throw new Error("ADMIN_PASSWORD must be at least 12 characters.");

const email = ADMIN_EMAIL.trim().toLowerCase();
const salt = randomBytes(16).toString("hex");
const passwordHash = scryptSync(ADMIN_PASSWORD, salt, 64).toString("hex");
const client = new MongoClient(MONGODB_URI);
try {
  await client.connect();
  const db = client.db(MONGODB_DB);
  await db.collection("admins").createIndex({ email: 1 }, { unique: true });
  const result = await db.collection("admins").updateOne(
    { email },
    { $setOnInsert: { email, name: ADMIN_NAME, passwordSalt: salt, passwordHash, role: "admin", active: true, createdAt: new Date(), updatedAt: new Date() } },
    { upsert: true }
  );
  console.log(result.upsertedCount ? `Admin account created: ${email}` : `Admin account already exists; password unchanged: ${email}`);
} finally {
  await client.close();
}
