const router = require('express').Router();
const ctrl = require('../controllers/problemController');
const { verifyToken, optionalAuth, requireAdmin } = require('../middleware/authMiddleware');

router.get('/', optionalAuth, ctrl.getProblems);
router.get('/:slug', optionalAuth, ctrl.getProblemBySlug);
router.post('/', verifyToken, requireAdmin, ctrl.createProblem);
router.put('/:id', verifyToken, requireAdmin, ctrl.updateProblem);
router.delete('/:id', verifyToken, requireAdmin, ctrl.deleteProblem);

router.get('/:id/testcases', verifyToken, requireAdmin, ctrl.getTestCases);
router.post('/:id/testcases', verifyToken, requireAdmin, ctrl.createTestCase);
router.put('/:id/testcases/:tcId', verifyToken, requireAdmin, ctrl.updateTestCase);
router.delete('/:id/testcases/:tcId', verifyToken, requireAdmin, ctrl.deleteTestCase);

module.exports = router;
