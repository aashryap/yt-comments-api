import express from 'express'
import morgan from 'morgan'
import bodyparser from 'body-parser'
import cors from 'cors'
import db from './db'
import consts from './constants'
import Routes from './routes'

const routes = new Routes()
db.connect()
const app = express()
const router = express.Router()
app.use(bodyparser.json())
app.use(bodyparser.urlencoded({
  extended: true
}))
app.use(morgan('dev'))
app.use(cors({
  optionSuccessStatus: 200
}))
// eslint-disable-next-line no-new
routes.render(app, router)
app.listen(consts.PORT, () => {
  console.log('server running on port 4000')
})
