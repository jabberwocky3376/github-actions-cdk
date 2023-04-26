import serverlessExpress from "@vendia/serverless-express"
import express from "express"
import cors from "cors"
import { message } from "../model/message";
import { getItem } from "../functions/getUsersFunction";

const app = express()
app.use(cors())
app.use(express.json())


/**
 * GET: /users ユーザー一覧取得
 */
app.get("/users", (_, res) => {
  res.status(200).send({
    message: getItem()
  })
})

app.get('/message', (req, res) => {
  res.status(200).send({
    message: "" + message(req.path)
  })
})

exports.handler = serverlessExpress({ app })