const router = require('express').Router();
const ctrl = require('../controllers/commentController');
const { verifyToken } = require('../middleware/authMiddleware');

router.get('/problem/:problemId', ctrl.getProblemComments);
router.post('/problem/:problemId', verifyToken, ctrl.createComment);
router.put('/:commentId/vote', verifyToken, ctrl.voteComment);

module.exports = router;