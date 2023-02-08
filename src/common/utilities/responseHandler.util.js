class ResponseHandlerUtil {
  errorHandler (status, data, message) {
    switch (status) {
      case 200 :
        return this.formResponseObject(status, data, message || 'Success')
      case 500 :
        return this.formResponseObject(status, data, message || 'Internal server error')
      default:
        return this.formResponseObject(status, data, message || 'Interal server error')
    }
  }

  formResponseObject (status, data, message) {
    return {
      status,
      data,
      message
    }
  }
}

export default ResponseHandlerUtil
