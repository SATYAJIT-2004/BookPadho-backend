import express from "express";
import protect from "../middleware/authMiddleware.js";
import authorizeRoles from "../middleware/roleMiddleware.js";
import {
  addBook,
  deleteBook,
  getBookById,
  getBooks,
  getMyBooks,
  getMyBooksCount,
  getSoldBooks,
  updateBook,
} from "../controllers/bookController.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

// router.post("/", protect, authorizeRoles("seller"), addBook);
router.post(
  "/",
  protect,
  upload.array("images", 5),
  addBook,
);
router.get(
  "/my/count",
  protect,
  authorizeRoles("seller"),
  getMyBooksCount
);
router.get("/my",protect,authorizeRoles("seller"),getMyBooks);

router.get("/:id",protect,authorizeRoles("seller"),getBookById);
router.put("/:id", protect, authorizeRoles("seller"), updateBook);
router.delete("/:id", protect, authorizeRoles("seller"), deleteBook);

//Buyer serach and filter books
router.get("/", getBooks);

// GET /books/my/sold-count
router.get("/my/sold-count", protect,authorizeRoles("seller"),getSoldBooks);

export default router;
