const httpStatus = require("http-status");
const userService = require("./user.service");
const ApiError = require("../utils/ApiError");
const bcrypt = require("bcryptjs")
const { User } = require("../models");

/**
 * Login with username and password
 * - Utilize userService method to fetch user object corresponding to the email provided
 * - Use the User schema's "isPasswordMatch" method to check if input password matches the one user registered with (i.e, hash stored in MongoDB)
 * - If user doesn't exist or incorrect password,
 * throw an ApiError with "401 Unauthorized" status code and message, "Incorrect email or password"
 * - Else, return the user object
 *
 * @param {string} email
 * @param {string} password
 * @returns {Promise<User>}
 */
const loginUserWithEmailAndPassword = async (email, password) => {
  try
  {
    const user = await userService.getUserByEmail(email)
    console.log("password", password,"=======")
    if (!user || !(await User.isPasswordMatch(email, password))) {
      // console.log(user,!await User.isPasswordMatch(email, password),"---------kkk")
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
    }
    return user;
  }catch(error){
    return error
  }
};

const encryptPassword = async (password) =>{
  const salt = await bcrypt.genSalt()
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword
}



module.exports = {
  loginUserWithEmailAndPassword,
  encryptPassword
};
