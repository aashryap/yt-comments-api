/* eslint-disable standard/no-callback-literal */
import models from '../db/models'

class CompanyController {
  addCompany (req, cb) {
    const companyObj = {
      companyName: req.body.companyName,
      adminId: req.body.adminId,
      contractStartDate: req.body.contractStartDate,
      totalCostOfCompany: req.body.totalCostOfCompany
    }
    models.company.create(companyObj).then(data => {
      cb(200, data, 'Company Created')
    })
      .catch(err => {
        cb(500, err)
      })
  }

  getCompany (req, cb) {
    models.company.find()
      .then((companyData) => {
        cb(200, companyData)
      })
      .catch((err) => {
        cb(500, err)
      })
  }
}

export default CompanyController
