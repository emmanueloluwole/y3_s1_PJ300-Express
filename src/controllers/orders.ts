import { Request, Response } from "express";
import { collections } from "../database";
import { ObjectId } from "mongodb";
import { Order } from "../models/order";

export const getOrders = async (_req: Request, res: Response) => {
  try {
    const orders = await collections.orders?.find({}).toArray();
    res.status(200).json(orders);
  } catch {
    res.status(500).send("Failed to fetch orders.");
  }
};

export const getOrderById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const order = await collections.orders?.findOne({ _id: new ObjectId(id) });
    order
      ? res.status(200).json(order)
      : res.status(404).send(`No order found with ID ${id}`);
  } catch {
    res.status(500).send("Failed to retrieve order.");
  }
};

export const createOrder = async (req: Request, res: Response) => {
  const newOrder: Order = { ...req.body, createdAt: new Date() };

  try {
    const result = await collections.orders?.insertOne(newOrder);
    result
      ? res.status(201).json({ insertedId: result.insertedId })
      : res.status(500).send("Failed to create order.");
  } catch {
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
      : res.status(404).send(`No order found with ID ${id}`);
  } catch {
    res.status(500).send("Failed to update order.");
  }
};

export const deleteOrder = async (req: Request, res: Response) => {
  const id = req.params.id;

  try {
    const result = await collections.orders?.deleteOne({ _id: new ObjectId(id) });
    result?.deletedCount
      ? res.status(200).send(`Deleted order with ID ${id}`)
      : res.status(404).send(`No order found with ID ${id}`);
  } catch {
    res.status(400).send("Invalid ID format.");
  }
};
