const fetch = require("node-fetch");
const config = require("../config/index")
const jwt = require('jsonwebtoken')
const push = config.push.key
const url = config.push.url

function createJoiError(joiError, statusCode = 400) {
    const { message } = joiError.details[0]
    const error = new Error(message)
    error.statusCode = statusCode
    return error
}

function createError(message, statusCode = 400) {
    const err = new Error(message);
    err.statusCode = statusCode;
    return err
}

const getUsersDevice = async (user_ids) => {
    return new Promise((resolve, reject) => {
        userCollection.find({ _id: { $in: user_ids } }, { projection: { deviceToken: 1 } }).toArray((err, result) => {
            if(err) {
                reject(err)
            } else {
                resolve(result)
            }
        })
    })
}

const postNotification = async function (payload) {
    var requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json;charset=utf-8', 'Authorization': 'key=' + push },
        body: JSON.stringify(payload)
    };
    const a = await fetch(url, requestOptions)
    if (a.status === 200) {
        return await a.json()
    }
    else {
        throw ({ "http_error": a.status })
    }
}

function generateToken(user) {
    if(!user) {return null}
    const _user = {
      userId: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNo: user.phoneNo,
      email: user.email,
      role: user.role,
      deviceToken: user.deviceToken,
      deviceType: user.deviceType,
      status: user.status === null ? 'pending' : user.status ? 'active' : 'inactive'
    };
    const payload = { userId: user._id, role: user.role }
    const options = {
      // expiresIn: 7d
    };
    return {
      user: _user,
      token: jwt.sign(payload, config.jwt.secretKey, options),
      expires: ''
    };
  }

module.exports = {
    createJoiError,
    createError,
    getUsersDevice,
    postNotification,
    generateToken
}