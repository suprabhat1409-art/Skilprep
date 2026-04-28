const router = require('express').Router();
const ctrl = require('../controllers/submissionController');
const { verifyToken } = require('../middleware/authMiddleware');

router.post('/', verifyToken, ctrl.createSubmission);
router.post('/run', verifyToken, ctrl.runCode);
router.get('/problem/:problemId', verifyToken, ctrl.getMySubmissionsForProblem);
router.get('/:id', verifyToken, ctrl.getSubmission);

module.exports = router;
