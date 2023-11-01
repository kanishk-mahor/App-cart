const { Strategy: JwtStrategy, ExtractJwt } = require("passport-jwt");
const config = require("./config");
const { tokenTypes } = require("./tokens");
const { User } = require("../models");
const jwt = require("jsonwebtoken");

/**
 * These config options are required
 * Option 1: jwt secret environment variable set in ".env"
 * Option 2: mechanism to fetch jwt token from request Authentication header with the "bearer" auth scheme
 */
const jwtOptions = {
  secretOrKey: config.jwt.secret,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

/**
 * Logic to find the user matching the token passed
 * - If payload type isn't `tokenTypes.ACCESS` return an Error() with message, "Invalid token type" in the callback function
 * - Find user object matching the decoded jwt token
 * - If there's a valid user, return the user in the callback function
 * - If user not found, return `false` in the user field in the callback function
 * - If the function errs, return the error in the callback function
 *
 * @param payload - the payload the token was generated with
 * @param done - callback function
 */
const jwtVerify = async (payload, done) => {
  // console.log(done,"=========================payload")
  // console.log(ExtractJwt.fromAuthHeaderAsBearerToken(),"----8888888888888888")
  if(payload.type != tokenTypes.ACCESS){
    return new Error("Invalid token type")
  }
  
  let userId = payload.sub
  // console.log(userId,"=========================userID")

  await User.findOne({_id:userId},(err,user)=>{
    if(err){
      // console.log(user,"=========================payload")
      return done(err)
    }
    if(user){
      // console.log(user,"====================11111=====payload")
      return done(null, user)
    }else{
      // console.log(payload,"========================fewfwef=payload")
      return done(null, false,{message:"User not found."})
    }
  })
};

const jwtStrategy = new JwtStrategy(jwtOptions, jwtVerify);

module.exports = {
  jwtStrategy,
};
