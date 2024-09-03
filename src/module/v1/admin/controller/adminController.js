const { createAdmin } = require("../services/adminService");

exports.register_admin = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const picUrls = req.files.length
      ? req.files.map((file) => process.env.BASE_URL + file.filename)
      : [];

    const data = await createAdmin({ name, email, password, role, picUrls });

    return res.status(200).json({
      success: true,
      msg: "Admin registered successfully!",
      data: data,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
