const Field = require('../models/Field');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');

exports.getFields = asyncHandler(async (req, res) => {
  const filter = { isActive: true };
  if (req.query.includeInactive === 'true' && req.user?.role === 'admin') {
    delete filter.isActive;
  }
  const fields = await Field.find(filter).sort('sortOrder');
  res.json({ fields });
});

exports.getFieldBySlug = asyncHandler(async (req, res) => {
  const field = await Field.findOne({ slug: req.params.slug });
  if (!field) throw new ApiError(404, 'Field not found');
  res.json({ field });
});

exports.createField = asyncHandler(async (req, res) => {
  const field = await Field.create(req.body);
  res.status(201).json({ field });
});

exports.updateField = asyncHandler(async (req, res) => {
  const field = await Field.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!field) throw new ApiError(404, 'Field not found');
  res.json({ field });
});

exports.deleteField = asyncHandler(async (req, res) => {
  const field = await Field.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
  if (!field) throw new ApiError(404, 'Field not found');
  res.json({ message: 'Field deactivated' });
});
