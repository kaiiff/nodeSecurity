const express = require("express");
const {
  registerUser,
  loginUser,
  logOutUser,
  refreshAccessToken,
} = require("../controllers/userController");
const router = express.Router();
const upload = require("../middleware/middleware/multer");

router.post("/registerUser", upload.array("pic", 5), registerUser);
router.post("/loginUser", loginUser);
router.post("/logoutUser", logOutUser);
router.post("/token/refresh", refreshAccessToken);

module.exports = router;
