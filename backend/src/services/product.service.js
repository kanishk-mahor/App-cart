const { Product } = require("../models");

/**
 * Get Product by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getProductById = async (id) => {
    const data = await Product.findOne({_id:id})
    console.log(id,"=======")
    return data
    // return Product.findOne({_id:id});
};

/**
 * Fetch all products
 * @returns {Promise<List<Products>>}
 */
const getProducts = async () => {
  return Product.find({});
};

module.exports = {
  getProductById,
  getProducts,
};
