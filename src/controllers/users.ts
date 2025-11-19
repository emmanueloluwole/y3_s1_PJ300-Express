import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { collections } from "../database";
import { createUserSchema } from "../models/user";
import { User } from "../models/user";

export const getUsers = async (_req: Request, res: Response) => {
  try {
    const users = await collections.users?.find({}).toArray();
    users
      ? res.status(200).json(users)
      : res.status(404).send("No users found.");
  } catch (error) {
    if (error instanceof Error) {
      console.log(`Error fetching users: ${error.message}`);
    } else {
      console.log(`Unknown error: ${error}`);
    }
    res.status(400).send("Failed to retrieve users.");
  }
};

export const getUserById = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const user = await collections.users?.findOne({ _id: new ObjectId(id) });
    user
      ? res.status(200).json(user)
      : res.status(404).send(`User with ID ${id} not found.`);
  } catch (error) {
    if (error instanceof Error) {
      console.log(`Error fetching user: ${error.message}`);
    } else {
      console.log(`Unknown error: ${error}`);
    }
    res.status(400).send("Failed to retrieve user.");
  }
};

export const createUser = async (req: Request, res: Response) => {
  const validation = createUserSchema.safeParse(req.body);
  if (!validation.success) {
    console.log("Validation failed:", validation.error);
    return res.status(400).json({ error: validation.error.format() });
  }

  const newUser: User = {
    ...validation.data,
    createdAt: new Date(),
  };

  try {
    const result = await collections.users?.insertOne(newUser);

    if (!result || !result.insertedId) {
      return res.status(500).send("Failed to create user.");
    }

    // Return insertedId so tests can use it
    return res.status(201).json({ insertedId: result.insertedId });
  } catch (error) {
    if (error instanceof Error) {
      console.log(`Insert error: ${error.message}`);
    } else {
      console.log(`Unknown error: ${error}`);
    }
    return res.status(400).send("Unable to create user.");
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
      : res.status(404).send(`User with ID ${id} not found.`);
  } catch (error) {
    if (error instanceof Error) {
      console.log(`Update error: ${error.message}`);
    } else {
      console.log(`Unknown error: ${error}`);
    }
    res.status(400).send("Failed to update user.");
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const result = await collections.users?.deleteOne({ _id: new ObjectId(id) });

    if (!result) {
      return res.status(500).json({ error: "Delete failed" });
    }

    if (result.deletedCount && result.deletedCount > 0) {
      // Return deletedCount so tests can assert it
      return res.status(200).json({ deletedCount: result.deletedCount });
    } else {
      return res.status(404).json({ error: `User with ID ${id} not found.` });
    }
  } catch (error) {
    if (error instanceof Error) {
      console.log(`Delete error: ${error.message}`);
    } else {
      console.log(`Unknown error: ${error}`);
    }
    return res.status(400).json({ error: "Failed to delete user." });
  }
};
