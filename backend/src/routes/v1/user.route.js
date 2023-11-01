const express = require("express");
const validate = require("../../middlewares/validate");
const userValidation = require("../../validations/user.validation");
const { userController } = require("../../controllers");
const { isValidObjectId } = require("mongoose");
const auth = require("../../middlewares/auth");
// const  { userService } = require("../../services")

const router = express.Router();

// router.get("/:userId", async (req, res)=>{
//     try{
//         const valid = userValidation.getUser()
//         // const valids = validate(valid(req,req))
//         console.log(valid,"----valid")
//         return userController.getUser(req, res)
//     }catch(err){
//         if(err.statusCode == 502){
//             return err.message
//         }
//         else{
//             return err
//         }
//     }

// })

router.get(
    "/:userId",
    auth,
    validate(userValidation.getUser),
    userController.getUser
  );

router.put(
    "/:userId",
    auth,
    validate(userValidation.setAddress),
    userController.updateUser
  );
module.exports = router;
