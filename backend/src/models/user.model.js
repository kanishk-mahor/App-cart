const httpStatus = require("http-status");
const mongoose = require("mongoose");
const { idText } = require("typescript");
// NOTE - "validator" external library and not the custom middleware at src/middlewares/validate.js
const validator = require("validator");
const config = require("../config/config");
const ApiError = require("../utils/ApiError");
const bcrypt = require("bcryptjs");

const userSchema = mongoose.Schema(
   {
      // name: {
      //    type: String,
      //    required: true,
      //    trim: true,
      // },
      email: {
         type: String,
         required: true,
         trim: true,
         unique: true,
         lowercase: true,
         validate(value) {
            if (
               value.match(
                  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
               ) == null
            ) {
               // console.log(!value.match(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)==null,"---------------------------------value")
               throw new ApiError(httpStatus.BAD_REQUEST, "BAD_REQUEST");
            }
         },
      },
      password: {
         type: String,
         required: true,
         trim: true,
         validate(value) {
            if (
               !value.match(/\d/) ||
               !value.match(/[a-zA-Z]/) ||
               value.length < 8
            ) {
               throw new Error(
                  "Password must contain at least one letter and one number"
               );
            }
         },
      },
      walletMoney: {
         type: Number,
         required: true,
         default: config.default_wallet_money,
      },
      address: {
         type: String,
         default: config.default_address,
      },
   },
   {
      timestamps: true,
   }
);

/**
 * Check if email is taken
 * @param {string} email - The user's email
 * @returns {Promise<boolean>}
 */
userSchema.statics.isEmailTaken = async function (email) {
   const email1 = await this.findOne({ email: email });
   return !email1.email;
};

userSchema.statics.isPasswordMatch = async function (email, password) {
  try {
    let isMatch = false
    const user = await this.findOne({email:email})
    console.log(user,"---user")
    
    if (!user) {
      return true
    }
    if(password == user.password){
      isMatch = true
    }
   //  isMatch = await bcrypt.compare(password, user.password)
    console.log(isMatch,"------isMAtch",password)

  // if (!isMatch) {
  //   throw new ApiError(httpStatus.UNAUTHORIZED,"password not match")
  //     // return true
  // }

  return isMatch
}catch(err){
  return err
}
}

/*
 * Create a Mongoose model out of userSchema and export the model as "User"
 * Note: The model should be accessible in a different module when imported like below
 * const User = require("<user.model file path>").User;
 */
/**
 * @typedef User
 */

let user = mongoose.model("user", userSchema);

module.exports = { User: user };
