import { User } from '../databases/database';
import { CustomException } from "../exceptions/customException"

export async function setUser(id: string, name: string, type: string): Promise<void> {

    try {

        await new User().set(id, name, type)

    } catch (e) {
        if (e instanceof CustomException) {
            throw e;
        } else {
            throw Error("Unexpected Error");
        }
    }
}