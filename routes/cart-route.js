const { Router } = require("express");
let router = Router();
const { CartService } = require("../services/cart-service");
const { errorLog } = require("../services/error-log-service");
const constants = require("../constants");
const fetchUserData = require("../middleware/fetchUserData");

let cartSvc = new CartService();

router.post("/addToCart", fetchUserData, async (req, res) => {
  try {
    if (req.SK == `User#${req.body.cartAddedBy}`) {
      let inputData = req.body;
      let cartData = await cartSvc.addToCart(inputData);
      if (cartData) {
        res.status(constants.SUCCESS).json({ "Message": "Added to Cart successfully." });
      } else {
        res.status(constants.BAD_REQUEST).json({ "Message": "Already added to Cart" });
      }
    } else {
      return res.status(constants.AUTHORIZATION_REQUIRED).json({ error: 'Authorization required' });
    }
  } catch (err) {
    errorLog(req, err, res);
  }
});

router.get("/getAllCartProducts", fetchUserData, async (req, res) => {
  try {
    let user = req.SK;
    let cartAddedBy = user.split("#");
    let allCartProducts = await cartSvc.getAllCartProducts(cartAddedBy[1]);
    if (allCartProducts) {
      res.status(constants.SUCCESS).json(allCartProducts);
    }
  } catch (err) {
    errorLog(req, err, res);
  }
});

router.post("/deleteCartData", fetchUserData, async (req, res) => {
  try {
    if (req.SK == `User#${req.body.cartAddedBy}`) {
      let inputData = req.body;
      let inputObj = await cartSvc.deleteCartData(inputData);
      if (inputObj) {
        res.status(constants.SUCCESS).json({ "Message": "You have deleted Cart Item Successfully" });
      }
    } else {
      return res.status(constants.AUTHORIZATION_REQUIRED).json({ error: 'Authorization required' });
    }
  } catch (err) {
    errorLog(req, err, res);
  }
});

module.exports = router;