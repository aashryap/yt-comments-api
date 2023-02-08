import authenticationMiddleware from '../common/midldlewares/authenticationMiddleware'

class Route {
  createRoute (routes, app, router) {
    for (let i = 0; i < routes.length; i++) {
      switch (routes[i].method) {
        case 'get':
          router.route(routes[i].name).get(
            (req, res, next) => this.checkAuth(req, res, next, routes[i].auth, routes[i].scope), function (req, res) {
              routes[i].controller(req, (status, data) => {
                res.status(status).send(data)
              })
            })
          break
        case 'post':
          router.route(routes[i].name).post(
            (req, res, next) => this.checkAuth(req, res, next, routes[i].auth, routes[i].scope),
            function (req, res) {
              routes[i].controller(req, (status, data) => {
                res.status(status).send(data)
              })
            })
          break
        case 'put':
          router.route(routes[i].name).put(
            (req, res, next) => this.checkAuth(req, res, next, routes[i].auth, routes[i].scope),
            function (req, res) {
              routes[i].controller(req, (status, data) => {
                res.status(status).send(data)
              })
            })
          break
        case 'delete':
          router.route(routes[i].name).delete(
            (req, res, next) => this.checkAuth(req, res, next, routes[i].auth, routes[i].scope),
            function (req, res) {
              routes[i].controller(req, (status, data) => {
                res.status(status).send(data)
              })
            })
          break
      }
    }
  }

  checkAuth (req, res, next, isAuth, scope) {
    if (isAuth) {
      authenticationMiddleware.authenticate(req, res, next, scope)
    } else {
      next()
    }
  }
}

export default Route
