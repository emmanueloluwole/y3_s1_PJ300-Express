import { ObjectId } from "mongodb";
import { z } from "zod";

export interface Product {
  _id?: ObjectId;
  name: string;
  description?: string;
  price: number;
  shopId: string;
  createdAt?: Date;
  category: string[];
}

export const createProductSchema = z.object({
  name: z.string().min(2),
  price: z.number().positive(),
  category: z.array(z.string()).nonempty(),
  shopId: z.string(),
  description: z.string().optional(),
});


export const updateProductSchema = createProductSchema.partial();
