const express = require('express');
const router = express.Router();
const postController = require('../controllers/post.controller');
const { verifyJWT } = require('../middlewares/auth.middleware');
const upload = require('../middleware/upload'); // e.g. multer config

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

module.exports = router;
