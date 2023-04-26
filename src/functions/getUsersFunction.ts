import {
    DynamoDBClient,
    GetItemCommand
} from '@aws-sdk/client-dynamodb'

const dynamoDBClient = new DynamoDBClient({})

export async function getItem() {
    try {
        const command = new GetItemCommand({
            TableName: process.env.USER_TABLE_NAME,
            Key: {
                id: { S: '1' }
            }
        })

        const result = await dynamoDBClient.send(command)
        console.log('取得結果: ', result)
        return result
    } catch (err) {
        console.log('ERROR:', err)
        return err
    }
}