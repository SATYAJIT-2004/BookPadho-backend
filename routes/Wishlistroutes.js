import express from 'express'
import protect from '../middleware/authMiddleware.js';
import { addToWishlist, getWishlist, removeFromWishlist } from '../controllers/WishlistController.js';


const router = express.Router();



router.post("/:bookId", protect, addToWishlist);
router.delete("/:bookId", protect, removeFromWishlist);
router.get("/", protect, getWishlist);



export default router