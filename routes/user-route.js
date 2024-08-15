const { Router } = require("express");
let router = Router();
const { UserService } = require("../services/user-service");
const { errorLog } = require("../services/error-log-service");
const jwt = require('jsonwebtoken');
const constants = require("../constants");
const fetchUserData = require("../middleware/fetchUserData");

const JWT_SECRET = 'Anukeshisthebe$tcoder';

let userSvc = new UserService();

router.post("/addUser", async (req, res) => {
    try {  
      let inputData = req.body;  
      let userdata = await userSvc.addUser(inputData);
      if (userdata) {
        const authtoken = jwt.sign(req.body, JWT_SECRET);
        res.status(constants.SUCCESS).json({ "Message": !inputData.ModifiedOn ? "User added successfully." : "User updated successfully.", "AuthToken": authtoken });
      } else {
        res.status(constants.BAD_REQUEST).json({ "Message": "User already exists" });
      }
    } catch (err) {
      errorLog(req, err, res);
    }
  });

  router.post("/authenticateUser", async (req, res) => {
    try {  
      let inputData = req.body;  
      let userdata = await userSvc.authenticateUser(inputData);
      if (userdata) {
        res.status(constants.SUCCESS).json({ "Message": userdata });
      } else {
        res.status(constants.BAD_REQUEST).json({ "Message": "Please enter correct credentials" });
      }
    } catch (err) {
      errorLog(req, err, res);
    }
  });

  router.post("/fetchUser", fetchUserData,async (req, res) => {
    try {  
      let SK = req.SK
      let userdata = await userSvc.fetchUser(SK);
      if (userdata) {
        res.status(constants.SUCCESS).json({ "Message": userdata });
      } 
    } catch (err) {
      errorLog(req, err, res);
    }
  });

  router.get("/getAllUsers", async (req, res) => {
    try {
      let allusersdata = await userSvc.getAllUsers();
      if (allusersdata) {
        res.status(constants.SUCCESS).json(allusersdata);
      }
    } catch (err) {
      errorLog(req, err, res);
    }
  });

  router.post("/deleteUser", async (req, res) => {
    try {
      let inputData = req.body; 
      let inputObj = await userSvc.deleteUser(inputData); 
      if (inputObj) {
        res.status(constants.SUCCESS).json({ "Message": "You have deleted User Successfully" });
      }
    } catch (err) {
      errorLog(req, err, res);
    }
  });

  module.exports = router;