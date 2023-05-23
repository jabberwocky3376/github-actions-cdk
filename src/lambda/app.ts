import express from "express"
import cors from "cors"
import bodyParser from 'body-parser';
import { UserService } from "../services/userService";
import { CustomException } from "../exceptions/customException"

export const app = express()
const router = express.Router();

app.use(cors())
app.use(express.json())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

router.get('/user', (req, res) => {
    try {
        if (!req.query.id || !req.query.name) {
            res.status(400).json({ error: "Client Error" });
        }

        const userService: UserService = new UserService()

        userService.getUser(req.query.id as string, req.query.name as string)
            .then(result => {
                res.status(200).json({ message: result })
            })
            .catch(e => {
                if (e instanceof CustomException) {
                    throw e;
                } else {
                    throw Error("Unexpected Error");
                }
            })
    } catch (e) {
        if (e instanceof CustomException) {
            res.status(e.status).json({ msg: e.message })
        } else {
            res.status(500).json({ msg: "Unexpected Error" })
        }
    }
});

router.put('/user', (req, res) => {
    try {
        if (!req.body || !req.body.id || !req.body.name || !req.body.type) {
            res.status(400).json({
                error: "Client Error"
            });
        }

        const userService: UserService = new UserService()

        userService.setUser(req.body.id, req.body.name, req.body.type)
            .then(_result => { res.status(204).json({}) })
            .catch(e => {
                if (e instanceof CustomException) {
                    throw e;
                } else {
                    throw Error("Unexpected Error");
                }
            })
    } catch (e) {
        if (e instanceof CustomException) {
            res.status(e.status).json({ msg: e.message })
        } else {
            res.status(500).json({ msg: "Unexpected Error" })
        }
    }
});

router.get('/users', (req, res) => {
    try {
        if (!req.query.id) {
            res.status(400).json({ error: "Client Error" });
        }

        const userService: UserService = new UserService()

        userService.getUsers(req.query.id as string)
            .then(result => {
                res.status(200).json({ message: result })
            })
            .catch(e => {
                if (e instanceof CustomException) {
                    throw e;
                } else {
                    throw Error("Unexpected Error");
                }
            })
    } catch (e) {
        if (e instanceof CustomException) {
            res.status(e.status).json({ msg: e.message })
        } else {
            res.status(500).json({ msg: "Unexpected Error" })
        }
    }
});

router.use((_req, res, _next) => {
    res.status(404).json({
        error: "Not Found",
    });
});

// const asyncWrapper = fn => {
//     return (req, res, next) => {
//         return fn(req, res, next).catch(next);
//     }
// };

app.use('/', router);
