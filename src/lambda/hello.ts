import serverlessExpress from "@vendia/serverless-express"
import express from "express"
import cors from "cors"
import { message } from "../model/message";

const app = express()
app.use(cors())
app.use(express.json())

app.get("hello", (event, res) => {
  res.status(200).send({
    message: "" + message(event.path)
  })
})

app.get('/bye', (_, res) => {
  res.status(200).send({
    message: 'byebye',
  })
})

exports.handler = serverlessExpress({ app })