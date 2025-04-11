const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  description: {
    type: String,
    trim: true
  },
  videoPath: {
    type: String
  },
  imagePath: {
    type: String
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  comments: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    comment: String,
    commentedAt: { type: Date, default: Date.now }
  }],
  postedAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: Date,
}, {
  timestamps: true
});

module.exports = mongoose.model('Post', postSchema);
