import { authenticationUtility } from '../utilities'

class AutheticationMiddleware {
  authenticate (req, res, next, scope) {
    const accessToken = req.headers.token
    const decodedAccessToken = authenticationUtility.verifyAccessToken(accessToken)
    if (decodedAccessToken) {
      console.log('decoded ', decodedAccessToken)
      req.user = decodedAccessToken.data
      if (authenticationUtility.verifyScope(scope, decodedAccessToken.data)) {
        next()
      } else {
        res.status(401).send({
          msg: 'Scope invalid',
          status: 401
        })
      }
    } else {
      res.status(401).send({
        msg: 'Token invalid',
        status: 401
      })
    }
  }
}

export default new AutheticationMiddleware()
