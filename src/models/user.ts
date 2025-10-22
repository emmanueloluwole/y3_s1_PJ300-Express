import { ObjectId } from "mongodb";

export interface User {
  _id?: ObjectId;
  username: string;
  email: string;
  passwordHash: string;
  role: "shop" | "designer" | "customer";
  createdAt?: Date;
}
