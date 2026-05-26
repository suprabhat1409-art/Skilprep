const router = require('express').Router();
const path = require('path');
const multer = require('multer');
const ctrl = require('../controllers/communityController');
const { optionalAuth, verifyToken } = require('../middleware/authMiddleware');

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		const dest = path.join(__dirname, '..', '..', 'uploads', 'communities');
		cb(null, dest);
	},
	filename: (req, file, cb) => {
		const safe = `${Date.now()}-${Math.round(Math.random() * 1e9)}-${file.originalname.replace(/\s+/g, '_')}`;
		cb(null, safe);
	},
});

const upload = multer({ storage });

router.get('/', optionalAuth, ctrl.listCommunities);
router.post('/', verifyToken, ctrl.createCommunity);
router.get('/:slug', optionalAuth, ctrl.getCommunity);
router.post('/:communityId/join', verifyToken, ctrl.joinCommunity);
router.post('/:communityId/tests', verifyToken, ctrl.createCommunityTest);
router.post('/:communityId/tests/:testId/submissions', verifyToken, ctrl.submitCommunityTest);
router.patch('/:communityId/tests/:testId/submissions/:submissionId/review', verifyToken, ctrl.reviewCommunitySubmission);
router.post('/:communityId/resources', verifyToken, ctrl.createCommunityResource);
router.post('/:communityId/resources/upload', verifyToken, upload.single('file'), ctrl.uploadCommunityResource);

// Invite management
router.post('/:communityId/invites', verifyToken, ctrl.generateInvite);
router.get('/:communityId/invites', verifyToken, ctrl.listInvites);
router.post('/join-code', verifyToken, ctrl.joinWithCode);

module.exports = router;