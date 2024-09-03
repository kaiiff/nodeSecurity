const Admin = require("../../user/models/userModel");
const bcrypt = require("bcrypt");
const Joi = require("joi");

async function hashingPassword(password) {
  return await bcrypt.hash(password, 10);
}

async function validatePassword(plainaPassword, hashedPassword) {
  return await bcrypt.compare(plainaPassword, hashedPassword);
}

exports.register_admin = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const userSchema = Joi.object({
      name: Joi.string()

        .required()
        .messages({
          "string.base": "Name should be a type of string",
          "string.empty": "Name cannot be empty",

          "any.required": "Name is a required field",
        }),
      email: Joi.string().email().required().messages({
        "string.base": "Email should be a type of string",
        "string.email": "Email must be a valid email address",
        "string.empty": "Email cannot be empty",
        "any.required": "Email is a required field",
      }),
      password: Joi.string().min(6).required().messages({
        "string.base": "Password should be a type of string",
        "string.empty": "Password cannot be empty",
        "string.min": "Password should have a minimum length of 6",
        "any.required": "Password is a required field",
      }),
      role: Joi.string().valid("user", "admin").default("user").messages({
        "string.base": "Role should be a type of string",
        "string.empty": "Role cannot be empty",
        "any.only": "Role must be one of [user, admin]",
      }),
    });

    const { error } = userSchema.validate(
      { name, email, password, role },
      { abortEarly: false }
    );

    if (error) {
      return res.status(400).json({
        success: false,
        errors: error.details.map((err) => err.message),
      });
    } else {
      if (role === "admin") {
        const chekUser = await Admin.findOne({ email });

        if (chekUser) {
          return res.status(409).json({
            message:
              "This email is already registered. Please use a different email.",
          });
        }

        let hash = await hashingPassword(password);
        let picUrls = [];

        if (req.files.length) {
          picUrls = req.files.map(
            (file) => process.env.BASE_URL + file.filename
          );
        } else {
          picUrls = [
            "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
          ];
        }

        const addAdmin = new Admin({
          name: name,
          email: email,
          password: hash,
          role: role,
          pic: picUrls,
        });

        const data = await addAdmin.save();
        console.log("data ::", data);

        return res.status(200).json({
          success: true,
          msg: "Admin registered successfully!",
          data: data,
        });
      } else {
        return res.status(400).json({
          success: false,
          message: "Please signup as user!",
        });
      }
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send(error.message);
  }
};
