const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const { cartService, productService } = require("../services");
const ApiError = require("../utils/ApiError");

/**
 * Fetch the cart details
 *
 * Example response:
 * HTTP 200 OK
 * 
 *
 */
const getCart = catchAsync(async (req, res) => {
  try{
    console.log(req.body,"===============")
    const cart = await cartService.getCartByUser(req.body);
    console.log(cart,"===============")
    if(cart.statusCode!=httpStatus.NOT_FOUND){
      res.send(cart);
    }
    else{
      throw new ApiError(httpStatus.NOT_FOUND,cart.message)
    }
  }catch(error){
    res.status(404).json({
      message:error.message
    })
  }

});

/**
 * Add a product to cart
 *
 *
 */
const addProductToCart = catchAsync(async (req, res) => {
  try{
    console.log(req.body,"==========-------")
    const cart = await cartService.addProductToCart(
      req.body.user,
      req.body.productId,
      req.body.quantity
    );
    console.log(cart,"===========cart======")
    if(res.statusCode === 200){
      console.log(res.statusCode,"============status=========")
      res.status(httpStatus.CREATED).send(cart); 
    }
    else{
      console.log(res.statusCode,"==================111===error==============")
      throw res
    }
  }catch(error){
    console.log(res.statusCode,"=====================error==============")
    res.status(res.statusCode).json({
      message: res.message
    })
  }
});

/**
 * Update product quantity in cart
 * - If updated quantity > 0, 
 * --- update product quantity in user's cart
 * --- return "200 OK" and the updated cart object
 * - If updated quantity == 0, 
 * --- delete the product from user's cart
 * --- return "204 NO CONTENT"
 * 
 * Example responses:
 * HTTP 200 - on successful update
 * HTTP 204 - on successful product deletion
 * 
 *
 */
const updateProductInCart = catchAsync(async (req, res) => {
  try{
    console.log(req.body,"-----------req body-------")
    if(req.body.quantity){
      // const cartProduct = await productService.getProductById(req.body.productId)
      const cartProduct = await cartService.updateProductInCart(req.body,req.body.productId,req.body.quantity)
      console.log(cartProduct,"=======ffff====")
      if(cartProduct.statusCode){
        throw new ApiError(httpStatus[cartProduct.statusCode],cartProduct.message)
      }
      
      res.status(httpStatus.OK).json(cartProduct)
    }
    else{
      const deleteCart = await cartService.deleteProductFromCart(req.body,(req.body.productId).toString())
      console.log(deleteCart,"==============bodt")
      return res.status(204).json("No Content")
    }
  }catch(error){
    console.log(error,"======error")
    res.status(400).json({message: error.message})
  }
});

const checkout = catchAsync(async (req, res) => {
  try{
    console.log(req.body)
    let resp = await cartService.checkout(req.body);
    // console.log(resp.statusCode,"===============resp")
    if(resp.statusCode){
      res.status(resp.statusCode).json({message: resp.message})
      // return new ApiError(httpStatus[res.statusCode],res.message)
    }
  }catch(error){
    console.log(error,"======error")
    return error
    // res.status(400).json({message: error.message})
    // console.timeEnd("jest time")
  }
  });



module.exports = {
  getCart,
  addProductToCart,
  updateProductInCart,
  checkout
};
