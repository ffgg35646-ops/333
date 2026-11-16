import { MongoClient } from "mongodb";
import { allServices } from "../data/services";

const uri = process.env.MONGODB_URI;
if (!uri) throw new Error("MONGODB_URI is required");
const dbName = process.env.MONGODB_DB || "khadamati";
const client = new MongoClient(uri);

try {
  await client.connect();
  const collection = client.db(dbName).collection("services");
  await collection.createIndex({ id: 1 }, { unique: true });
  for (const [order, service] of allServices.entries()) {
    await collection.updateOne(
      { id: service.id },
      { $setOnInsert: { ...service, active: true, order, createdAt: new Date(), updatedAt: new Date() } },
      { upsert: true }
    );
  }
  console.log(`Seeded ${allServices.length} services into ${dbName}.services (existing records preserved).`);
} finally {
  await client.close();
}
