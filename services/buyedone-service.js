const { BuyedOneMasterHelper } = require("../helpers/buyedone-helper");

let buyedOneHelper = new BuyedOneMasterHelper();

class BuyedOneService {

  async buyProduct(buyProductObj) {
    let buyedProjData = await buyedOneHelper.buyProduct(buyProductObj);
    return buyedProjData;
  };

  async getDeliveryPendingProducts(productAddedBy) {
    let data = await buyedOneHelper.getDeliveryPendingProducts(productAddedBy);
    return data;
  };

  async getDeliveredProducts(productAddedBy) {
    let data = await buyedOneHelper.getDeliveredProducts(productAddedBy);
    return data;
  };

  async getDeliveredProductsGraph(productAddedBy, inputData) {
    let data = await buyedOneHelper.getDeliveredProductsGraph(productAddedBy, inputData);
    return data;
  };

  async getMyOrder(cartAddedBy) {
    let data = await buyedOneHelper.getMyOrder(cartAddedBy);
    return data;
  };

};

module.exports = { BuyedOneService };