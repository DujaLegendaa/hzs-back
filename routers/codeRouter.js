const express = require('express')
const codeController = require('./../controllers/codeController')
const authController = require('./../controllers/authController')
const router = express.Router()

router.post('/generateOne', authController.protect, authController.restrictToRole('organizator'), codeController.generateOne)
router.post('/:id/consume', authController.protect, codeController.consume)
router.get('/:id/forUser', authController.protect, codeController.forUser)

module.exports = router