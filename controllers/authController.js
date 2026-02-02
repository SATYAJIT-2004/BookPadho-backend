import asyncHandler from "../utils/asyncHandler.js";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const user = await User.create({ name, email, password, role});

  res.status(201).json({
    message: "User registered successfully",
  });
});

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  const token = generateToken(user._id, user.role);

  res.json({
    success: true,
    token,
    user: {  
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      address:user.address,
    },
    message: "Login successful"
  });
});


export const logoutUser = (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out successfully" });
};