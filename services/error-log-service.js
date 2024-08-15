const responseJson = require('../response.json')
const constants = require('../constants')

const errorLog = (req, err, res) => {

  if (err.CustomCode) {
    res.status(err.CustomCode).json({ status: false, status_remarks: err.message });
  } else {
    console.log("Request URL err: ", req?.originalUrl)
    console.log("Request Body err: ", req?.body)
    console.log("Error", err);
    res.status(constants.INTERNAL_SERVER_ERROR).json({ status: false, status_remarks: responseJson.ErrorResponse.ServiceError });
  }
};

const errFunc = (errMsg, errCode) => {
  let e = new Error(errMsg);
  e.CustomCode = errCode;
  throw e;
};

  
module.exports = {
  errorLog,
  errFunc
}