/* eslint-disable standard/no-callback-literal */
import models from '../db/models'
import { authenticationUtility } from '../common/utilities'

class UserController {
  addUser (req, cb) {
    const userObj = {
      name: req.body.name,
      email: req.body.email,
      scope: req.body.scope,
      password: req.body.password
    }
    models.user.create(userObj).then(data => {
      cb(200, data, 'User created')
    })
      .catch(err => {
        cb(500, err)
      })
  }

  login (req, cb) {
    const email = req.body.email
    const password = req.body.password
    models.user.findOne({
      email,
      password
    }).then((data) => {
      const user = {
        id: data._id,
        name: data.name,
        email: data.email,
        scope: data.scope
      }
      const accessToken = authenticationUtility.generateAccessToken(user)
      user.accessToken = accessToken
      cb(200, user)
    }).catch((err) => {
      console.log(err)
      cb(500, err)
    })
  }

  getUsers (req, cb) {
    models.user.find().lean()
      .then((users) => {
        cb(200, users)
      })
      .catch((err) => {
        console.log(err)
        cb(500, err)
      })
  }
}

export default UserController
