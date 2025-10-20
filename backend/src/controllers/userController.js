import User from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// GET /api/users
export const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find().sort({ created_at: -1 });
  res.json(users);
});

// POST /api/users
export const createUser = asyncHandler(async (req, res) => {
  const user = await User.create(req.body);
  res.status(201).json(user);
});
