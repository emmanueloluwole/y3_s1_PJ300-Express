import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { collections } from "../database";
import { Product, createProductSchema } from "../models/product";

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

    if (!result || !result.insertedId) {
      return res.status(500).send("Failed to create product.");
    }

    return res.status(201).json({ insertedId: result.insertedId });
  } catch (error) {
    if (error instanceof Error) {
      console.log(`Insert error: ${error.message}`);
    } else {
      console.log(`Unknown error: ${error}`);
    }
    return res.status(400).send("Unable to create product.");
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  const id = req.params.id;
  const updateData = req.body;

  // Ensure category is trimmed if it exists
  if (Array.isArray(updateData.category)) {
    updateData.category = updateData.category.map((c: string) => c.trim());
  }

  try {
    const result = await collections.products?.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
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

    if (!result) {
      return res.status(500).json({ error: "Delete failed" });
    }

    if (result.deletedCount && result.deletedCount > 0) {
      return res.status(200).json({ deletedCount: result.deletedCount });
    } else {
      return res.status(404).json({ error: `Product with ID ${id} not found.` });
    }
  } catch (error) {
    if (error instanceof Error) {
      console.log(`Delete error: ${error.message}`);
    } else {
      console.log(`Unknown error: ${error}`);
    }
    return res.status(400).json({ error: "Failed to delete product." });
  }
};
