const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const globalErrorHandler = require('./controllers/errorController.js')
const userRouter = require('./routers/userRouter.js')
const eventRouter = require('./routers/eventRouter')

const app = express()

app.use(cors())

if (process.env.NODE_ENV == 'development') app.use(morgan('dev'))
app.use(express.json())

app.use('/api/v1/users', userRouter)
app.use('/api/v1/events', eventRouter)

app.use(globalErrorHandler)

module.exports = app