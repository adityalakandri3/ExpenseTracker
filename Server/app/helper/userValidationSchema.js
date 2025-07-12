const Joi = require("joi");

const userValidationSchema = Joi.object({
  name: Joi.string().min(6).required().messages({
    "string.empty": "Name is required",
  }),
  email: Joi.string().email().required().messages({
    "string.email": "Email must be a valid email",
    "string.empty": "Email is required",
  }),
  role: Joi.string().valid("user").default("user"),
  phone: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .required()
    .messages({
      "string.pattern.base": "Phone number must be 10 digits",
      "string.empty": "Phone number is required",
    }),
  password: Joi.string().min(6).required().messages({
    "string.min": "Password must be at least 6 characters",
    "string.empty": "Password is required",
  }),
  location: Joi.object({
    state: Joi.string().required().messages({
      "string.empty": "State is required",
    }),
    city: Joi.string().required().messages({
      "string.empty": "City is required",
    }),
  }).required(),
  is_verified: Joi.boolean().default(false),
});

module.exports = userValidationSchema;
