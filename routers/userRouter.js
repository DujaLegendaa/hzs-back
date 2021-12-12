const express = require('express')
const userController = require('./../controllers/userController')
const authController = require('./../controllers/authController')
const router = express.Router()

router.route('/getCompanies').get(userController.getCompanies)

router.post('/signup', authController.signup)

router.post('/login', authController.login)

router.route('/:id').get(userController.getUser)

module.exports = router