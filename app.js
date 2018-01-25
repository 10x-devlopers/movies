//@ts-check
require('dotenv').config()
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const compression = require('compression')
const cors = require('cors')
const csurf = require('csurf')
const express = require('express')
const helmet = require('helmet')
const logger = require('morgan')

const errorMiddleware = require('./server/middlewares/errors')
const routes = require('./server/routes/v1')

const dev = process.env.NODE_ENV !== 'production'

const app = express()

// Remove annoying Express header addition.
app.disable('x-powered-by')

// request logging. dev: console
app.use(logger('dev'))

// Parse the body of POST requests
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// Add file compression for Google search performance
app.use(compression())

// secure apps by setting various HTTP headers
app.use(helmet())

// enable CORS - Cross Origin Resource Sharing
app.use(cors())

// Parse any incoming cookies (required for CSRF protection middleware)
app.use(cookieParser())

// Add CSRF Protection for our cookies
app.use(csurf({ cookie: true }))

// mount api v1 routes
app.use('/api/v1', routes)

// Catch any errors and send 500;
app.use(errorMiddleware(dev))

module.exports = app
