import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
    {
        buyer:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true,
        },
        book:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Book",
            required:true,
        },
        seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "completed", "cancelled"],
      default: "pending",
    },
      paymentMethod: {
      type: String,
      enum: ["COD", "CARD", "UPI", "RAZORPAY"],
      required: true,
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order",orderSchema)

export default Order;