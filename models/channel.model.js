const mongoose = require('mongoose');

const channelSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true, // One bookmark document per user
  },
  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
    },
  ],
  channelName: {
    type: String,
    required: true,
    trim: true,
  },
  channelDescription: {
    type: String,
    required: true,
    trim: true,
  },
  channelImage: {
    type: String,
  },
  socialLinks: [{
    type: String,
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Channel = mongoose.model('Channel', channelSchema);

module.exports = Channel;
