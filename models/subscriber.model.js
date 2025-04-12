const mongoose = require('mongoose');

const subscriberSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true, // One bookmark document per user
  },
  subscribers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Subscriber = mongoose.model('Subscriber', subscriberSchema);

module.exports = Subscriber;

// get the used id

// ROLE:CREATOR
// -liked post
// -commented post
// -shared post
// -views post
// -subscribed channel

// ROLE:USER
// -subscriber post 


/**
 * data: {like: true, comment: true, shares: true, views: true}
 * notification: {
 *  like: [1,2,3],
 *  comment: [1,2,3],
 *  shares: [1,2,3],
 *  views: [1,2,3],
 *  subscribes: [1,2,3],
 * }
 */