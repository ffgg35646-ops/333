import { MongoClient } from "mongodb";
import type { Db } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || "khadamati";

if (!uri) throw new Error("MONGODB_URI is not configured");

declare global {
  // eslint-disable-next-line no-var
  var __khadamatiMongo: Promise<MongoClient> | undefined;
}

const clientPromise = global.__khadamatiMongo ?? new MongoClient(uri).connect();
if (process.env.NODE_ENV !== "production") global.__khadamatiMongo = clientPromise;

export async function getDb(): Promise<Db> {
  const client = await clientPromise;
  return client.db(dbName);
}
