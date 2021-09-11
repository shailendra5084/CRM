const { db } = require('../index')
const collection = db.collection('users')
const { createError } = require("../utils/index")

module.exports = (authorizedRole) => {
    return async (req, res, next) => {
        try {
            const { email, deviceType, deviceToken } = req.body;
            if (!email) {
                throw createError('phoneNo is required')
            }

            let fetchedUser = null
            if (deviceType && deviceToken) {
                const user = await collection.findOneAndUpdate({ phoneNo }, { $set: { deviceType, deviceToken } }, { returnOriginal: false })
                fetchedUser = user.value
            } else {
                fetchedUser = await collection.findOne({ phoneNo })
            }

            if (!fetchedUser) {
                throw createError('phoneNo does not exist', 404)
            } else if (fetchedUser.role != authorizedRole) {
                throw createError('Not authorized', 401)
            } else {
                req.user = fetchedUser
                next()
            }
        } catch (err) { next(err) }
    }

}