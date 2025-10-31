import { ObjectId } from "mongodb";

export interface User {
  _id?: ObjectId;
  fullName: string;
  email: string;
  passwordHash: string;
  address: string;
  phoneNumber: string;
  shopId?: string;
  role: "customer" | "shop";
  createdAt?: Date;
}
