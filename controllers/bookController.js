import Book from "../models/Book.js";
import asyncHandler from "../utils/asyncHandler.js";

export const addBook = asyncHandler(async(req,res)=>{
    if (!req.files || req.files.length === 0) {
    res.status(400);
    throw new Error("Please upload at least one image");
  }
      const {
    title,
    author,
    category,
    condition,
    price,
    description,
  } = req.body;

  const imageUrls = req.files.map(file=> file.path);

   const book = await Book.create({
    title,
    author,
    category,
    condition,
    price,
    description,
    images:imageUrls,
    seller: req.user._id, // seller from token
  });

//   console.log("FILES:", req.files);
// console.log("BODY:", req.body);


  res.status(201).json({
    message: "Book submitted for approval",
    book,
  });
})

export const updateBook = asyncHandler(async(req,res)=>{
    const book = await Book.findById(req.params.id);

    // Book exists?
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    // Ownership check
    if (book.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You can update only your own books"
      });
    }

    // Update fields
    book.title = req.body.title || book.title;
    book.price = req.body.price || book.price;
    book.category = req.body.category || book.category;
    
    const updatedBook = await book.save();
    res.json(updatedBook);
})


export const getBookById = asyncHandler(async(req,res)=>{
  const book =await Book.findById(req.params.id);

  if(!book){
    res.status(404).json({message:"Book not found"})
  }
  res.status(200).json({book});
})


/**
 * DELETE BOOK (Seller only + Ownership check)
 */
export const deleteBook = asyncHandler(async (req, res) => {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    // Ownership check
    if (book.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You can delete only your own books"
      });
    }
    await book.deleteOne();
    res.json({ message: "Book deleted successfully" });
});

export const getApprovedBooks = async (req, res) => {
  const books = await Book.find({ isApproved: true });
  res.json(books);
};

export const getBooks = asyncHandler(async(req,res)=>{
      const {
    keyword,
    category,
    condition,
    minPrice,
    maxPrice,
    page = 1,
    limit = 10
  } = req.query;

  const query = {
  isApproved: true,
  isSold: false,
};

    //Search (title or author)
  if (keyword) {
    query.$or = [
      { title: { $regex: keyword, $options: "i" } },
      { author: { $regex: keyword, $options: "i" } }
    ];
  }
  
  // Filters
  if (category) query.category = category;
  if (condition) query.condition = condition;

   // Price range
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }

  // Pagination
  const skip = (Number(page) - 1) * Number(limit);

  const books = await Book.find(query)
    .skip(skip)
    .limit(Number(limit))
    .sort({ createdAt: -1 });

  // Total count (for frontend pagination)
  const total = await Book.countDocuments(query);

  res.json({
    total,
    page: Number(page),
    pages: Math.ceil(total / limit),
    books
  });
})



export const getMyBooksCount = async (req, res) => {
  try {
    const count = await Book.countDocuments({
      seller: req.user._id, // seller's books
    });

    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch book count" });
  }
};

export const getMyBooks = asyncHandler(async (req, res) => {
  const books = await Book.find({
    seller: req.user._id,
  })
    .populate("orderedBy", "name address")
    .sort({ createdAt: -1 });

  res.json({
    count: books.length,
    books,
  });
});


export const getSoldBooks = asyncHandler(async(req,res)=>{
     const totalSold = await Book.countDocuments({
    seller: req.user._id,
    isSold: true
  })

  res.json({ totalSold });
})

