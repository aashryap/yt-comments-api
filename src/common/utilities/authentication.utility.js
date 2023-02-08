import jwt from 'jsonwebtoken'
import consts from '../../constants'

class AuthenticationUtility {
  verifyAccessToken (token) {
    try {
      return jwt.verify(token, 'XYZ')
    } catch (e) {
      console.log('err : ', e)
      return null
    }
  }

  generateAccessToken (userData) {
    return jwt.sign({
      exp: Math.floor(Date.now() / 1000) + (60 * 60),
      data: userData
    }, 'XYZ')
  }

  verifyScope (scope, userData) {
    console.log(scope)
    if (scope.length > 0 || scope.indexOf(userData.scope) > -1) {
      return true
    } else {
      return false
    }
  }
}

export default new AuthenticationUtility()
