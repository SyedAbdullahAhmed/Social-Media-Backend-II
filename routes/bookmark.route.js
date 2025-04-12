const express = require('express');
const { createBookmark, deleteBookmark, getBookmark, getAllBookmark } = require('../controllers/bookmark.controllers');
const { verifyJWT } = require('../middlewares/auth.middleware');

const router = express.Router();

router.post('/:postId', verifyJWT, createBookmark);
router.get('/:postId', verifyJWT, getBookmark);
router.get('/', verifyJWT, getAllBookmark);
router.delete('/:postId', verifyJWT, deleteBookmark);

module.exports = router;
