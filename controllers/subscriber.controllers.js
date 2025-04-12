const Subscriber = require('../models/subscriber.model.js');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');


const createSubscriber = asyncHandler(async (req, res) => {
    const { userId } = req.user;  
    const { subscriberId } = req.params; 

    if (!subscriberId) {
        throw new ApiError(400, 'Subscriber ID is required');
    }

    let subscriber = await Subscriber.findOne({ userId });

    if (!subscriber) {
        subscriber = new Subscriber({ userId, subscribers: [subscriberId] });
    } else {
        if (subscriber.subscribers.includes(subscriberId)) {
            throw new ApiError(400, 'Already subscribed to this user');
        }
        subscriber.subscribers.push(subscriberId);
    }

    await subscriber.save();

    res.status(200).json(new ApiResponse(200, subscriber, 'Subscriber created successfully'));
})


const getAllSubscribers = asyncHandler(async (req, res) => {
    const { userId } = req.user;  
    const subscribers = await Subscriber.find({ userId }).populate('subscribers', 'name profilePicture email');

    if (!subscribers) {
        throw new ApiError(404, 'No subscribers found');
    }

    res.status(200).json(new ApiResponse(200, subscribers, 'Subscribers fetched successfully'));
})


const getSubscriber = asyncHandler(async (req, res) => {
    const { userId } = req.user;  
    const { subscriberId } = req.params; 

    if (!subscriberId) {
        throw new ApiError(400, 'Subscriber ID is required');
    }

    const subscriber = await Subscriber.findOne({ userId, subscribers: subscriberId }).populate('subscribers', 'name profilePicture email');

    if (!subscriber) {
        throw new ApiError(404, 'Subscriber not found');
    }

    res.status(200).json(new ApiResponse(200, subscriber, 'Subscriber fetched successfully'));
})


const removeSubscriber = asyncHandler(async (req, res) => {
    const { userId } = req.user;  
    const { subscriberId } = req.params; 

    if (!subscriberId) {
        throw new ApiError(400, 'Subscriber ID is required');
    }
    const subscriber = await Subscriber.findOne({ userId });
    if (!subscriber) {
        throw new ApiError(404, 'Subscriber not found');
    }
    subscriber.subscribers.filter(sub => sub.toString() !== subscriberId);
    await subscriber.save();
    
    res.status(200).json(new ApiResponse(200, subscriber, 'Subscriber removed successfully'));
})

module.exports = {
    createSubscriber,
    getAllSubscribers,
    getSubscriber,
    removeSubscriber
}