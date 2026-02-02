import Book from "../models/Book.js";
import Order from "../models/order.js";
import asyncHandler from "../utils/asyncHandler.js";

export const createOrder = asyncHandler(async (req, res) => {
  const { bookId,paymentMethod } = req.body;
  const book = await Book.findById(bookId);

  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }
  
  if (!book.isApproved) {
    return res.status(400).json({ message: "Book not approved yet" });
  }
  if (book.isSold) {
    return res.status(400).json({ message: "Book already sold" });
  }

  const order = await Order.create({
    buyer: req.user._id,
    seller: book.seller,
    book: book._id,
    price: book.price,
    paymentMethod,
    status: "pending",
  });

  // Mark book as sold
  book.isSold = true;
  book.orderedBy = req.user._id;
  await book.save();

  res.status(201).json({
    message: "Order placed successfully",
    order,
  });
});

export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ buyer: req.user._id })
    .populate("book", "title price images category condition")
    .populate("seller", "name email")
    .sort({ createdAt: -1 });

  res.json({
    count: orders.length,
    orders,
  });
});

export const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate("book", "title price images category condition")
    .populate("buyer", "name email")
    .populate("seller", "name email");

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  // only buyer or seller can see order
  if (
    order.buyer._id.toString() !== req.user._id.toString() &&
    order.seller._id.toString() !== req.user._id.toString()
  ) {
    return res.status(403).json({ message: "Not authorized" });
  }

  res.json(order);
});

export const getSellerPendingOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({
    seller: req.user._id,
    status: "pending",
  })
    .populate("book", "title price")
    .populate("buyer", "name email")
    .sort({ createdAt: -1 });

  res.json({
    count: orders.length,
    orders,
  });
});

export const confirmOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  // seller authorization
  if (order.seller.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "Not authorized" });
  }

  if (order.status !== "pending") {
    return res.status(400).json({ message: "Order already processed" });
  }

  order.status = "completed";
  await order.save();

  res.json({
    message: "Order confirmed successfully",
    order,
  });
});
