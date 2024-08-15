const { Router } = require("express");
let router = Router();
const { BuyedOneService } = require("../services/buyedone-service");
const { errorLog } = require("../services/error-log-service");
const constants = require("../constants");
const fetchUserData = require("../middleware/fetchUserData");

let buyedOneSvc = new BuyedOneService();

router.post("/buyProduct", fetchUserData, async (req, res) => {
  try {
    if (req.SK == `User#${req.body.cartAddedBy}` || req.SK == `User#${req.body.productAddedBy}`) {
      let inputData = req.body;
      let buyedOneData = await buyedOneSvc.buyProduct(inputData);
      if (buyedOneData) {
        res.status(constants.SUCCESS).json({ "Message": "Order Placed Successfully." });
      }
    } else {
      return res.status(constants.AUTHORIZATION_REQUIRED).json({ error: 'Authorization required' });
    }
  } catch (err) {
    errorLog(req, err, res);
  }
});

router.get("/getDeliveryPendingProducts", fetchUserData, async (req, res) => {
  try {
    let user = req.SK;
    let productAddedBy = user.split("#");
    let deliveryPendingProducts = await buyedOneSvc.getDeliveryPendingProducts(productAddedBy[1]);
    if (deliveryPendingProducts) {
      res.status(constants.SUCCESS).json(deliveryPendingProducts);
    }
  } catch (err) {
    errorLog(req, err, res);
  }
});

router.get("/getDeliveredProducts", fetchUserData, async (req, res) => {
  try {
    let user = req.SK;
    let productAddedBy = user.split("#");
    let deliveredProducts = await buyedOneSvc.getDeliveredProducts(productAddedBy[1]);
    if (deliveredProducts) {
      res.status(constants.SUCCESS).json(deliveredProducts);
    }
  } catch (err) {
    errorLog(req, err, res);
  }
});

router.post("/getDeliveredProductsGraph", fetchUserData, async (req, res) => {
  try {
    let user = req.SK;
    let productAddedBy = user.split("#");
    let inputData = req.body;
    let deliveredProducts = await buyedOneSvc.getDeliveredProductsGraph(productAddedBy[1], inputData);
    if (deliveredProducts) {
      res.status(constants.SUCCESS).json(deliveredProducts);
    }
  } catch (err) {
    errorLog(req, err, res);
  }
});

router.get("/getMyOrder", fetchUserData, async (req, res) => {
  try {
    let user = req.SK;
    let cartAddedBy = user.split("#");
    let getMyOrder = await buyedOneSvc.getMyOrder(cartAddedBy[1]);
    if (getMyOrder) {
      res.status(constants.SUCCESS).json(getMyOrder);
    }
  } catch (err) {
    errorLog(req, err, res);
  }
});

module.exports = router;