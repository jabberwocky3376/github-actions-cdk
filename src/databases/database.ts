import { DynamoDBClient, DynamoDBClientConfig } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, GetCommand } from '@aws-sdk/lib-dynamodb'
import { UserModel } from "../models/user"
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

    async getItem(table: string, partitionKeyName: string, partitionKey: string, sortKeyName: string | undefined, sortKey: string | undefined) {

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
            const res = await this.documentClient.send(command)
            return res.Item
        } catch (e) {
            throw new CustomException(500, "DB Error")
        }
    }
}

export class User extends DbModel {

    constructor() {
        super("id", "name", process.env.USER_TABLE_NAME as string)
    }

    async get(id: string, name: string): Promise<UserModel | undefined> {
        const result = await this.getItem(this.table, "id", id, "name", name)

        if (result === undefined || result["id"] === undefined) {
            return undefined
        }

        const userEntity: UserModel = { id: result["id"], name: result["name"], type: result["type"] }
        return userEntity
    }
}