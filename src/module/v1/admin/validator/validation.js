const Joi = require('joi');

const adminSchema = Joi.object({
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
     

}).unknown(true)

const validateAdmin = (req, res, next) => {
    const { error } = adminSchema.validate(req.body, { abortEarly: false });
    

    if (error) {
        
        return res.status(400).json({
            success: false,
            errors: error.details.map((err) => err.message),
        });
    }

    next();
};

module.exports = validateAdmin;
