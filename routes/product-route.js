const { Router } = require("express");
let router = Router();
const { ProductService } = require("../services/product-service");
const { errorLog } = require("../services/error-log-service");
const constants = require("../constants");
const fetchUserData = require("../middleware/fetchUserData");
const multer = require('multer');
const path = require('path');
const fs = require('fs');

let productSvc = new ProductService();

const storage = multer.diskStorage({
  destination: './uploads/',
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage }).single('image');
const uploadsDirectory = path.join('C:/DailyTrackingApp/Backend', 'uploads');

router.post('/upload', (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      console.error(err);
      return res.status(constants.INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' });
    }
    if (!req.file) {
      return res.status(constants.NOT_FOUND).json({ error: 'No file uploaded' });
    }
    return res.status(constants.SUCCESS).json({ filename: req.file.filename });
  });
});

router.get('/user/image/:filename', (req, res) => {
  const { filename } = req.params;
  const imagePath = path.join(uploadsDirectory, filename);

  res.sendFile(imagePath);
});

router.post("/addProduct", fetchUserData, async (req, res) => {
  try {
    if (req.SK == `User#${req.body.productAddedBy}`) {
      let inputData = req.body;
      let productData = await productSvc.addProduct(inputData);
      if (productData) {
        res.status(constants.SUCCESS).json({ "Message": !inputData.ModifiedOn ? "Note added successfully." : "Note updated successfully." });
      };
    } else {
      return res.status(constants.AUTHORIZATION_REQUIRED).json({ error: 'Authorization required' });
    }
  } catch (err) {
    errorLog(req, err, res);
  }
});

router.get("/getAllSellerProducts", fetchUserData, async (req, res) => {
  try {
    let user = req.SK
    let productAddedBy = user.split("#")
    let allSellerProducts = await productSvc.getAllSellerProducts(productAddedBy[1]);
    if (allSellerProducts) {
      res.status(constants.SUCCESS).json(allSellerProducts);
    }
  } catch (err) {
    errorLog(req, err, res);
  }
});

router.post("/deleteProduct", fetchUserData, async (req, res) => {
  try {
    if (req.SK == `User#${req.body.productAddedBy}`) {
      let inputData = req.body;
      let inputObj = await productSvc.deleteProduct(inputData);
      if (inputObj) {
        res.status(constants.SUCCESS).json({ "Message": "You have deleted Product Successfully" });
      }
    } else {
      return res.status(constants.AUTHORIZATION_REQUIRED).json({ error: 'Authorization required' });
    }
  } catch (err) {
    errorLog(req, err, res);
  }
});

router.delete('/imageDelete/:filename', (req, res) => {
  const { filename } = req.params;
  const imagePath = path.join(uploadsDirectory, filename);

  if (fs.existsSync(imagePath)) {
    fs.unlink(imagePath, (err) => {
      if (err) {
        console.error('Error deleting file:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }
      res.json({ message: 'Image deleted successfully' });
    });
  } else {
    res.status(404).json({ error: 'Image not found' });
  }
});

router.get("/getAllProducts", fetchUserData, async (req, res) => {
  try {
    if (req.SK) {
      let allProductData = await productSvc.getAllProducts();
      if (allProductData) {
        res.status(constants.SUCCESS).json(allProductData);
      }
    } else {
      return res.status(constants.AUTHORIZATION_REQUIRED).json({ error: 'Authorization required' });
    }
  } catch (err) {
    errorLog(req, err, res);
  }
});

router.get("/getAllProductsNoUser", async (req, res) => {
  try {
    let allProductData = await productSvc.getAllProductsNoUser();
    if (allProductData) {
      res.status(constants.SUCCESS).json(allProductData);
    }
  } catch (err) {
    errorLog(req, err, res);
  }
});

module.exports = router;