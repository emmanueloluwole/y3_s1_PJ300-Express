import { ObjectId } from "mongodb";

export interface Shop {
  _id?: ObjectId;
  name: string;
  ownerId: ObjectId; // links to User
  createdAt?: Date;
}
