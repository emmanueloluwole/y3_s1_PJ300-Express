import { Request, Response } from "express";
import { collections } from "../database";
import { ObjectId } from "mongodb";
import { Product } from "../models/product";

export const getProducts = async (_req: Request, res: Response) => {
  try {
    const products = await collections.products?.find({}).toArray();
    res.status(200).json(products);
  } catch {
    res.status(500).send("Failed to fetch products.");
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const product = await collections.products?.findOne({ _id: new ObjectId(id) });
    product
      ? res.status(200).json(product)
      : res.status(404).send(`No product found with ID ${id}`);
  } catch {
    res.status(500).send("Failed to retrieve product.");
  }
};

export const createProduct = async (req: Request, res: Response) => {
  const newProduct: Product = { ...req.body, createdAt: new Date() };

  try {
    const result = await collections.products?.insertOne(newProduct);
    result
      ? res.status(201).json({ insertedId: result.insertedId })
      : res.status(500).send("Failed to create product.");
  } catch {
    res.status(400).send("Unable to create product.");
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  const id = req.params.id;

  try {
    const result = await collections.products?.updateOne(
      { _id: new ObjectId(id) },
      { $set: req.body }
    );

    result?.matchedCount
      ? res.status(200).json({ message: `Updated product with ID ${id}` })
      : res.status(404).send(`No product found with ID ${id}`);
  } catch {
    res.status(500).send("Failed to update product.");
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  const id = req.params.id;

  try {
    const result = await collections.products?.deleteOne({ _id: new ObjectId(id) });
    result?.deletedCount
      ? res.status(200).send(`Deleted product with ID ${id}`)
      : res.status(404).send(`No product found with ID ${id}`);
  } catch {
    res.status(400).send("Invalid ID format.");
  }
};
