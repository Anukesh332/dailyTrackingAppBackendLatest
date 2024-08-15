const { ddbClient } = require("./ddbClient");
const {
  PutItemCommand,
  QueryCommand,
  DeleteItemCommand,
  UpdateItemCommand
} = require("@aws-sdk/client-dynamodb");
const { marshall, unmarshall } = require("@aws-sdk/util-dynamodb");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'Anukeshisthebe$tcoder';

class UserMasterHelper {
  constructor() {
    this.PK = "UserMaster";
    this.SK = "User#";
    this.TableName = "Users_DTA"
  };

  async addUser(userObj) {
    userObj.PK = this.PK;
    userObj.SK = this.SK + userObj.user_email;
    const salt = await bcrypt.genSalt(10);
    const securedPassword = await bcrypt.hash(userObj.user_password, salt);
    userObj.user_password = securedPassword;
    let params = {
      TableName: this.TableName,
      Item: marshall(userObj),
    };
    let params2 = {
      TableName: this.TableName,
      KeyConditionExpression: "#pk = :primarykey and #sk = :secondarykey",
      ExpressionAttributeValues: {
        ":primarykey": { S: this.PK },
        ":secondarykey": { S: this.SK + userObj.user_email }
      },
      ExpressionAttributeNames: { "#pk": "PK", "#sk": "SK" },
    };
    let singleUser = [];
    let getAllUsers = await ddbClient.send(new QueryCommand(params2));
    getAllUsers.Items.forEach((item) => singleUser.push(unmarshall(item)));
    if (singleUser.length !== 0) {
      return ;
    } else {
      return ddbClient.send(new PutItemCommand(params));
    }
  };

  async authenticateUser(userObj) {
    let params = {
      TableName: this.TableName,
      KeyConditionExpression: "#pk = :primarykey and #sk = :secondarykey",
      ExpressionAttributeValues: {
        ":primarykey": { S: this.PK },
        ":secondarykey": { S: this.SK + userObj.user_email }
      },
      ExpressionAttributeNames: { "#pk": "PK", "#sk": "SK" },
    };
    let singleUser = [];
    let getAllUsers = await ddbClient.send(new QueryCommand(params));
    getAllUsers.Items.forEach((item) => singleUser.push(unmarshall(item)));
    if (singleUser.length == 0) {
      // res.status(401).json({ "Message":  "Please enter correct Email" }); 
      return;
    } else {
      const passwordMatch = await bcrypt.compare(userObj.user_password, singleUser[0].user_password);
      if (passwordMatch) {
        const authtoken = jwt.sign(singleUser[0], JWT_SECRET);
        return authtoken;
      } else {
        // return "Please enter correct Password";
        return;
      }
    }
  };

  async fetchUser(userObj) {
    let params = {
      TableName: this.TableName,
      KeyConditionExpression: "#pk = :primarykey and #sk = :secondarykey",
      ExpressionAttributeValues: {
        ":primarykey": { S: this.PK },
        ":secondarykey": { S: userObj }
      },
      ExpressionAttributeNames: { "#pk": "PK", "#sk": "SK" },
    };
    let fetchedUser = [];
    let getAllUsers = await ddbClient.send(new QueryCommand(params));
    getAllUsers.Items.forEach((item) => fetchedUser.push(unmarshall(item)));
    delete fetchedUser[0].user_password;
    if (!fetchedUser) {
      return "Please provide right auth-token";
    } else {
      return fetchedUser;
    }
  };

  async getAllUsers() {
    let params = {
      TableName: this.TableName,
      KeyConditionExpression: "#pk = :primarykey",
      ExpressionAttributeValues: {
        ":primarykey": { S: this.PK },
      },
      ExpressionAttributeNames: { "#pk": "PK" },
    };
    let eachUser = [];
    let result = await ddbClient.send(new QueryCommand(params));
    result.Items.forEach((item) => eachUser.push(unmarshall(item)));
    return eachUser;
  };

  deleteUser(userObj) {
    let params = {
      TableName: this.TableName,
      Key: {
        PK: { S: this.PK },
        SK: { S: this.SK + userObj.user_email },
      },
    };
    return ddbClient.send(new DeleteItemCommand(params));
  };

};

module.exports = { UserMasterHelper };