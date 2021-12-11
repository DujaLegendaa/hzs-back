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

module.exports = router