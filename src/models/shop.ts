import { ObjectId } from "mongodb";
import z from "zod";

export interface Shop {
  _id?: ObjectId;
  name: string;
  ownerId: string;
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
  slogan: z.string().min(1),
  ownerId: z.string().min(1),
  logo: z.string().min(1),
  title: z.string().min(1),
  favIcon: z.string().min(1),
  heroImage: z.string().min(1),
  currency: z.string().min(1)
});
