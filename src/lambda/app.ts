import express from "express"
import cors from "cors"
import bodyParser from 'body-parser';
import { getUser } from "../functions/getUser";

export const app = express()
const router = express.Router();

app.use(cors())
app.use(express.json())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

router.get('/user', (req, res) => {
    try {

        if (!req.query.id || !req.query.name) {
            res.status(400).json({
                error: "Cliend Error"
            });
        }

        const id = req.query.id as string
        const name = req.query.name as string

        getUser(id, name)
            .then(result => {
                res.status(200).send({
                    message: result
                })
            })
            .catch(err => {
                console.log(err)
            })
    } catch (e) {
        console.log(e)
        res.status(500).json({
            error: "Internal Server Error: ", e,
        });
    }
});

router.use((_req, res, _next) => {
    return res.status(404).json({
        error: "Not Found",
    });
});

app.use('/', router);
