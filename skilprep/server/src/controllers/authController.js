const jwt = require('jsonwebtoken');
const Joi = require('joi');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

const registerSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  email: Joi.string().email({ tlds: { allow: false } }).required(),
  password: Joi.string().min(6).max(100).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email({ tlds: { allow: false } }).required(),
  password: Joi.string().required(),
});

exports.register = asyncHandler(async (req, res) => {
  const { error } = registerSchema.validate(req.body);
  if (error) throw new ApiError(400, error.details[0].message);

  const { username, email, password } = req.body;

  const exists = await User.findOne({ $or: [{ email }, { username }] });
  if (exists) {
    throw new ApiError(400, exists.email === email ? 'Email already registered' : 'Username taken');
  }

  const user = await User.create({ username, email, passwordHash: password });
  const token = signToken(user._id);

  res.status(201).json({ user: user.toPublicJSON(), token });
});

exports.login = asyncHandler(async (req, res) => {
  const { error } = loginSchema.validate(req.body);
  if (error) throw new ApiError(400, error.details[0].message);

  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(401, 'Invalid email or password');
  }

  const token = signToken(user._id);
  res.json({ user: user.toPublicJSON(), token });
});

exports.getMe = asyncHandler(async (req, res) => {
  res.json({ user: req.user.toPublicJSON() });
});
