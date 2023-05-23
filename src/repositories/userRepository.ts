import { UserModel } from "../models/user"
import { DbModel } from "../databases/database"

export class UserRepository extends DbModel {

    constructor() {
        super("id", "name", process.env.USER_TABLE_NAME!)
    }

    async get(id: string, name: string): Promise<UserModel | undefined> {
        const result = await this.getItem(this.table, "id", id, "name", name)

        if (result === undefined || result["id"] === undefined) {
            return undefined
        }

        const userEntity: UserModel = { id: result["id"], name: result["name"], type: result["type"] }
        return userEntity
    }

    async getItemsById(id: string): Promise<UserModel[] | undefined> {
        const userList: UserModel[] = []
        const results = await this.getItems(this.table, "id", id)

        if (results === undefined) {
            return undefined
        }

        for (const res of results) {
            userList.push({ id: res["id"], name: res["name"], type: res["type"] })
        }

        return userList
    }

    async set(id: string, name: string, type: string): Promise<void> {
        const userEntity: UserModel = { id: id, name: name, type: type }
        await this.putItem(this.table, userEntity)
    }
}