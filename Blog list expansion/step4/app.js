const express = require('express')
const cors = require('cors')
const middleware = require('./Utils/middleware')
const blogsRouter = require('./Controllers/blogs')
const usersRouter = require('./Controllers/users')

require('dotenv').config()
require('./Utils/database')

const app = express()

app.use(cors())
app.use(express.json())
app.use(middleware.requestLogger)

app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
