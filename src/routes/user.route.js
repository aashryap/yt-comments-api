import Route from './route'
import { UserController } from '../controller'
import constants from '../constants'

class UserRoute extends Route {
  constructor (app, router) {
    super()
    this.app = app
    this.userController = new UserController()
    this.router = router
    this.routeConfig = [
      { name: '/users', method: 'post', scope: constants.SCOPES.NOSCOPE, controller: (req, cb) => this.userController.addUser(req, cb), auth: false },
      { name: '/userLogin', method: 'post', scope: constants.SCOPES.NOSCOPE, controller: (req, cb) => this.userController.login(req, cb), auth: false },
      { name: '/users', method: 'get', scope: constants.SCOPES.ADMINS, controller: (req, cb) => this.userController.getUsers(req, cb), auth: true }
    ]
  }

  create (app, router) {
    return this.createRoute(this.routeConfig, app, router)
  }
}

export default UserRoute
