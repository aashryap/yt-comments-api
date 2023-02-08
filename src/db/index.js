import consts from '../constants'
import mongoose from 'mongoose'

class Db {
  connect () {
    mongoose.connect(consts.DB_URI)
  }
}

export default new Db()
