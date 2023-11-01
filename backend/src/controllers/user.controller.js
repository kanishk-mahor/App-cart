const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");
const { userService } = require("../services")
// const userService = require("../services/user.services")

/**
 * Get user details
 *  - Use service layer to get User data
 * 
 *  - If query param, "q" equals "address", return only the address field of the user
 *  - Else,
 *  - Return the whole user object fetched from Mongo

 *  - If data exists for the provided "userId", return 200 status code and the object
 *  - If data doesn't exist, throw an error using `ApiError` class
 *    - Status code should be "404 NOT FOUND"
 *    - Error message, "User not found"
 *  - If the user whose token is provided and user whose data to be fetched don't match, throw `ApiError`
 *    - Status code should be "403 FORBIDDEN"
 *    - Error message, "User not found"
 *
 * 
 * Request url - <workspace-ip>:8082/v1/users/6010008e6c3477697e8eaba3
 * 
 *
 * Example response status codes:
 * HTTP 200 - If request successfully completes
 * HTTP 404 - If user entity not found in DB
 * 
 * @returns {User | {address: String}}
 *  
 */
const getUser = catchAsync(async (req, res) => {
  if (Object.keys(req.query).length) {
    const body = await userService.getUserByIdWithParameter(req.params.userId, { address: 1, _id: 0 })
    res.status(200).json(body)
  }
  else {
    const body = await userService.getUserById(req.params.userId)
    if (!body) {
      throw new ApiError(httpStatus.NOT_FOUND, "user not found")
    }
    res.status(200).json(body)
  }
});


const updateUser = catchAsync(async (req, res) => {
  const update = await userService.updateAddressInUser(req.params.userId,req.body)
    res.status(200).json(update)
});



module.exports = {
  getUser,
  updateUser
  // getUserById
};
