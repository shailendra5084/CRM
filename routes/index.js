const router = require('express').Router()
const controller = require('../controller/index')
const checkRole = require("../middleware/checkRole")


router.get('/health', controller.healthCare)
router.post('/register', controller.registerUser)
router.post('/login', checkRole('user'), controller.login)
router.post('/login/admin', checkRole('admin'), controller.login)
router.post('/message/:id', controller.sendMessage)
router.delete('/:id/drop', controller.dropUser)

module.exports = router; 