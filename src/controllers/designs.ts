import { Request, Response } from 'express';

export const getDesigns = (req: Request, res: Response) => {
  res.json({ message: "getDesigns received" });
};

export const getDesignById = (req: Request, res: Response) => {
  const id: string = req.params.id;
  res.json({ message: `getDesign ${id} received` });
};

export const createDesign = (req: Request, res: Response) => {
  console.log(req.body); // log incoming design data
  res.json({ message: "createDesign received", data: req.body });
};

export const updateDesign = (req: Request, res: Response) => {
  console.log(req.body); // log updated design data
  res.json({ message: `updateDesign ${req.params.id} received`, data: req.body });
};

export const deleteDesign = (req: Request, res: Response) => {
  res.json({ message: `deleteDesign ${req.params.id} received` });
};
