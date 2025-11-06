import { MongoClient, Db, Collection } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const connectionString = process.env.DB_CONN_STRING || "";
const dbName = process.env.DB_NAME || "3dexpress";
export const client = new MongoClient(connectionString);

export const collections: {
  users?: Collection;
  shops?: Collection;
  products?: Collection;
  orders?: Collection;
} = {};

let db: Db;

export async function connectToDatabase(): Promise<void> {
  if (!connectionString) throw new Error("No connection string in .env");

  try {
    await client.connect();
    db = client.db(dbName);

    collections.users = db.collection("users");
    collections.shops = db.collection("shops");
    collections.products = db.collection("products");
    collections.orders = db.collection("orders");

    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("DB connection error:", error);
  }
}
