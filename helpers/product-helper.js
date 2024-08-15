const { ddbClient } = require("./ddbClient");
const {
  PutItemCommand,
  QueryCommand,
  DeleteItemCommand,
  UpdateItemCommand
} = require("@aws-sdk/client-dynamodb");
const { marshall, unmarshall } = require("@aws-sdk/util-dynamodb");
const { v4: uuidv4 } = require('uuid');

class ProductMasterHelper {
  constructor() {
    this.TableName = "Product_DTA";
    this.PK = "ProductMaster";
  };

  async addProduct(productObj) {
    productObj.PK = this.PK;
    productObj.SK = uuidv4();
    let params = {
      TableName: this.TableName,
      Item: marshall(productObj),
    };
    return await ddbClient.send(new PutItemCommand(params));
  };

  async getAllSellerProducts(productAddedBy) {
    let params = {
      TableName: this.TableName,
      KeyConditionExpression: "#pk = :primarykey",
      FilterExpression: "#pab = :productAddedBy",
      ExpressionAttributeValues: {
        ":primarykey": { S: this.PK },
        ":productAddedBy": { S: productAddedBy },
      },
      ExpressionAttributeNames: { "#pk": "PK", "#pab": "productAddedBy" },
    };
    let eachUser = [];
    let result = await ddbClient.send(new QueryCommand(params));
    result.Items.forEach((item) => eachUser.push(unmarshall(item)));
    return eachUser;
  };

  async deleteProduct(productObj) {
    let params = {
      TableName: this.TableName,
      Key: {
        PK: { S: this.PK },
        SK: { S: productObj.SK },
      },
    };
    return await ddbClient.send(new DeleteItemCommand(params));
  };

  async getAllProducts() {
    let params = {
      TableName: this.TableName,
      KeyConditionExpression: "#pk = :primarykey",
      ExpressionAttributeValues: {
        ":primarykey": { S: this.PK },
      },
      ExpressionAttributeNames: { "#pk": "PK" },
    };
    let eachProduct = [];
    let result = await ddbClient.send(new QueryCommand(params));
    result.Items.forEach((item) => eachProduct.push(unmarshall(item)));
    return eachProduct;
  };

  async getAllProductsNoUser() {
    let params = {
      TableName: this.TableName,
      KeyConditionExpression: "#pk = :primarykey",
      ExpressionAttributeValues: {
        ":primarykey": { S: this.PK },
      },
      ExpressionAttributeNames: { "#pk": "PK" },
    };
    let eachProduct = [];
    let result = await ddbClient.send(new QueryCommand(params));
    result.Items.forEach((item) => eachProduct.push(unmarshall(item)));
    return eachProduct;
  };

};

module.exports = { ProductMasterHelper };