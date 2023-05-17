import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb'

const dbClient = new DynamoDBClient({
    endpoint: 'http://localhost:8000'
})

// テーブルにアイテムを追加する
async function putItem() {
    try {
        const command = new PutItemCommand({
            TableName: 'Users',
            Item: {
                id: { S: '1' },
                name: { S: 'john' },
                type: { S: 'men' },
            },
        })
        const output = await dbClient.send(command)
        console.log('SUCCESS (put item):', output)
    } catch (err) {
        console.log('ERROR:', err)
    }
}

putItem()