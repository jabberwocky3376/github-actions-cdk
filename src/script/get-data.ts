import { DynamoDBClient, GetItemCommand } from '@aws-sdk/client-dynamodb'

const dbClient = new DynamoDBClient({
    endpoint: 'http://localhost:8000'
})

// アイテムを取得する
async function getItem() {
    try {
        const command = new GetItemCommand({
            TableName: 'Users',
            Key: {
                id: { S: '1' },
                name: { S: 'john' },
            }
        })
        const output = await dbClient.send(command)
        console.log('SUCCESS (get item):', output)
    } catch (err) {
        console.log('ERROR:', err)
    }
}

getItem();