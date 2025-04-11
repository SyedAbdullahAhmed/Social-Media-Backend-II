const express = require('express');
const { createBookmark, deleteBookmark } = require('../controllers/bookmarkController');
const { verifyJWT } = require('../middlewares/auth.middleware');

const router = express.Router();

router.post('/:postId', verifyJWT, createBookmark);
router.get('/:postId', verifyJWT, getBookmark);
router.get('/', verifyJWT, getAllBookmark);
router.delete('/:postId', verifyJWT, deleteBookmark);

module.exports = router;
