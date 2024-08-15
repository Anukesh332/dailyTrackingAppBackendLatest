const { ProductMasterHelper } = require("../helpers/product-helper");

let productHelper = new ProductMasterHelper();

class ProductService { 

    async addProduct(productObj) {
        let productData = await productHelper.addProduct(productObj);   
        return productData;
      };

      async getAllSellerProducts(productAddedBy) {
        let productData = await productHelper.getAllSellerProducts(productAddedBy);   
        return productData;
      };

      async deleteProduct(productObj) {
        let productdata = await productHelper.deleteProduct(productObj);
        return productdata;
      };

      async getAllProducts() {
        let allProductData = await productHelper.getAllProducts();
        return allProductData;
      };

      async getAllProductsNoUser() {
        let allProductData = await productHelper.getAllProductsNoUser();
        return allProductData;
      };

};

module.exports = { ProductService };