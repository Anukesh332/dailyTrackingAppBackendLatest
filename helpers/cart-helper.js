const { ddbClient } = require("./ddbClient");
const {
    PutItemCommand,
    QueryCommand,
    DeleteItemCommand,
    UpdateItemCommand
} = require("@aws-sdk/client-dynamodb");
const { marshall, unmarshall } = require("@aws-sdk/util-dynamodb");
const constants = require("../constants");

class CartMasterHelper {
    constructor() {
        this.TableName = "Cart_DTA";
        this.PK = "CartMaster#";
    };

    async addToCart(cartObj) {
        cartObj.PK = this.PK + cartObj.cartAddedBy;
        cartObj.SK = cartObj.setSk;
        let params = {
            TableName: this.TableName,
            Item: marshall(cartObj),
        };
        let params2 = {
            TableName: this.TableName,
            KeyConditionExpression: "#pk = :primarykey and #sk = :secondarykey",
            ExpressionAttributeValues: {
                ":primarykey": { S: this.PK + cartObj.cartAddedBy },
                ":secondarykey": { S: cartObj.setSk }
            },
            ExpressionAttributeNames: { "#pk": "PK", "#sk": "SK" },
        };
        let singleCartItem = [];
        let getAllCartItems = await ddbClient.send(new QueryCommand(params2));
        getAllCartItems.Items.forEach((item) => singleCartItem.push(unmarshall(item)));
        if (singleCartItem.length !== 0) {
            return;
        } else {
            return ddbClient.send(new PutItemCommand(params));
        }
    };

    async getAllCartProducts(cartAddedBy) {
        let params = {
            TableName: this.TableName,
            KeyConditionExpression: "#pk = :primarykey",
            FilterExpression: "#cab = :cartAddedBy",
            ExpressionAttributeValues: {
                ":primarykey": { S: this.PK + cartAddedBy },
                ":cartAddedBy": { S: cartAddedBy },
            },
            ExpressionAttributeNames: { "#pk": "PK", "#cab": "cartAddedBy" },
        };
        let eachProduct = [];
        let result = await ddbClient.send(new QueryCommand(params));
        result.Items.forEach((item) => eachProduct.push(unmarshall(item)));
        return eachProduct;
    };

    async deleteCartData(cartObj) {
        let params = {
            TableName: this.TableName,
            Key: {
                PK: { S: this.PK + cartObj.cartAddedBy },
                SK: { S: cartObj.setSk },
            },
        };
        return await ddbClient.send(new DeleteItemCommand(params));
    };

};

module.exports = { CartMasterHelper };