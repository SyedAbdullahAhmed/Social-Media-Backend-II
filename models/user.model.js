const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    minlength: [3, 'Full name must be at least 3 characters'],
    trim: true
  },
  age: {
    type: Number,
    min: [13, 'Age must be at least 13'],
    max: [120, 'Age cannot be more than 120']
  },
  address: {
    type: String,
    maxlength: [255, 'Address is too long']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    match: [/^\+?\d{10,15}$/, 'Please enter a valid phone number']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/\S+@\S+\.\S+/, 'Please enter a valid email address']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false // don't return password field by default
  },
  profilePath: {
    type: String,
    default: '/public'
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  refreshToken: {
    type: String
  },
  accessToken: {
    type: String
  },
  otp: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'creator'],
    default: 'user'
  }
});

// Optional: Automatically update updatedAt field
userSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
