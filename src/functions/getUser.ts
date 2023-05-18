import { User } from '../databases/database';
import { CustomException } from "../exceptions/customException"

export async function getUser(id: string, name: string) {

    try {

        const response = await new User().get(id, name)

        if (response === undefined) {
            return undefined
        }

        return response
    } catch (e) {
        if (e instanceof CustomException) {
            throw e;
        } else {
            throw Error("Unexpected Error");
        }
    }
}