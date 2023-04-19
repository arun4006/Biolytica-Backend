const { sendResponse } = require('../helper/utility')
const {
    successCode,
    internalServerError,
  } = require("../constant");

module.exports.handler = async (event) => {
    return sendResponse(successCode, { message: `Email has been authorized` })
}