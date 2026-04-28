const router = require('express').Router();
const { getFields, getFieldBySlug, createField, updateField, deleteField } = require('../controllers/fieldController');
const { verifyToken, requireAdmin } = require('../middleware/authMiddleware');

router.get('/', getFields);
router.get('/:slug', getFieldBySlug);
router.post('/', verifyToken, requireAdmin, createField);
router.put('/:id', verifyToken, requireAdmin, updateField);
router.delete('/:id', verifyToken, requireAdmin, deleteField);

module.exports = router;
