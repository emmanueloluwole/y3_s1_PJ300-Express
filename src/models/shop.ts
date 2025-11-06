import { ObjectId } from "mongodb";
import z from "zod";

export interface Shop {
  _id?: ObjectId;
  name: string;
  ownerId: ObjectId;
  logo: string;
  title: string;
  favIcon: string;
  slogan: string;
  heroImage: string;
  currency: string;
  createdAt?: Date;
}
export const createShopSchema = z.object({
  name: z.string().min(2).max(100),
  address: z.string(),
  phoneNumber: z.string().regex(/^\+353\d{7,12}$/),
  description: z.string().optional(),
});