import { CreateTableCommand, DynamoDBClient } from '@aws-sdk/client-dynamodb'

const dbClient = new DynamoDBClient({
    endpoint: 'http://localhost:8000',
})

// テーブルを作成する
async function createTable() {
    try {
        const command = new CreateTableCommand({
            TableName: 'Users', // テーブル名
            KeySchema: [
                { AttributeName: 'id', KeyType: 'HASH' }, // パーティションキー
                { AttributeName: 'name', KeyType: 'RANGE' }, // ソートキー
            ],
            AttributeDefinitions: [
                { AttributeName: 'id', AttributeType: 'S' }, // 文字列属性
                { AttributeName: 'name', AttributeType: 'S' }, // 文字列属性
            ],
            ProvisionedThroughput: {
                ReadCapacityUnits: 1,
                WriteCapacityUnits: 1,
            },
            StreamSpecification: {
                StreamEnabled: false,
            },
        })
        const output = await dbClient.send(command)
        console.log('SUCCESS: Table created:', output)
    } catch (err) {
        console.error('ERROR:', err)
    }
}

createTable()