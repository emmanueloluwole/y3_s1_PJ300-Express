import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { collections } from "../database";
import { createOrderSchema } from "../models/order";
import { Order } from "../models/order";

export const getOrders = async (_req: Request, res: Response) => {
  try {
    const orders = await collections.orders?.find({}).toArray();
    orders
      ? res.status(200).json(orders)
      : res.status(404).send("No orders found.");
  } catch (error) {
    if (error instanceof Error) {
      console.log(`Error fetching orders: ${error.message}`);
    } else {
      console.log(`Unknown error: ${error}`);
    }
    res.status(400).send("Failed to retrieve orders.");
  }
};

export const getOrderById = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const order = await collections.orders?.findOne({ _id: new ObjectId(id) });
    order
      ? res.status(200).json(order)
      : res.status(404).send(`Order with ID ${id} not found.`);
  } catch (error) {
    if (error instanceof Error) {
      console.log(`Error fetching order: ${error.message}`);
    } else {
      console.log(`Unknown error: ${error}`);
    }
    res.status(400).send("Failed to retrieve order.");
  }
};

export const createOrder = async (req: Request, res: Response) => {
  const validation = createOrderSchema.safeParse(req.body);
  if (!validation.success) {
    console.log("Validation failed:", validation.error);
    return res.status(400).json({ error: validation.error.format() });
  }

  const newOrder: Order = {
    ...validation.data,
    createdAt: new Date(),
  };

  try {
    const result = await collections.orders?.insertOne(newOrder);
    result
      ? res.status(201).location(`${result.insertedId}`).json({ message: `Created order with ID ${result.insertedId}` })
      : res.status(500).send("Failed to create order.");
  } catch (error) {
    if (error instanceof Error) {
      console.log(`Insert error: ${error.message}`);
    } else {
      console.log(`Unknown error: ${error}`);
    }
    res.status(400).send("Unable to create order.");
  }
};

export const updateOrder = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const result = await collections.orders?.updateOne(
      { _id: new ObjectId(id) },
      { $set: req.body }
    );
    result?.matchedCount
      ? res.status(200).json({ message: `Updated order with ID ${id}` })
      : res.status(404).send(`Order with ID ${id} not found.`);
  } catch (error) {
    if (error instanceof Error) {
      console.log(`Update error: ${error.message}`);
    } else {
      console.log(`Unknown error: ${error}`);
    }
    res.status(400).send("Failed to update order.");
  }
};

export const deleteOrder = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const result = await collections.orders?.deleteOne({ _id: new ObjectId(id) });
    result?.deletedCount
      ? res.status(200).json({ message: `Deleted order with ID ${id}` })
      : res.status(404).send(`Order with ID ${id} not found.`);
  } catch (error) {
    if (error instanceof Error) {
      console.log(`Delete error: ${error.message}`);
    } else {
      console.log(`Unknown error: ${error}`);
    }
    res.status(400).send("Failed to delete order.");
  }
};
