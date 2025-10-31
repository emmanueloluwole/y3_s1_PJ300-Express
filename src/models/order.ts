import { ObjectId } from "mongodb";

export interface Order {
  _id?: ObjectId;
  userId: ObjectId;
  products: string[];
  quantity: number;
  totalPrice: number;
  status: "pending" | "shipped" | "delivered";
  shopId: string;
  createdAt?: Date;
}
