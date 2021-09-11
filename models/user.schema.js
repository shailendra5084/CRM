const joi = require('joi')

const getSchema = (operation) => ({
    firstName: joi.string().required(),
    lastName: joi.string().required(),
    phoneNo: joi.string().min(10).max(10).required(),
    email: joi.string().email({ tlds: { allow: false } }).required(),
    password: joi.string().required(),
    deviceToken: joi.string().allow(null),
    deviceType: joi.string().allow(null),
    role: joi.string().default('user').valid('admin', 'user'),
    status: joi.string().default('active').valid('active', 'inactive'),
    requestDate: joi.date().allow(null)
})

let userSchema = joi.object(getSchema('create'))

module.exports = {
    validate: (obj, type = 'create') => {
        if (type == 'create' || !type) {
            // schema for create
            return userSchema.validate(obj)
        } else if (type == 'update') {
            // schema for update
            userSchema = joi.object(getSchema(type)).fork(Object.keys(getSchema(type)), (s) => s.optional())
            return userSchema.validate(obj)
        }
    },
    userSchema
}