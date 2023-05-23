import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, QueryCommand, QueryCommandInput } from '@aws-sdk/lib-dynamodb';

const dbClient = new DynamoDBClient({
    endpoint: 'http://localhost:8000'
})
const documentClient = DynamoDBDocumentClient.from(dbClient)

// アイテムを取得する
async function getItems() {
    try {
        const command = new QueryCommand({
            TableName: "Users",
            ExpressionAttributeNames: { "#id": "id" }, // key名
            ExpressionAttributeValues: { ":id": "1" }, // value名
            KeyConditionExpression: "#id = :id", // 条件

        })

        const output = await documentClient.send(command)
        console.log('SUCCESS (get item):', output)
    } catch (err) {
        console.log('ERROR:', err)
    }
}

getItems();
