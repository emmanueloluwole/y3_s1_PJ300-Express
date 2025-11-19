import { ObjectId } from "mongodb";
import { z } from "zod";

export interface Order {
  _id?: ObjectId;
  userId: string;
  products: string[];
  quantity: number;
  totalPrice: number;
  status: "pending" | "shipped" | "delivered";
  shopId: string;
  createdAt?: Date;
}

export const createOrderSchema = z.object({
  userId: z.string(),
  products: z.array(z.string()).min(1),
  quantity: z.number().int().positive(),
  totalPrice: z.number().positive(),
  status: z.enum(["pending", "shipped", "delivered"]),
  shopId: z.string(),
});
export const updateOrderSchema = createOrderSchema.partial();
