import UserRoute from './user.route'
import CompanyRoute from './company.route'
import express from 'express'

class Routes {
  constructor () {
    this.userRoute = new UserRoute()
    this.companyRoute = new CompanyRoute()
  }

  render (app, router) {
    this.userRoute.create(app, router)
    this.companyRoute.create(app, router)
    app.use(express.static('media'))
    app.use(router)
  }
}

export default Routes
