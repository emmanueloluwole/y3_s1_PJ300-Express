import { ObjectId } from "mongodb";

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
