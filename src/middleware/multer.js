const multer = require("multer");
const path = require("path");
const { v4: uuid4 } = require("uuid");

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname,"../public/images"));
  },
  
  
  filename: function (req, file, cb) {
    let ext = path.extname(file.originalname);
    cb(null, uuid4() + ext);
  },
});


var upload = multer({
  storage: storage,
   limits: { fileSize: 5 * 1024 * 1024 }, // Limit set to 5mb
  fileFilter: function (req, file, cb) {
    if (
      file.mimetype == "image/jpeg" ||
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "application/pdf" ||
      file.mimetype === "application/msword" ||
      file.mimetype ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      cb(null, true);
    } else {
      console.log("only jpg, jpeg, png, pdf, and word files are supported");
      cb(null, false);
    }
  },
});




module.exports = upload;