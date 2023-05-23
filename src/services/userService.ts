import { UserRepository } from '../repositories/userRepository';
import { CustomException } from "../exceptions/customException"

export class UserService {

    async getUser(id: string, name: string) {
        try {
            const response = await new UserRepository().get(id, name)
            return response
        } catch (e) {
            if (e instanceof CustomException) {
                throw e;
            } else {
                throw Error("Unexpected Error");
            }
        }
    }

    async getUsers(id: string) {
        try {
            const response = await new UserRepository().getItemsById(id)
            return response
        } catch (e) {
            if (e instanceof CustomException) {
                throw e;
            } else {
                throw Error("Unexpected Error");
            }
        }
    }

    async setUser(id: string, name: string, type: string): Promise<void> {

        try {
            await new UserRepository().set(id, name, type)
        } catch (e) {
            if (e instanceof CustomException) {
                throw e;
            } else {
                throw Error("Unexpected Error");
            }
        }
    }
}