import { ObjectId } from "mongodb";
import { z } from "zod";

export interface Product {
  _id?: ObjectId;
  name: string;
  description?: string;
  price: number;
  shopId: string;
  createdAt?: Date;
}

export const createProductSchema = z.object({
  name: z.string().min(2).max(100),
  description: z.string().optional(),
  price: z.number().positive(),
  shopId: z.string(),
});
