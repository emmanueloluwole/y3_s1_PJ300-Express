import { MongoClient, Db, Collection } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const connectionString = process.env.DB_CONN_STRING || "";
const dbName = process.env.DB_NAME || "3dshop";
const client = new MongoClient(connectionString);

export const collections: { designs?: Collection } = {};

if (!connectionString) throw new Error("No connection string in .env");

let db: Db;

export async function initDb(): Promise<void> {
  try {
    await client.connect();
    db = client.db(dbName);
    collections.designs = db.collection("designs");
    console.log("Connected to database");
  } catch (error) {
    console.error("DB connection error:", error);
  }
}
