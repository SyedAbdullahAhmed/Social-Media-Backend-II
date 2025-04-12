const express = require('express');
const router = express.Router();
const postController = require('../controllers/post.controllers');
const { verifyJWT } = require('../middlewares/auth.middleware');
const { upload } = require('../middlewares/multer.middleware'); // e.g. multer config

router.post(
  '/',
  verifyJWT,
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'video', maxCount: 1 }
  ]),
  postController.createPost
);

router.get('/', postController.getAllPosts);
router.get('/', postController.getMyPosts);
router.get('/:id', postController.getPost);

router.put(
  '/:id',
  verifyJWT,
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'video', maxCount: 1 }
  ]),
  postController.updatePost
);

router.delete('/:id', verifyJWT, postController.deletePost);
router.post('/:postId', verifyJWT, postController.handleLikePost);
router.post('/:postId/comment', verifyJWT, postController.createComment);
router.post('/:postId', verifyJWT, postController.incrementViews);
router.post('/:postId', verifyJWT, postController.incrementShares);

module.exports = router;
