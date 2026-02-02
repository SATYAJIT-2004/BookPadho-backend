import Book from "../models/Book.js";
import order from "../models/order.js";
import User from "../models/User.js";
import asyncHandler from "../utils/asyncHandler.js";

export const getPendingBooks = asyncHandler(async (req, res) => {
  const books = await Book.find({ isApproved: false }).populate(
    "seller",
    "name email",
  );
  res.json(books);
});

export const approveBook = asyncHandler(async (req, res) => {
  const book = await Book.findById(req.params.id);

  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  book.isApproved = true;
  await book.save();

  res.json({ message: "Book approved" });
});

export const getAllBuyer = asyncHandler(async (req, res) => {
  const buyers = await User.find({ role: "buyer" }).select("-password");

  res.json({
    count: buyers.length,
    buyers,
  });
});

export const getAllSeller = asyncHandler(async (req, res) => {
  const sellers = await User.find({ role: "seller" }).select("-password");

  res.json({ count: sellers.length, sellers });
});

export const getAdminDashboard = asyncHandler(async(req,res)=>{
    const totalUsers = await User.countDocuments();
    const totalBuyers = await User.countDocuments({role:"buyer"});
    const totalSellers = await User.countDocuments({role:"seller"});


    const totalBooks = await Book.countDocuments();

    const approvedBooks = await Book.countDocuments({isApproved:true});
    const pendingBooks = await Book.countDocuments({isApproved:false});

    const soldBooks = await Book.countDocuments({isSold:true});

    const totalOrders = await order.countDocuments();

     res.json({
    users: {
      total: totalUsers,
      buyers: totalBuyers,
      sellers: totalSellers,
    },
    books: {
      total: totalBooks,
      approved: approvedBooks,
      pending: pendingBooks,
      sold: soldBooks,
    },
    orders: {
      total: totalOrders,
    },
  });
})