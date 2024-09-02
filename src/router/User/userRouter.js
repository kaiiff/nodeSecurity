const express = require("express");
const { registerUser, loginUser, logOutUser } = require("../../controllers/User/userController");
const router = express.Router()
const upload = require("../../middleware/multer")


router.post('/registerUser', upload.array("pic",5), registerUser)
router.post('/loginUser',loginUser)
router.post('/logoutUser',logOutUser)


module.exports = router;