const { CartMasterHelper } = require("../helpers/cart-helper");

let cartHelper = new CartMasterHelper();

class CartService {

  async addToCart(cartObj) {
    let cartData = await cartHelper.addToCart(cartObj);
    return cartData;
  };

  async getAllCartProducts(cartAddedBy) {
    let cartData = await cartHelper.getAllCartProducts(cartAddedBy);
    return cartData;
  };

  async deleteCartData(cartObj) {
    let cartData = await cartHelper.deleteCartData(cartObj);
    return cartData;
  };

};

module.exports = { CartService };