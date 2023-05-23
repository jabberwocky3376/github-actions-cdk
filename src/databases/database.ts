import { DynamoDBClient, DynamoDBClientConfig } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, GetCommand, PutCommand, QueryCommand } from '@aws-sdk/lib-dynamodb'
import { CustomException } from "../exceptions/customException"

export class DbModel {
    config: DynamoDBClientConfig
    dynamoDBClient: DynamoDBClient
    documentClient: DynamoDBDocumentClient
    partitionKey: string;
    sortKey: string;
    table: string;

    constructor(partitionKey: string, sortKey: string, table: string) {
        this.config = process.env.NODE_ENV === "local" ? {
            endpoint: 'http://localhost:8000'
        } : {}
        this.dynamoDBClient = new DynamoDBClient(this.config)
        this.documentClient = DynamoDBDocumentClient.from(this.dynamoDBClient)

        this.partitionKey = partitionKey;
        this.sortKey = sortKey;
        this.table = table
    }

    async getItem(table: string, partitionKeyName: string, partitionKey: string, sortKeyName?: string | undefined, sortKey?: string | undefined): Promise<Record<string, any> | undefined> {
        // PK
        const key: { [key: string]: string } = {}
        key[partitionKeyName] = partitionKey

        // SK
        if (sortKeyName != undefined && sortKey != undefined) {
            key[sortKeyName] = sortKey
        }

        const command = new GetCommand({
            TableName: table,
            Key: key
        })

        try {
            const res = (await this.documentClient.send(command)).Item ?? undefined
            return res
        } catch (e) {
            console.error(e)
            throw new CustomException(500, "DB Error")
        }
    }

    async getItems(table: string, partitionKeyName: string, partitionKey: string) {
        const command = new QueryCommand({
            TableName: table,
            ExpressionAttributeNames: { "#PK": partitionKeyName, },
            ExpressionAttributeValues: { ":PK": partitionKey }, //
            KeyConditionExpression: "#PK = :PK" // 条件
        });

        try {
            const res = (await this.documentClient.send(command)).Items ?? [];
            return res;
        } catch (e) {
            console.error(e)
            throw new CustomException(500, "DB Error")
        }
    }

    async putItem(table: string, item: object): Promise<void> {

        const command = new PutCommand({
            TableName: table,
            Item: item
        })
        await this.documentClient.send(command)

        try {
            await this.documentClient.send(command)
        } catch (e) {
            console.error(e)
            throw new CustomException(500, "DB Error")
        }
    }
}