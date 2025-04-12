const express = require('express');
const router = express.Router();
const subscriberController = require('../controllers/subscriber');
const { verifyJWT } = require('../middlewares/auth.middleware');

router.post('/:subscriberId', verifyJWT, subscriberController.createSubscriber);
router.get('/', verifyJWT, subscriberController.getAllSubscribers);
router.get('/:subscriberId', verifyJWT, subscriberController.getSubscriber);
router.put('/:subscriberId', verifyJWT, subscriberController.removeSubscriber);

module.exports = router;