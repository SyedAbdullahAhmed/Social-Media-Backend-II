const jwt = require("jsonwebtoken");

const generateTokens = (userPayload) => {
  const accessToken = jwt.sign(
    userPayload,
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "15m" }
  );

  const refreshToken = jwt.sign(
    userPayload,
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY || "7d" }
  );

  return {
    accessToken,
    refreshToken,
  };
};

module.exports = generateTokens;