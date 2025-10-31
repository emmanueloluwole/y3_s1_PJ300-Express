import { Request, Response } from "express";
import { collections } from "../database";
import { ObjectId } from "mongodb";
import { User } from "../models/user";

export const getUsers = async (_req: Request, res: Response) => {
  try {
    const users = await collections.users?.find({}).toArray();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).send("Failed to fetch users.");
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const user = await collections.users?.findOne({ _id: new ObjectId(id) });
    user
      ? res.status(200).json(user)
      : res.status(404).send(`No user found with ID ${id}`);
  } catch {
    res.status(500).send("Failed to retrieve user.");
  }
};

export const createUser = async (req: Request, res: Response) => {
  const newUser: User = {
    ...req.body,
    createdAt: new Date()
  };

  try {
    const result = await collections.users?.insertOne(newUser);
    result
      ? res.status(201).json({ insertedId: result.insertedId })
      : res.status(500).send("Failed to create user.");
  } catch (error) {
    res.status(400).send("Unable to create user.");
  }
};

export const updateUser = async (req: Request, res: Response) => {
  const id = req.params.id;

  try {
    const result = await collections.users?.updateOne(
      { _id: new ObjectId(id) },
      { $set: req.body }
    );

    result?.matchedCount
      ? res.status(200).json({ message: `Updated user with ID ${id}` })
      : res.status(404).send(`No user found with ID ${id}`);
  } catch {
    res.status(500).send("Failed to update user.");
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  const id = req.params.id;

  try {
    const result = await collections.users?.deleteOne({ _id: new ObjectId(id) });
    result?.deletedCount
      ? res.status(200).send(`Deleted user with ID ${id}`)
      : res.status(404).send(`No user found with ID ${id}`);
  } catch {
    res.status(400).send("Invalid ID format.");
  }
};
