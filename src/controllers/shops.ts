import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { collections } from "../database";
import { createShopSchema } from "../models/shop";
import { Shop } from "../models/shop";

export const getShops = async (_req: Request, res: Response) => {
  try {
    const shops = await collections.shops?.find({}).toArray();
    shops
      ? res.status(200).json(shops)
      : res.status(404).send("No shops found.");
  } catch (error) {
    if (error instanceof Error) {
      console.log(`Error fetching shops: ${error.message}`);
    } else {
      console.log(`Unknown error: ${error}`);
    }
    res.status(400).send("Failed to retrieve shops.");
  }
};

export const getShopById = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const shop = await collections.shops?.findOne({ _id: new ObjectId(id) });
    shop
      ? res.status(200).json(shop)
      : res.status(404).send(`Shop with ID ${id} not found.`);
  } catch (error) {
    if (error instanceof Error) {
      console.log(`Error fetching shop: ${error.message}`);
    } else {
      console.log(`Unknown error: ${error}`);
    }
    res.status(400).send("Failed to retrieve shop.");
  }
};

export const createShop = async (req: Request, res: Response) => {
  const validation = createShopSchema.safeParse(req.body);
  if (!validation.success) {
    console.log("Validation failed:", validation.error);
    return res.status(400).json({ error: validation.error.format() });
  }

  const newShop: Shop = {
    ...validation.data,
    createdAt: new Date(),
    ownerId: new ObjectId,
    logo: "",
    title: "",
    favIcon: "",
    slogan: "",
    heroImage: "",
    currency: ""
  };

  try {
    const result = await collections.shops?.insertOne(newShop);
    result
      ? res.status(201).location(`${result.insertedId}`).json({ message: `Created shop with ID ${result.insertedId}` })
      : res.status(500).send("Failed to create shop.");
  } catch (error) {
    if (error instanceof Error) {
      console.log(`Insert error: ${error.message}`);
    } else {
      console.log(`Unknown error: ${error}`);
    }
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
      : res.status(404).send(`Shop with ID ${id} not found.`);
  } catch (error) {
    if (error instanceof Error) {
      console.log(`Update error: ${error.message}`);
    } else {
      console.log(`Unknown error: ${error}`);
    }
    res.status(400).send("Failed to update shop.");
  }
};

export const deleteShop = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const result = await collections.shops?.deleteOne({ _id: new ObjectId(id) });
    result?.deletedCount
      ? res.status(200).json({ message: `Deleted shop with ID ${id}` })
      : res.status(404).send(`Shop with ID ${id} not found.`);
  } catch (error) {
    if (error instanceof Error) {
      console.log(`Delete error: ${error.message}`);
    } else {
      console.log(`Unknown error: ${error}`);
    }
    res.status(400).send("Failed to delete shop.");
  }
};
