const { ddbClient } = require("./ddbClient");
const {
  PutItemCommand,  
  QueryCommand,
  DeleteItemCommand,
  UpdateItemCommand
} = require("@aws-sdk/client-dynamodb");
const { marshall, unmarshall } = require("@aws-sdk/util-dynamodb");
const { v4: uuidv4 } = require('uuid');

class NoteMasterHelper {
    constructor() {
      this.TableName = "Notes_DTA"
    };

    async addNote(PK, noteObj) {
        noteObj.PK = PK;
        noteObj.SK = noteObj.SK ? noteObj.SK : uuidv4();
        let params = {
          TableName: this.TableName,
          Item: marshall(noteObj),
        };
        return ddbClient.send(new PutItemCommand(params));
      };

      async getUserNotes(PK) {
        let params = {
          TableName: this.TableName,
          KeyConditionExpression: "#pk = :primarykey",
          ExpressionAttributeValues: {
            ":primarykey": { S: PK },
          },
          ExpressionAttributeNames: { "#pk": "PK" },
        };
        let userNotes = [];
        let result = await ddbClient.send(new QueryCommand(params));
        result.Items.forEach((item) => userNotes.push(unmarshall(item)));
        return userNotes;
      };

      async deleteNote(PK, noteObj){
        let params = {
          TableName: this.TableName,
          Key: {
            PK: { S: PK },
            SK: { S: noteObj.SK },
          },
        };
        return await ddbClient.send(new DeleteItemCommand(params));
        };

};

module.exports = { NoteMasterHelper };