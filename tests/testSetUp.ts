
import dotenv from "dotenv";
dotenv.config();

import { connectToDatabase, client } from "../src/database";

beforeAll(async () => {
     console.log("Connecting to test database...");
  await connectToDatabase();
});

afterAll(async () => {
  await client.close();
});
