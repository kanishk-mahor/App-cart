const Joi = require("joi");
const { password } = require("./custom.validation");

/**
 * Check request *body* for fields (all are *required*)
 * - "email" : string and satisyfing email structure
 * - "password": string and satisifes the custom password structure defined in "src/validations/custom.validation.js"
 * - "name": string
 */
const register = {
  registerValidation: Joi.object().keys({
      name: Joi.string().default("").max(50),
      email: Joi.string()
        .required()
        .email({tlds:{allow: false}}),
      password: Joi.string()
        .required()
    })
  // }
   
};

/**
 * Check request *body* for fields (all are *required*)
 * - "email" : string and satisyfing email structure
 * - "password": string and satisifes the custom password structure defined in "src/validations/custom.validation.js"
 */
const login = {
  loginValidation: Joi.object().keys({
    email: Joi.string()
      .required()
      .email({tlds:{allow:false}}),
    password: Joi.string()
      .required()
  })
};

module.exports = {
  register,
  login,
};
