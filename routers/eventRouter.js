const express = require('express')
const eventController = require('./../controllers/eventController')
const authController = require('./../controllers/authController')

const router = express.Router()

router
  .route('/')
  .get(eventController.getAllEvents)
  .post(authController.protect ,authController.restrictToRole('organizator'), eventController.setCreator, eventController.createEvent)

router
  .route('/:id')
  .get(eventController.getEvent)
  .patch(authController.protect, eventController.updateEvent)
  .delete(authController.protect, eventController.deleteEvent)

router.get('/:id/isCreator', authController.protect, eventController.isCreator)
router.post('/:id/join', authController.protect, eventController.join)
router.post('/:id/leave', authController.protect, eventController.leave)

module.exports = router