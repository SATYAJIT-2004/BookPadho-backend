import express from 'express'
import { approveBook, getAdminDashboard, getAllBuyer, getAllSeller, getPendingBooks } from "../controllers/adminController.js";
import protect from "../middleware/authMiddleware.js";
import authorizeRoles from "../middleware/roleMiddleware.js";


const router = express.Router();

router.get("/pending-books", protect, authorizeRoles("admin"), getPendingBooks);
router.put("/approve-book/:id", protect, authorizeRoles("admin"), approveBook);


router.get("/buyers",protect,authorizeRoles("admin"),getAllBuyer);
router.get("/sellers",protect,authorizeRoles("admin"),getAllSeller);

// / Dashboard
router.get("/dashboard", protect, authorizeRoles("admin"), getAdminDashboard);


export default router;
