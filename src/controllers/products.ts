import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { collections } from "../database";
import { createProductSchema } from "../models/product";
import { Product } from "../models/product";

export const getProducts = async (_req: Request, res: Response) => {
  try {
    const products = await collections.products?.find({}).toArray();
    products
      ? res.status(200).json(products)
      : res.status(404).send("No products found.");
  } catch (error) {
    if (error instanceof Error) {
      console.log(`Error fetching products: ${error.message}`);
    } else {
      console.log(`Unknown error: ${error}`);
    }
    res.status(400).send("Failed to retrieve products.");
  }
};

export const getProductById = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const product = await collections.products?.findOne({ _id: new ObjectId(id) });
    product
      ? res.status(200).json(product)
      : res.status(404).send(`Product with ID ${id} not found.`);
  } catch (error) {
    if (error instanceof Error) {
      console.log(`Error fetching product: ${error.message}`);
    } else {
      console.log(`Unknown error: ${error}`);
    }
    res.status(400).send("Failed to retrieve product.");
  }
};

export const createProduct = async (req: Request, res: Response) => {
  const validation = createProductSchema.safeParse(req.body);
  if (!validation.success) {
    console.log("Validation failed:", validation.error);
    return res.status(400).json({ error: validation.error.format() });
  }

  const newProduct: Product = {
    ...validation.data,
    createdAt: new Date(),
  };

  try {
    const result = await collections.products?.insertOne(newProduct);
    result
      ? res.status(201).location(`${result.insertedId}`).json({ message: `Created product with ID ${result.insertedId}` })
      : res.status(500).send("Failed to create product.");
  } catch (error) {
    if (error instanceof Error) {
      console.log(`Insert error: ${error.message}`);
    } else {
      console.log(`Unknown error: ${error}`);
    }
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
      : res.status(404).send(`Product with ID ${id} not found.`);
  } catch (error) {
    if (error instanceof Error) {
      console.log(`Update error: ${error.message}`);
    } else {
      console.log(`Unknown error: ${error}`);
    }
    res.status(400).send("Failed to update product.");
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const result = await collections.products?.deleteOne({ _id: new ObjectId(id) });
    result?.deletedCount
      ? res.status(200).json({ message: `Deleted product with ID ${id}` })
      : res.status(404).send(`Product with ID ${id} not found.`);
  } catch (error) {
    if (error instanceof Error) {
      console.log(`Delete error: ${error.message}`);
    } else {
      console.log(`Unknown error: ${error}`);
    }
    res.status(400).send("Failed to delete product.");
  }
};
