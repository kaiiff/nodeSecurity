const jwt = require("jsonwebtoken");
const { encrypt } = require("../utils/encrypt_decrypt");

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;

function generateTokens(user) {
  const encryptedUserId = encrypt(user.id.toString());
  // console.log("encryptedUserId :::",encryptedUserId)

  const accessToken = jwt.sign(
    { id: encryptedUserId, email: user.email },
    accessTokenSecret,
    { expiresIn: "15m" }
  );

  const refreshToken = jwt.sign(
    { id: encryptedUserId, email: user.email },
    refreshTokenSecret,
    { expiresIn: "7d" }
  );

  return { accessToken, refreshToken };
}

module.exports = generateTokens;
