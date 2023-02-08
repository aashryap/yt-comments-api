import Route from './route'
import { CompanyController } from '../controller'
import constants from '../constants'

class CompanyRoute extends Route {
  constructor (app, router) {
    super()
    this.app = app
    this.companyController = new CompanyController()
    this.router = router
    this.routeConfig = [
      { name: '/company', method: 'post', scope: constants.SCOPES.ADMINS, controller: (req, cb) => this.companyController.addCompany(req, cb), auth: true },
      { name: '/company', method: 'get', scope: constants.SCOPES.ALL, controller: (req, cb) => this.companyController.getCompany(req, cb), auth: true }
    ]
  }

  create (app, router) {
    return this.createRoute(this.routeConfig, app, router)
  }
}

export default CompanyRoute
