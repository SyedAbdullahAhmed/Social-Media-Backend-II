const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');
const { CreatorNotification, UserNotification } = require('../models/notification.model');

const transformNotifications = (notifications, postId) => {
    let likes;
    let comments;
    let shares;
    let views;
    let subscribes;

    if (notifications?.likes) {
        likes = notifications.likes.map(userId => ({
            userId,
            postId
        }));
    } else {
        likes = [];
    }
    if (notifications?.comments) {
        comments = notifications.comments.map(userId => ({
            userId,
            postId
        }));
    } else {
        comments = [];
    }
    if (notifications?.shares) {
        shares = notifications.shares.map(userId => ({
            userId,
            postId
        }));
    } else {
        shares = [];
    }
    if (notifications?.views) {
        views = notifications.views.map(userId => ({
            userId,
            postId
        }));
    } else {
        views = [];
    }
    if (notifications?.subscribes) {
        subscribes = notifications.subscribes.map(userId => ({
            userId,
            postId
        }));
    } else {
        subscribes = [];
    }


    return {
        likes,
        comments,
        shares,
        views,
        subscribes
    }
}

const addCreatorNotification = asyncHandler(async (req, res) => {
    const { postId } = req.params;
    const { userId } = req.user;

    const notifications = req.body;

    if (
        notifications?.likes.length === 0
        && notifications?.comments.length === 0
        && notifications?.shares.length === 0
        && notifications?.views.length === 0
        && notifications?.subscribes.length === 0
    ) {
        throw new ApiError(400, 'At least one notification type is required');
    }

    const { likes, comments, shares, views, subscribes } =
        transformNotifications(notifications, postId);


    const notification = await CreatorNotification.findOne({ userId });
    if (!notification) {
        const newNotification = new CreatorNotification({
            userId,
            notifications: {
                likes: likes,
                comments: comments,
                shares: shares,
                views: views,
                subscribes: subscribes
            }
        });
        await newNotification.save();
    } else {
        notification.notifications.likes =
            [...notification.notifications.likes, ...likes];
        notification.notifications.comments =
            [...notification.notifications.comments, ...comments];
        notification.notifications.shares =
            [...notification.notifications.shares, ...shares];
        notification.notifications.views =
            [...notification.notifications.views, ...views];
        notification.notifications.subscribes =
            [...notification.notifications.subscribes, ...subscribes];
        await notification.save();
    }
    res.status(200).json(
        new ApiResponse(200, notification, 'Creator Notification added successfully')
    );
})


const removeCreatorNotification = asyncHandler(async (req, res) => {
    const { postId } = req.params;
    const { userId } = req.user;

    const { likes, comments, shares, views, subscribes } = req.body;

    const notification = await CreatorNotification.findOne({ userId });
    if (!notification) {
        throw new ApiError(404, 'Notification not found');
    }

    !likes 
        && (notification.notifications.likes = notification.notifications.likes
        .filter(
        (e) => e.userId.toString() !== userId.toString() 
        || e.postId.toString() !== postId.toString()
        ));

    !comments 
        && (notification.notifications.comments = notification.notifications.comments
        .filter(
        (e) => e.userId.toString() !== userId.toString() 
        || e.postId.toString() !== postId.toString()
        ));

    !shares 
        && (notification.notifications.shares = notification.notifications.shares
        .filter(
        (e) => e.userId.toString() !== userId.toString() 
        || e.postId.toString() !== postId.toString()
        ));

    !views 
        && (notification.notifications.views = notification.notifications.views
        .filter(
        (e) => e.userId.toString() !== userId.toString() 
        || e.postId.toString() !== postId.toString()
        ));

    !subscribes 
        && (notification.notifications.subscribes = notification.notifications.subscribes
        .filter(
        (e) => e.userId.toString() !== userId.toString() 
        || e.postId.toString() !== postId.toString()
        ));


    await notification.save();
    res.status(200).json(
        new ApiResponse(200, notification, 'Creator Notification removed successfully')
    );
})


const addUserNotification = asyncHandler(async (req, res) => {
    const { postId } = req.params;
    const { userId } = req.user;

    const notifications = req.body;

    if (
        notifications?.subscriberPost.length === 0
    ) {
        throw new ApiError(400, 'At least one notification type is required');
    }

    const { subscriberPost } =
        transformNotifications(notifications, postId);


    const notification = await CreatorNotification.findOne({ userId });
    if (!notification) {
        const newNotification = new UserNotification({
            userId,
            notifications: {
                subscriberPost,
            }
        });
        await newNotification.save();
    } else {
        notification.notifications.subscriberPost =
            [...notification.notifications.subscriberPost, ...likes];

        await notification.save();
    }
    res.status(200).json(
        new ApiResponse(200, notification, 'User Notification added successfully')
    );
})
const removeUserNotification = asyncHandler(async (req, res) => {
    const { postId } = req.params;
    const { userId } = req.user;

    const { subscriberPost } = req.body;

    const notification = await UserNotification.findOne({ userId });
    if (!notification) {
        throw new ApiError(404, 'Notification not found');
    }

    !subscriberPost 
        && (notification.notifications.subscriberPost = notification.notifications.subscriberPost
        .filter(
            (e) => e.userId.toString() !== userId.toString() 
            || e.postId.toString() !== postId.toString()
        ));


    await notification.save();
    res.status(200).json(
        new ApiResponse(200, notification, 'Creator Notification removed successfully')
    );
})

module.exports = {
    addCreatorNotification,
    removeCreatorNotification,
    addUserNotification,
    removeUserNotification
}