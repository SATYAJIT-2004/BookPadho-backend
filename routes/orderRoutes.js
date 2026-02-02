import express from "express";
import { confirmOrder, createOrder, getMyOrders, getOrderById, getSellerPendingOrders } from "../controllers/orderController.js";
import protect from "../middleware/authMiddleware.js";
import authorizeRoles from "../middleware/roleMiddleware.js";

const router = express.Router();

// Buyer checkout
router.post("/", protect, authorizeRoles("buyer"), createOrder);

router.get("/my",protect,authorizeRoles("buyer"),getMyOrders);

router.get("/:id", protect, authorizeRoles("buyer"), getOrderById);

router.get("/seller/pending",protect,authorizeRoles("seller"),getSellerPendingOrders);
router.put("/seller/confirm/:id",protect,authorizeRoles("seller"),confirmOrder);



export default router;
