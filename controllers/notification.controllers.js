const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');
const { CreatorNotification, UserNotification } = require('../models/notification.model');

const addCreatorNotification = asyncHandler(async (req, res) => {
    const { postId } = req.params;
    const { userId } = req.user;

    const { like, comment, shares, views, subscribes } = req.body;

    if (
        like.length === 0
        && comment.length === 0
        && shares.length === 0
        && views.length === 0
        && subscribes.length === 0) 
    {
        throw new ApiError(400, 'At least one notification type is required');
    }

    const notification = await CreatorNotification.findOne({ userId });
    if (!notification) {
        const newNotification = new CreatorNotification({
            userId,
            notifications: {
                likes: like,
                comments: comment,
                shares: shares,
                views: views,
                subscribes: subscribes
            }
        });
        await newNotification.save();
    } else {
        notification.notifications.likes.push(...like);
        notification.notifications.comments.push(...comment);
        notification.notifications.shares.push(...shares);
        notification.notifications.views.push(...views);
        notification.notifications.subscribes.push(...subscribes);
        await notification.save();
    }
    res.status(200).json(
        new ApiResponse(200, notification, 'Notification added successfully')
    );
})
const removeCreatorNotification = asyncHandler(async (req, res) => {
    
})
const addUserNotification = asyncHandler(async (req, res) => {

})
const removeUserNotification = asyncHandler(async (req, res) => {

})

module.exports = {
    addCreatorNotification,
    removeCreatorNotification,
    addUserNotification,
    removeUserNotification
}