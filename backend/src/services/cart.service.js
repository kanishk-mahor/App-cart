const httpStatus = require("http-status");
const { Cart, Product } = require("../models");
const ApiError = require("../utils/ApiError");
const config = require("../config/config");
var _ = require("lodash");
const { objectId } = require("../validations/custom.validation");
const { isObject, reject } = require("lodash");
// const { isError } = require("joi");

/**
 * Fetches cart for a user
 * - Fetch user's cart from Mongo
 * - If cart doesn't exist, throw ApiError
 * --- status code  - 404 NOT FOUND
 * --- message - "User does not have a cart"
 *
 * @param {User} user
 * @returns {Promise<Cart>}
 * @throws {ApiError}
 */
const getCartByUser = async (user) => {
  try {
    let data
    if(user.user){
      data = await Cart.findOne({"$or":[{ email: user.user.email },{ "cartItems.product._id": user.user.productId }]});
    }else if(isObject(user)) {
      data = await Cart.findOne({ email: user.email });
      console.log(data,"------user-----")
    }
    else{
      console.log(user,"------user-----")
      throw new ApiError(httpStatus.BAD_REQUEST,"Bad request")
    }
    // const data = await Cart.findOne({ "cartItems.product._id": user.email });
    if (data === null) {
      console.log(data,"-------data---------")
      throw new ApiError(httpStatus.NOT_FOUND, "User does not have a cart not found");
    }else if(!data){
      throw new ApiError(httpStatus.NOT_FOUND, "User does not have a cart");
    }else {
      return data;
    }
  } catch (err) {
    console.log(err,"----------------errrrrrr")
    throw err;
    // {
    //   status: err.statusCode,
    //   message: "User does not have a cart"
    // }
  }
};

/**
 * Adds a new product to cart
 * - Get user's cart object using "Cart" model's findOne() method
 * --- If it*-- doesn't exist, create one
 * --- If cart creation fails, throw ApiError with "500 Internal Server Error" status code
 *
 * - If product to add already in user's cart, throw ApiError with
 * --- status code  - 400 BAD REQUEST
 * --- message - "Product already in cart. Use the cart sidebar to update or remove product from cart"
 *
 * - If product to add not in "products" collection in MongoDB, throw ApiError with
 * --- status code  - 400 BAD REQUEST
 * --- message - "Product doesn't exist in database"
 *
 * - Otherwise, add product to user's cart
 *
 *
 *
 * @param {User} user
 * @param {string} productId
 * @param {number} quantity
 * @returns {Promise<Cart>}
 * @throws {ApiError}
 */
const addProductToCart = async (user, productId, quantity) => {
  try {
    let cart = await Cart.findOne({"$or":[{ email: user.email },{ "cartItems.product._id": user.productId }]});
    const product = await Product.findOne({ _id: productId });
    console.log(cart,"===112221==cart")
    // console.log(product,"-products--")
    let cCart = {}
    if (!cart) {
      cart = new Cart({email: user.email,
        // cartItems: [
        //   {
        //     product: product,
        //     quantity: quantity,
        //   },
        // ],
      })   
      // cCart = await cart.save();
      // if(!cCart){
      //   throw new ApiError(500, 'INternal server Error');
      // }
    }
    if(product === null){ 
      throw new ApiError(400, "Product doesn't exist in database");
    }
    console.log(cart,"===111==cart")
    let cartItem = []
    if(cart.cartItems.length ){
      for(let item of cart.cartItems){
        if(_.get(item, "product._id")){
          item.product._id.toString() == productId
          // {
            console.log(productId,"--cart33Item----",item.product._id.toString())
            cartItem = cart.cartItems
          // }
        }else{
          console.log(item,"--car444tItem----")
          cartItem = item
        }
      }
    }
    console.log(cartItem,"-----cartItem")
    if (Object.keys(cartItem).length) {
      throw new ApiError(400, 'Product already in cart. Use the cart sidebar to update or remove product from cart');
    }
    else{
      cart.cartItems.push({ product: product, quantity: quantity });
      cCart = await cart.save();
    }

    // cart.items = cart.items || [];
    // console.log(cartItem,"------cartItems",productId)
      
    // if (cartItem) {
    //   throw new ApiError(400, "Product already in cart. Use the cart sidebar to update or remove the product from the cart");
    // }

    if(!cCart){
      throw new ApiError(500, 'INternal server Error');
    }
    if(cCart){
      return cart;
    }
    else{
      throw new ApiError(500, "Internal Server Error")
    }
  } catch (error) { 
    // console.log(error,"---error----")
    return error
  }
};

/**
 * Updates the quantity of an already existing product in cart
 * - Get user's cart object using "Cart" model's findOne() method
 * - If cart doesn't exist, throw ApiError with
 * --- status code  - 400 BAD REQUEST
 * --- message - "User does not have a cart. Use POST to create cart and add a product"
 *
 * - If product to add not in "products" collection in MongoDB, throw ApiError with
 * --- status code  - 400 BAD REQUEST
 * --- message - "Product doesn't exist in database"
 *
 * - If product to update not in user's cart, throw ApiError with
 * --- status code  - 400 BAD REQUEST
 * --- message - "Product not in cart"
 *
 * - Otherwise, update the product's quantity in user's cart to the new quantity provided and return the cart object
 *
 *
 * @param {User} user
 * @param {string} productId
 * @param {number} quantity
 * @returns {Promise<Cart>
 * @throws {ApiError}
 */ 
const updateProductInCart = async (user, productId, quantity) => { 
  // console.log(user,productId,quantity,"-----------")
  // const cart = await Cart.findOne()
  try{
    const cart = await Cart.findOne({"cartItems.product._id":productId})
    if(!cart){
      console.log(cart,"===============================cart==============")
      throw new ApiError(400,"User does not have a cart. Use POST to create cart and add a product")
    }
    // await addProductToCart(user,productId,quantity)
    const product = await Product.findOne({ _id: productId})
    if (!product) {
      throw new ApiError(400, "Product doesn't exist in database");
    }

    const cartItem = cart.cartItems.find((item) => item.product._id.toString() === productId);
    console.log(cartItem,"=========cartItem")

    if (!cartItem) {
      throw new ApiError(400, "Product not in cart");
    }
    cartItem.quantity = quantity;

    await cart.save();

    return cart;
  } catch (error) {
    throw error;
  }
};

/**
 * Deletes an already existing product in cart
 * - If cart doesn't exist for user, throw ApiError with
 * --- status code  - 400 BAD REQUEST
 * --- message - "User does not have a cart"
 *
 * - If product to update not in user's cart, throw ApiError with
 * --- status code  - 400 BAD REQUEST
 * --- message - "Product not in cart"
 *
 * Otherwise, remove the product from user's cart
 *
 *
 * @param {User} user
 * @param {string} productId
 * @throws {ApiError}
 */
const deleteProductFromCart = async (user, productId) => {
  const cart = await Cart.findOne({"cartItems.product._id": user.productId})
  console.log(cart,"-----cart----",productId)
  if(!cart){
    // addProductToCart(user,productId,user.quantity)
    console.log("error 400")
    throw new ApiError(httpStatus.BAD_REQUEST,"User does not have a cart")
  }
  else{
    let noProduct = true
    if(cart.cartItems && cart.cartItems.length){
      for(let products of cart.cartItems){
        if(products.product._id.toString() === productId.toString()){
          noProduct = false
          let index = cart.cartItems.indexOf(products)
          if(index > -1){
            cart.cartItems.splice(index,1)
          }
          break
        }
      }
    }
    else{
      noProduct = true
    }
    if(noProduct){
      throw new ApiError(httpStatus.BAD_REQUEST,"Product not in cart")
    }else{
      return cart
    }
  }
};

/**
 * Checkout a users cart.
 * On success, users cart must have no products.
 *
 * @param {User} user
 * @returns {Promise}
 * @throws {ApiError} when cart is invalid
 */
const checkout = async (user) => {
  try{
    let cart = await getCartByUser(user);
    console.log(cart,"===============================cart==============")
    if(!cart){
      throw new ApiError(httpStatus.BAD_REQUEST,"User does not have a cart")
    }
    else if(cart.statusCode === 404){
      throw new ApiError(httpStatus.NOT_FOUND,"User does not have a cart not found")
    }
    else if(!cart.cartItems.length){
      throw new ApiError(httpStatus.BAD_REQUEST,"User does not have a Product")
    }
    else if(config.default_address === user.address){
      throw new ApiError(httpStatus.BAD_REQUEST,"Bad Request")
    }
    // else if(!user.hasSetNonDefaultAddress()){
    //   throw new ApiError(httpStatus.BAD_REQUEST,"Bad Request")
    // }  
    else if(cart.cartItems && !cart.cartItems.length){
      throw new ApiError(httpStatus.BAD_REQUEST,"Bad Request")
    }
    else{
      let total_cost = 0
      for(let products of cart.cartItems){

        total_cost += products.product.cost
      }
      console.log(total_cost, "-------", user.walletMoney)
      if(total_cost > user.walletMoney){
        throw new ApiError(httpStatus.BAD_REQUEST,"Bad Request")
      }
      else{
        user.walletMoney -= total_cost;
        await user.save();
        cart = await deleteProductFromCart(cart,cart.cartItems[0].product._id)
        return cart;
      }
    }
  }catch(error){
    console.log(error,"===================error")
    throw error;
  }
};

module.exports = {
  getCartByUser,
  addProductToCart,
  updateProductInCart,
  deleteProductFromCart,
  checkout,
};
