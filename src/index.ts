import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import { connectToDatabase } from "./database";

import productRoutes from "./routes/product";
import orderRoutes from "./routes/order";
import shopRoutes from "./routes/shop";
import userRoutes from "./routes/user";

dotenv.config();
export const app = express();
const PORT = process.env.PORT || 3000;

app.use(morgan("tiny"));
app.use(express.json());

connectToDatabase().then(() => {
  app.use("/api/v1/users", userRoutes);
  app.use("/api/v1/shops", shopRoutes);
  app.use("/api/v1/products", productRoutes);
  app.use("/api/v1/orders", orderRoutes);

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
