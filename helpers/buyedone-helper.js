const { ddbClient } = require("./ddbClient");
const {
    PutItemCommand,
    QueryCommand,
    DeleteItemCommand,
    UpdateItemCommand
} = require("@aws-sdk/client-dynamodb");
const { marshall, unmarshall } = require("@aws-sdk/util-dynamodb");
const constants = require("../constants");

class BuyedOneMasterHelper {
    constructor() {
        this.TableName = "BuyedProduct_DTA";
        this.PK = "BuyedProductMaster";
    };

    async buyProduct(buyProductObj) {
        buyProductObj.PK = this.PK;
        buyProductObj.SK = buyProductObj.setSk + '#' + buyProductObj.date + '#' + buyProductObj.cartAddedBy;
        let params = {
            TableName: this.TableName,
            Item: marshall(buyProductObj),
        };
        return await ddbClient.send(new PutItemCommand(params));
    };

    async getDeliveryPendingProducts(productAddedBy) {
        let params = {
            TableName: this.TableName,
            KeyConditionExpression: "#pk = :primarykey",
            FilterExpression: "#pab = :productAddedBy and #st = :status",
            ExpressionAttributeValues: {
                ":primarykey": { S: this.PK },
                ":productAddedBy": { S: productAddedBy },
                ":status": { S: "DeliveryPending" },
            },
            ExpressionAttributeNames: { "#pk": "PK", "#pab": "productAddedBy", "#st": "status" },
        };
        let eachProduct = [];
        let result = await ddbClient.send(new QueryCommand(params));
        result.Items.forEach((item) => eachProduct.push(unmarshall(item)));
        return eachProduct;
    };

    async getDeliveredProducts(productAddedBy) {
        let params = {
            TableName: this.TableName,
            KeyConditionExpression: "#pk = :primarykey",
            FilterExpression: "#pab = :productAddedBy and #st = :status",
            ExpressionAttributeValues: {
                ":primarykey": { S: this.PK },
                ":productAddedBy": { S: productAddedBy },
                ":status": { S: "DeliveryDone" },
            },
            ExpressionAttributeNames: { "#pk": "PK", "#pab": "productAddedBy", "#st": "status" },
        };
        let eachProduct = [];
        let result = await ddbClient.send(new QueryCommand(params));
        result.Items.forEach((item) => eachProduct.push(unmarshall(item)));
        return eachProduct;
    };

    async getDeliveredProductsGraph(productAddedBy, inputData) {
        let params = {
            TableName: this.TableName,
            KeyConditionExpression: "#pk = :primarykey",
            FilterExpression: "#pab = :productAddedBy and #st = :status and #dt between :StartDate and :EndDate",
            ExpressionAttributeValues: {
                ":primarykey": { S: this.PK },
                ":productAddedBy": { S: productAddedBy },
                ":status": { S: "DeliveryDone" },
                ":StartDate": { S: inputData.StartDate },
                ":EndDate": { S: inputData.EndDate }
            },
            ExpressionAttributeNames: { "#pk": "PK", "#pab": "productAddedBy", "#st": "status", "#dt": "deliveryDate" },
        };
        let eachProduct = [];
        let result = await ddbClient.send(new QueryCommand(params));
        result.Items.forEach((item) => eachProduct.push(unmarshall(item)));
        return eachProduct;
    };

    async getMyOrder(cartAddedBy) {
        let params = {
            TableName: this.TableName,
            KeyConditionExpression: "#pk = :primarykey",
            FilterExpression: "#cab = :cartAddedBy and #st = :status",
            ExpressionAttributeValues: {
                ":primarykey": { S: this.PK },
                ":cartAddedBy": { S: cartAddedBy },
                ":status": { S: "DeliveryPending" },
            },
            ExpressionAttributeNames: { "#pk": "PK", "#cab": "cartAddedBy", "#st": "status" },
        };
        let eachProduct = [];
        let result = await ddbClient.send(new QueryCommand(params));
        result.Items.forEach((item) => eachProduct.push(unmarshall(item)));
        return eachProduct;
    };

};

module.exports = { BuyedOneMasterHelper };