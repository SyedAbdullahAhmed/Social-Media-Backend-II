const express = require('express');
const { 
    createChannel,
    updateChannel,
    getChannel,
    deleteChannel } = require('../controllers/channel.controllers');
const { verifyJWT } = require('../middlewares/auth.middleware');
const multer = require('multer')
const upload = multer()

const router = express.Router();

router.post('/', verifyJWT, upload.fields([
    {
        name: "channelImage", maxCount: 1
    },
]), createChannel);
router.put('/', verifyJWT, upload.fields([
    {
        name: "channelImage", maxCount: 1
    },
]), updateChannel);
router.get('/', verifyJWT, getChannel);
router.delete('/', verifyJWT, deleteChannel);

module.exports = router;
