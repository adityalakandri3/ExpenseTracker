const express = require('express');
const { AuthCheck, RoleCheck } = require('../middleware/Auth');
const CommentController = require('../controller/CommentController');
const router = express.Router();


router.post('/create-comment/:postId',AuthCheck,RoleCheck('user'),CommentController.createComment);
router.get('/like-post/:id',AuthCheck,RoleCheck('user'),CommentController.toggleLike);
router.get('/like-sort',AuthCheck,RoleCheck('user'),CommentController.getLikesByCount);
router.get('/get-comments/:postId',AuthCheck,RoleCheck('user'),CommentController.getCommentsForPost);

module.exports = router;