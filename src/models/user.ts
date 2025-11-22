import { ObjectId } from "mongodb";
import { z } from "zod";

export interface User {
  _id?: ObjectId;
  fullName: string;
  email: string;
  passwordHash: string;
  address: string;
  phoneNumber: string;
  shopId: string;
  role: "customer" | "shop";
  createdAt?: Date;
}

export const createUserSchema = z.object({
  fullName: z.string().min(2).max(100),
  email: z.email(),
  passwordHash: z.string().min(6),
  address: z.string(),
  phoneNumber: z.string().regex(/^\+353\d{7,12}$/),
  shopId: z.string(),
  role: z.enum(["customer", "shop"]),
});

