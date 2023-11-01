const { User } = require("../models");
const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const bcrypt = require("bcryptjs");
const { password } = require("../validations/custom.validation");

/**
 * Get User by id
 * - Fetch user object from Mongo using the "_id" field and return user object
 * @param {String} id
 * @returns {Promise<User>}
 */
  async function getUserById(id){
    // console.log("---data")
      const data = await User.findOne({_id:id})
      // console.log(data,"---data")
      return data
  }

//   getUserById("600a695da6e5b6845906e726") 

/**
 * Get User by id with query parameter
 * - Fetch user object from Mongo using the "_id" field filter on basis of projection and return user object
 * @param {String} id
 * @param {String} projection
 * @returns {Promise<User>}
 */
 async function getUserByIdWithParameter(id,projection){
  const data = await User.findOne({_id:id},projection)
  return data
}

//

/**
 * Get user by email
 * - Fetch user object from Mongo using the "email" field and return user object
 * @param {string} email
 * @returns {Promise<User>}
 */

  async function getUserByEmail(email){
    const dataEmail = await User.findOne({email:email})
    // console.log(dataEmail)
    return dataEmail
  }

  async function getUserAddressById(id){
    const detail = await User.findOne({_id:id},{email:1, address:1})
    return detail
  }

  const encryptPassword = async (password) =>{
    const salt = await bcrypt.genSalt()
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword
  }

/**
 * Create a user
 *  - check if the user with the email already exists using `User.isEmailTaken()` method
 *  - If so throw an error using the `ApiError` class. Pass two arguments to the constructor,
 *    1. “200 OK status code using `http-status` library
 *    2. An error message, “Email already taken”
 *  - Otherwise, create and return a new User object
 *
 * @param {Object} userBody
 * @returns {Promise<User>}
 * @throws {ApiError}
 *
 * userBody example:
 *
 * 200 status code on duplicate email - https://stackoverflow.com/a/53144807
 */
 async function createUser(user){
  try{
    // console.log(user)
    if(user.password.length <8 || !user.password.match(/\d/) || !user.password.match(/[a-zA-Z]/)){
      throw new ApiError(httpStatus.BAD_REQUEST,"Bad Request")
    }
    // const hashedPassword = await encryptPassword(user.password)
    const createUser = await User.create({...user})
    const emailCheck = await User.isEmailTaken(user.email)
    if(emailCheck){
      console.log("already")
          throw  new ApiError(httpStatus.ALREADY_REPORTED,"Already Created")
    }
    if(createUser){
      return user
        // return {
        //     statuscode: (httpStatus.OK,"created" ),
        //     message: "Email created"
        // }
    }
  }catch(err){
    console.log(err,"-------------erreeeee")
    throw new ApiError(httpStatus["411_MESSAGE"],"rejected it is")
  }
}

async function updateAddressInUser(userId, body){
  try{
    
    // console.log(dataEmail,"=============userrr=============")
    await User.updateOne({_id:userId},{$set:{"address":body.address}})
    return (await User.findOne({_id:userId}))
  }catch(err){
    throw new ApiError(httpStatus.NOT_FOUND,"Not found")
  }
}
async function setAddress(userId, body){
  try{
    
    // console.log(dataEmail,"=============userrr=============")
    await User.updateOne({_id:userId},{$set:{"address":body.address}})
    return (await User.findOne({_id:userId}))
  }catch(err){
    throw new ApiError(httpStatus.NOT_FOUND,"Not found")
  }
}

/**
 * Get subset of user's data by id
 * - Should fetch from Mongo only the email and address fields for the user apart from the id
 *
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
// const getUserAddressById = async (id) => {
// };

/**
 * Set user's shipping address
 * @param {String} email
 * @returns {String}
 */
// const setAddress = async (user, newAddress) => {
//   user.address = newAddress;
//   await user.save();

//   return user.address;
// };


module.exports = {
  getUserById,
  getUserByEmail,
  createUser,
  getUserByIdWithParameter,
  updateAddressInUser,
  setAddress,
  getUserAddressById
}


