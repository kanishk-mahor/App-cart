const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const { authService, userService, tokenService } = require("../services");
const ApiError = require("../utils/ApiError");

/**
 * Perform the following steps:
 * -  Call the userService to create a new user
 * -  Generate auth tokens for the user
 * -  Send back
 * --- "201 Created" status code
 * --- response in the given format
 *
 *
 */
const register = catchAsync(async (req, res) => {
   try {
     console.log("-----------req before")
      await userService.createUser({ ...req.body });
      const user = await userService.getUserByEmail(req.body.email);
      if (user) {
         res.status(201).json({
            user: user,
            tokens: tokenService.generateToken(user._id, "1d", "access"),
            // token: tokenService.generateToken(req.body.email,"1d","access")
         });
      } else {
         res.status(501).json({
            message: "server unavailable",
         });
      }
   } catch (error) {
      // console.log(error,"----erorr//1")
      res.status(400).json({
         message: "Bad request",
      });
   }
});

/**
 * Perform the following steps:
 * -  Call the authservice to verify is password and email is valid
 * -  Generate auth tokens
 * -  Send back
 * --- "200 OK" status code
 * --- response in the given format
 *
 * Example response:
 *
 */
const login = catchAsync(async (req, res) => {
   try {
      console.log("=========inside")

      if (!req.body.password || !req.body.email) {
         console.log(req.body.password,"------------------ew.body.password")
         throw new ApiError(httpStatus.BAD_REQUEST, "BAD_REQUEST");
      }
      const emailCheck = await userService.getUserByEmail(req.body.email);
      console.log(emailCheck)
      if (!emailCheck) {
         throw new ApiError(httpStatus.UNAUTHORIZED, "Unauthorized");
      }
      const tokenHeader = req.header("authorization") || "Bearer {{token}}";
      // console.log(req,"----------------------=======req\n")
      const user = await authService.loginUserWithEmailAndPassword(
         req.body.email,
         req.body.password
      );
      if (!user.statusCode) {
         res.status(200).json({
            user: user,
            tokens: await tokenService.generateAuthTokens(user),
         });
      } else {
         res.status(user.statusCode).json({
            code: user.statusCode,
            message: user.message,
         });
      }
   } catch (error) {
      // console.log(error,"----erorr")
      res.status(error.statusCode).json({
         code: error.statusCode,
         message: error.message,
      });
   }
});

module.exports = {
   register,
   login,
};
