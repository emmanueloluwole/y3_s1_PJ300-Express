import { ObjectId } from "mongodb";

export interface Product {
  _id?: ObjectId;
  name: string;
  description?: string;
  basePrice: number;
  currency: string;
  designIds?: ObjectId[]; // links to Design documents
  shopId?: ObjectId;      // links to Shop
  createdAt?: Date;
}
