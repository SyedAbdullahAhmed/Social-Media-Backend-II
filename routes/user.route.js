const express = require('express');
const router = express.Router();
const multer = require('multer')
const upload = multer()
const { createUser, getUser, getUsers, updateUser, deleteUser, verifyUser, loginUser, forgotPassword, logoutUser, newRefreshToken } = require('../controllers/user.controllers');
const { verifyJWT } = require('../middlewares/auth.middleware');

// Controller function names (actual logic in controller file)
router.post('/signup', upload.fields([
    {
        name: "profile", maxCount: 1
    },
]), createUser);
router.get('/:id',verifyJWT, getUser);
router.get('/',verifyJWT, getUsers);
router.post('/verify/:code', verifyUser);
router.post('/login', loginUser);
router.post('/forgotPassword/:code', forgotPassword);
router.put('/:id', verifyJWT, upload.fields([
    {
        name: "profile", maxCount: 1
    },
]), updateUser);
router.delete('/:id',verifyJWT, deleteUser);
router.delete('/logout', verifyJWT, logoutUser);
router.post('/refresh/:token', verifyJWT, newRefreshToken);

// Export the router
module.exports = router;

