import { Router } from "express";
import {
  getOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder
} from "../controllers/orders";

const router = Router();

router.get("/", getOrders);
router.get("/:id", getOrderById);
router.post("/", createOrder);
router.put("/:id", updateOrder);
router.delete("/:id", deleteOrder);

export default router;
