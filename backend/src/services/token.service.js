const jwt = require("jsonwebtoken");
const config = require("../config/config");
const { tokenTypes } = require("../config/tokens");

/**
 * Generate jwt token
 * - Payload must contain fields
 * --- "sub": `userId` parameter
 * --- "type": `type` parameter
 *
 * - Token expiration must be set to the value of `expires` parameter
 *
 * @param {ObjectId} userId - Mongo user id
 * @param {Number} expires - Token expiration time in seconds since unix epoch
 * @param {string} type - Access token type eg: Access, Refresh
 * @param {string} [secret] - Secret key to sign the token, defaults to config.jwt.secret
 * @returns {string}
 */
Date.prototype.addHours = function(h) {
  this.setTime(this.getTime() + (h*60*60*1000));
  return this;
}
const generateToken = (userId, expires, type, secret = config.jwt.secret) => {
  // console.log(userId,'----------------------userId-----------')
  const payload = {
    sub: userId,
    iat: Math.floor(Date.now() /1000),
    expiresIn: expires,
    type,
  }
  let token = jwt.sign(payload,secret);


  return {
    access:{
      token:token,
      expires:(new Date().addHours(24)).toISOString()
    }
  }

  
};

/**
 * Generate auth token
 * - Generate jwt token
 * - Token type should be "ACCESS"
 * - Return token and expiry date in required format
 *
 * @param {User} user
 * @returns {Promise<Object>}
 *
 * Example response:
 * "access": {
 *          "token": "eyJhbGciOiJIUzI1NiIs...",
 *          "expires": "2021-01-30T13:51:19.036Z"
 * }
 */
const generateAuthTokens = async (user) => {
  try{
    const token = generateToken(user.email,"1d","access");
    token.access.expires = new Date(token.access.expires)
    return token//{
      // user:user,
    //   access: {
    //     token: user,
    //     expires: (new Date().addHours(24)).toISOString()
    //   }
    // }
  }catch(error){
    console.log(error,"-============================error")
    return error
  }
};

module.exports = {
  generateToken,
  generateAuthTokens,
};
