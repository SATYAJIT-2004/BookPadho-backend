import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    author: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      required: true,
    },

    condition: {
      type: String,
      enum: ["new", "like-new", "used"],
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    images: [
      {
        type: String, // image URLs (Cloudinary later)
      },
    ],

    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    isApproved: {
      type: Boolean,
      default: false, // admin will approve
    },

    isSold: {
      type: Boolean,
      default: false,
    },
    orderedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true },
);

const Book = mongoose.model("Book", bookSchema);
export default Book;
