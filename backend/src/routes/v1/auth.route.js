const express = require("express");
const validate = require("../../middlewares/validate");
// const authValidation = require("../../validations/auth.validation");
const authController = require("../../controllers/auth.controller");
const auth = require("../../middlewares/auth");
const { valid } = require("joi");

const router = express.Router();


// const validateregiter = validate(authValidation.register)
// const validatelogin = validate(authValidation.register)

// const authbearer = await auth.auth()
router.post("/register", authController.register
 
)

router.post("/login", authController.login

)

module.exports = router;
