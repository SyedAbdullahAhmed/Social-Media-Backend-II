const mongoose = require("mongoose");

const creatorNotificationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true // One notification doc per user
    },
    notifications: {
        likes: [
            {
                userId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User"
                },
                postId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Post"
                },
            }
        ],
        comments: [
            {
                userId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User"
                },
                postId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Post"
                },
            }
        ],
        shares: [
            {
                userId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User"
                },
                postId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Post"
                },
            }
        ],
        views: [
            {
                userId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User"
                },
                postId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Post"
                },
            }
        ],
        subscribes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User" // Subscribed to another user/channel
            }
        ]
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const userNotificationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true // One notification doc per user
    },
    notifications: {
        subscriberPost: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Post"
            }
        ],
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const CreatorNotification = 
    mongoose.model("CreatorNotification", creatorNotificationSchema);
    
const UserNotification = 
    mongoose.model("UserNotification", userNotificationSchema);

module.exports = {
    CreatorNotification,
    UserNotification
};
