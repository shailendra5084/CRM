const { validate } = require('../models/user.schema')
const { createJoiError, createError, getUsersDevice, postNotification, generateToken} = require("../utils/index")
const bcrypt = require('bcrypt');
const { db } = require('../index')
const collection = db.collection('users')
const ObjectId = require('mongodb').ObjectId

module.exports.healthCare = (req, res, next) => {
    try {
        res.status(200).send({ message: "Hello World!" })
    } catch (err) {
        next(err)
    }
}

module.exports.registerUser = async (req, res, next) => {
    try {
        let user = req.body;
        const validation = validate(user, 'create');
        if (validation.error) {
            throw createJoiError(validation.error)
        }
        user = validation.value
        user.hashedPassword = bcrypt.hashSync(user.password, 10);
        delete user.password;

        const createRes = await collection.insertOne(user)
        const { insertedId } = createRes
        res.status(201).json(user)
    } catch (err) {
        next(err)
    }
}

module.exports.login = async (req, res, next) => {
    try {
      const { email, password } = req.body;
     
      const fetchedUser = req.user
      const result = await bcrypt.compare(password, fetchedUser.hashedPassword)
      if(!result) {
        const err = new Error('Authentication failed')
        err.statusCode = 401; throw err
      }
      const tokenObj = generateToken(fetchedUser);
      if(!tokenObj) {
        const err = new Error('User does not exist')
        err.statusCode = 401; throw err;
      }
      res.status(200).json(tokenObj);
    } catch (err) {
      next(err);
    }
  }

exports.sendMessage = async (req, res, next) => {
    try {

        const id = req.params.id
        return res.send({ message: "Hi" })
    } catch (e) {
        next(e)
    }
}

exports.dropUser = async (req, res, next) => {
    try {

        const userId = req.params.id
        const dbRes = await  collection.findOne({ _id: ObjectId(userId) })
        console.log(dbRes)
        // TODO : Send Email to User For Terminate
        if(dbRes.role !== "admin") return res.status(406).send({message: "You have not permission to delete user"})
        await collection.deleteOne({ _id: ObjectId(userId) })
        return res.send({ message: "Successfully Terminated User By Admin" })
    } catch (e) {
        next(e)
    }
}

exports.sendNotification = async (req, res, next) => {
    try {

        const notification = req.body
        // TODO: Send Notification to Users
        let payloadForPush = {}

        notification.users = notification.users.map(el => new ObjectId(el))
        const response = await getUsersDevice(notification.users)
        let device_ids = response.filter( device => device.deviceToken).map(item => item.deviceToken)

        if(device_ids.length == 0) {
            throw createError('No device found', 406)
        }

        payloadForPush.data = { 
            // path: deeplink
            title: notification.title,
            body: notification.body
        }   

        for await (let id of device_ids) {
            payloadForPush.to = id;
            const fcm = await postNotification(payloadForPush)
        }

        return res.send({ notification: "Notification send successfully" })
    } catch (e) {
        next(e)
    }
}
