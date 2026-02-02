import User from "../models/User.js";
import Book from "../models/Book.js";
import asyncHandler from "../utils/asyncHandler.js";

// Add to wishlist
export const addToWishlist = asyncHandler(async (req, res) => {
  if (!req.user || !req.user._id) {
    res.status(401);
    throw new Error("Not authorized");
  }

  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }


  const bookId = req.params.bookId;
  const book = await Book.findById(bookId);
  if (!book) {
    res.status(404);
    throw new Error("Book not found");
  }

  if (user.wishlist.includes(bookId)) {
    res.status(400);
    throw new Error("Already in wishlist");
  }

  user.wishlist.push(bookId);
  await user.save();

  res.status(201).json({ message: "Added to wishlist" });
});

// Remove from wishlist
export const removeFromWishlist = asyncHandler(async (req, res) => {
  if (!req.user || !req.user._id) {
    res.status(401);
    throw new Error("Not authorized");
  }
   
  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const bookId = req.params.bookId;

  user.wishlist = user.wishlist.filter(
    (id) => id.toString() !== bookId
  );

  await user.save();
  res.json({ message: "Removed from wishlist" });
});

// Get wishlist
export const getWishlist = asyncHandler(async (req, res) => {
  if (!req.user || !req.user._id) {
    res.status(401);
    throw new Error("Not authorized");
  }

  const user = await User.findById(req.user._id).populate("wishlist");
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  res.json({ wishlist: user.wishlist });
});
