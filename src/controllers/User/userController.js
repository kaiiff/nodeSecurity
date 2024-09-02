const User = require("../../models/User/userModel");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const { encode } = require("../../middleware/token");
const generateTokens = require("../../middleware/generateTokens");
const jwt = require("jsonwebtoken");

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;

async function hashingPassword(password) {
  return await bcrypt.hash(password, 10);
}

async function validatePassword(plainaPassword, hashedPassword) {
  return await bcrypt.compare(plainaPassword, hashedPassword);
}

exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userSchema = Joi.object({
      name: Joi.string().required().messages({
        "string.empty": "Name is required",
      }),
      email: Joi.string().email().required().messages({
        "string.empty": "Email is required",
        "string.email": "Please enter a valid email address",
      }),
      password: Joi.string().min(6).required().messages({
        "string.empty": "Password is required",
        "string.min": "Password should have at least 6 characters",
      }),
    });

    const { error } = userSchema.validate(
      { name, email, password },
      { abortEarly: false }
    );

    if (error) {
      return res.status(400).json({
        success: false,
        errors: error.details.map((err) => err.message),
      });
    } else {
      const isMailExist = await User.findOne({ email });
      if (isMailExist) {
        return res.status(409).json({
          message:
            "This email is already registered. Please use a different email.",
        });
      }

      let hash = await hashingPassword(password);
      let picUrls = [];

      if (req.files.length) {
        picUrls = req.files.map((file) => process.env.BASE_URL + file.filename);
      } else {
        picUrls = [
          "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
        ];
      }

      let addUser = new User({
        name: name,
        email: email,
        password: hash,
        pic: picUrls,
      });

      const data = await addUser.save();
      console.log("data ::", data);

      return res.status(200).json({
        msg: "User registered successfully!",
        data: data,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send(error.message);
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const userSchema = Joi.object({
      email: Joi.string().email().required().messages({
        "string.empty": "Email is required",
        "string.email": "Please enter a valid email address",
      }),
      password: Joi.string().min(6).required().messages({
        "string.empty": "Password is required",
        "string.min": "Password should have at least 6 characters",
      }),
    });

    const { error } = userSchema.validate(
      { email, password },
      { abortEarly: false }
    );

    if (error) {
      return res.status(400).json({
        success: false,
        errors: error.details.map((err) => err.message),
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(409).json({
        success: false,
        message: "User not found!",
      });
    }

    const passwordCheck = await validatePassword(password, user.password);
    if (!passwordCheck) {
      return res.status(400).json({
        success: false,
        message: "Password incorrect",
      });
    }

    const { accessToken, refreshToken } = generateTokens(user);

    // Store refresh token in the database
    user.refreshToken = refreshToken;
    await user.save();

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      maxAge: 15 * 60 * 1000,
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const userData = await User.findOne({ email }).select("name email pic");

    return res.status(200).json({
      success: true,
      message: "Login successful!",
      data: userData,
      accessToken: accessToken,
      refreshToken: refreshToken,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send(error.message);
  }
};

exports.logOutUser = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.refreshToken = null;
    await user.save();

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    return res.status(200).json({
      success: true,
      message: "Logged out successfully!",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send(error.message);
  }
};

exports.refreshAccessToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: "Refresh token is missing",
      });
    }

    let decoded;

    try {
      decoded = await jwt.verify(refreshToken, refreshTokenSecret);
    } catch (err) {
      return res.status(403).json({
        success: false,
        message: "Invalid or expired refresh token",
      });
    }

    const user = await User.findById(decoded.id);

    if (!user || user.refreshToken !== refreshToken) {
      return res.status(403).json({
        success: false,
        message: "Invalid token",
      });
    }

    const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
      generateTokens(user);

    user.refreshToken = newRefreshToken;
    await user.save();

    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: true,
      maxAge: 15 * 60 * 1000,
    });
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "New access token issued",
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    console.error("Error refreshing access token:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
