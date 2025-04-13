const slowDown = require('express-slow-down');
const findUserInDbById = require("../utils/findUserInDbById.js");

const TIME_LIMIT = 1 * 60 * 1000; // 1 minute
const DELAY_TIME_LIMIT = 300; 
const ADMIN_SLOW_DOWN_LIMIT = 100;
const USER_SLOW_DOWN_LIMIT = 50;


const adminSlowDown = slowDown({
  windowMs: TIME_LIMIT,
  delayAfter: ADMIN_SLOW_DOWN_LIMIT,
  delayMs: (hits) => hits * DELAY_TIME_LIMIT,
})
const userSlowDown = slowDown({
  windowMs: TIME_LIMIT, 
  delayAfter: USER_SLOW_DOWN_LIMIT,
  delayMs: (hits) => hits * DELAY_TIME_LIMIT,
})


// Middleware to check user role and apply the appropriate limiter
const roleBasedSlowDown = async (req, res, next) => {
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
    if (userIdFromHeader === null) return userSlowDown(req, res, next);

    const user = await findUserInDbById(userIdFromHeader);
    if(!user) {
      return res.status(500).json({
        success: false,
        message: "User not found!",
        data: [],
      });
    }
  
    user?.role === 'admin'
    ? adminSlowDown(req, res, next) 
    : userSlowDown(req, res, next)
  };

  module.exports = roleBasedSlowDown