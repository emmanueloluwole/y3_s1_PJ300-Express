import { Request, Response } from 'express';
import { collections } from '../database';
import { ObjectId } from 'mongodb';
import { Design } from "../models/design";


export const getDesigns = async (req: Request, res: Response) => {
  try {
    if (!collections.designs) {
      return res.status(500).send("Designs collection not initialized.");
    }

    const designs = await collections.designs.find({}).toArray();
    res.status(200).json(designs);
  } catch (error) {
    res.status(500).send("Failed to fetch designs.");
  }
};

export const getDesignById = async (req: Request, res: Response) => {
  try {
    if (!collections.designs) {
      return res.status(500).send("Designs collection not initialized.");
    }

    const id = req.params.id;
    if (!ObjectId.isValid(id)) {
      return res.status(400).send("Invalid ID format.");
    }

    const design = await collections.designs.findOne({ _id: new ObjectId(id) });
    design
      ? res.status(200).json(design)
      : res.status(404).send(`No design found with id: ${id}`);
  } catch {
    res.status(500).send("Failed to retrieve design.");
  }
};


export const createDesign = async (req: Request, res: Response) => {
  const newDesign = req.body as Design;
  try {
    const result = await collections.designs?.insertOne(newDesign);
    if (result) {
      res.status(201).location(`${result.insertedId}`).json({
        message: `Created a new design with id ${result.insertedId}`,
      });
    } else {
      res.status(500).send("Failed to create design.");
    }
  } catch (error) {
    console.error(error);
    res.status(400).send("Unable to create design.");
  }
};

export const updateDesign = async (req: Request, res: Response) => {
  const id = req.params.id;

  if (!ObjectId.isValid(id)) {
    return res.status(400).send("Invalid ID format.");
  }

  if (!collections.designs) {
    return res.status(500).send("Designs collection not initialized.");
  }

  try {
    const result = await collections.designs.updateOne(
      { _id: new ObjectId(id) },
      { $set: req.body }
    );

    if (result.matchedCount > 0) {
      res.status(200).json({ message: `Updated design with ID ${id}` });
    } else {
      res.status(404).send(`No design found with ID ${id}`);
    }
  } catch (error) {
    res.status(500).send("Failed to update design.");
  }
};

export const deleteDesign = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const query = { _id: new ObjectId(id) };
    const result = await collections.designs?.deleteOne(query);
    if (result?.deletedCount) {
      res.status(200).send(`Deleted design with id: ${id}`);
    } else {
      res.status(404).send(`No design found with id: ${id}`);
    }
  } catch (error) {
    res.status(400).send("Invalid ID format.");
  }
};
