import { Request, Response } from "express";
import { collections } from "../database";
import { ObjectId } from "mongodb";
import { Shop } from "../models/shop";

export const getShops = async (_req: Request, res: Response) => {
  try {
    const shops = await collections.shops?.find({}).toArray();
    res.status(200).json(shops);
  } catch {
    res.status(500).send("Failed to fetch shops.");
  }
};

export const getShopById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const shop = await collections.shops?.findOne({ _id: new ObjectId(id) });
    shop
      ? res.status(200).json(shop)
      : res.status(404).send(`No shop found with ID ${id}`);
  } catch {
    res.status(500).send("Failed to retrieve shop.");
  }
};

export const createShop = async (req: Request, res: Response) => {
  const newShop: Shop = {
    ...req.body,
    createdAt: new Date()
  };

  try {
    const result = await collections.shops?.insertOne(newShop);
    result
      ? res.status(201).json({ insertedId: result.insertedId })
      : res.status(500).send("Failed to create shop.");
  } catch {
    res.status(400).send("Unable to create shop.");
  }
};

export const updateShop = async (req: Request, res: Response) => {
  const id = req.params.id;

  try {
    const result = await collections.shops?.updateOne(
      { _id: new ObjectId(id) },
      { $set: req.body }
    );

    result?.matchedCount
      ? res.status(200).json({ message: `Updated shop with ID ${id}` })
      : res.status(404).send(`No shop found with ID ${id}`);
  } catch {
    res.status(500).send("Failed to update shop.");
  }
};

export const deleteShop = async (req: Request, res: Response) => {
  const id = req.params.id;

  try {
    const result = await collections.shops?.deleteOne({ _id: new ObjectId(id) });
    result?.deletedCount
      ? res.status(200).send(`Deleted shop with ID ${id}`)
      : res.status(404).send(`No shop found with ID ${id}`);
  } catch {
    res.status(400).send("Invalid ID format.");
  }
};
