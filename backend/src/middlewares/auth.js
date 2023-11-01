const passport = require("passport");
const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const jwt = require("jsonwebtoken");
const config = require("../config/config");

/**
 * Custom callback function implementation to verify callback from passport
 * - If authentication failed, reject the promise and send back an ApiError object with
 * --- Response status code - "401 Unauthorized"
 * --- Message - "Please authenticate"
 *
 * - If authentication succeeded,
 * --- set the `req.user` property as the user object corresponding to the authenticated token
 * --- resolve the promise
 */
const verifyCallback = (req, res, next) => async (err, user, info) => {
  // console.log("===================info====================",req.header("authorization"))
  try{
    if(Object.keys(req.body).length || req.header("authorization")){
      req.authenticated = false;
      // console.log("---before-----11")
      if( req.header('authorization')){
        // console.log("---before-----")
        const authToken = req.header('authorization')
        // console.log(authToken,"==================ddwdmwm===\n")
        let token = authToken.split(' ')[1];
        
        jwt.verify(token, config.jwt.secret, function (err, decoded){
          if (err){
            throw new ApiError(httpStatus.UNAUTHORIZED,"Not a valid token")
          } else {
              // console.log("res");
              req.decoded = decoded;
              req.authenticated = true;
              // console.log(req.body)
              return next(res(req));
            }
          })
      }
      if(req.authenticated == false){
        throw new ApiError(httpStatus.UNAUTHORIZED,"not found in header")
        // console.log(user,"=================rrrrrrrrrrrrrr=====",info)
        // next(info)
      }
    }else{
      throw new ApiError(httpStatus.UNAUTHORIZED,"token is not found in header")
    }
  }catch(err){
    // console.log(err,"-----================------------")
    return next(err)
  }

};

// const verifyCallback = (req, res, next) => async (err, user, info) => {
//    console.log((err || info || req.body),"===================info====================",req.header("authorization"))
//    if (err || info || !req.body) {

//       next(new ApiError(httpStatus.UNAUTHORIZED, "Please authenticate"));
//    }
//    req.user = user;
//    res();
// };

/**
 * Auth middleware to authenticate using Passport "jwt" strategy with sessions disabled and a custom callback function
 *
 */
const auth = async (req, res, next) => {
   return new Promise((resolve, reject) => {
    // console.log("before validate--------------------------")
    passport.authenticate(
      "bearer",
      { session: false },
      verifyCallback(req, resolve, reject)
    )(req, res, next);
    })
    .then(() => next())
    .catch((err) => {
      next(err)
    });
};

module.exports = auth;
