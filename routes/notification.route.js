const { verifyJWT } = require('../middlewares/auth.middleware');
const express = require('express');
const router = express.Router();
const { 
    addCreatorNotification, 
    removeCreatorNotification,  
    addUserNotification, 
    removeUserNotification 
} = require('../controllers/notification.controllers');

router.post('/:postId', verifyJWT, addCreatorNotification);
router.delete('/:postId',verifyJWT, removeCreatorNotification);
router.post('/:postId', verifyJWT, addUserNotification);
router.delete('/:postId', verifyJWT, removeUserNotification);


module.exports = router;

