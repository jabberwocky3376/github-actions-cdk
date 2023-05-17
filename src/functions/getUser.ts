import { DynamoDBClient, GetItemCommand, DynamoDBClientConfig } from '@aws-sdk/client-dynamodb'

export async function getUser(id: string, name: string) {
    const config: DynamoDBClientConfig = process.env.NODE_ENV === "local" ? {
        endpoint: 'http://localhost:8000'
    } : {}

    const dynamoDBClient = new DynamoDBClient(config)

    try {
        const command = new GetItemCommand({
            TableName: process.env.USER_TABLE_NAME,
            Key: {
                id: { S: id },
                name: { S: name },
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