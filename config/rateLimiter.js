const rateLimit = require('express-rate-limit');
const findUserInDbById = require("../utils/findUserInDbById.js");

const TIME_LIMIT = 1 * 60 * 1000; // 1 minute
const ADMIN_MAX_REQUESTS = 100;
const USER_MAX_REQUESTS = 50;

const adminRateLimiter = rateLimit({
  windowMs: TIME_LIMIT,
  max: ADMIN_MAX_REQUESTS,
  message: {
    status: 429,
    success: false,
    message: 'Too many requests from this IP, please try again later!.',
    maxRequestsAllowed: USER_MAX_REQUESTS
  }
});
const userRateLimiter = rateLimit({
  windowMs: TIME_LIMIT,
  max: USER_MAX_REQUESTS,
  message: {
    status: 429,
    success: false,
    message: 'Too many requests from this IP, please try again later!.',
    maxRequestsAllowed: USER_MAX_REQUESTS
  }
});


// Middleware to check user role and apply the appropriate limiter
const roleBasedRateLimiter = async (req, res, next) => {
  const userIdFromHeader = req.header('Authorization')?.split(' ')[1] || null;

  // if (
  //   !userIdFromHeader
  // ) {
  //   return res.status(401).json({
  //     success: false,
  //     message: 'Unauthorized, Id not found!',
  //     data: [],
  //   });
  // }
  if(userIdFromHeader === null) {
    return userRateLimiter(req, res, next);
  }

  const user = await findUserInDbById(userIdFromHeader);

  if (
    user?.role === 'admin'
  ) {
    return adminRateLimiter(req, res, next);
  } else {
    return userRateLimiter(req, res, next);
  }
};

module.exports = roleBasedRateLimiter;