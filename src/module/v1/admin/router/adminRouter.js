const express = require("express")
const router = express.Router()
const upload = require("../middleware/middleware/multer");
const { register_admin } = require("../controller/adminController");
const validationCheck = require("../validator/validation")

router.post("/registerAdmin", upload.array("pic",5),validationCheck, register_admin)


module.exports = router;