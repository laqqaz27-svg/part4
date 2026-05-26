const mongoose = require('mongoose')
const config = require('./config')
const logger = require('./logger')

const connectToDatabase = async () => {
  try {
    await mongoose.connect(config.MONGODB_URI, { family: 4 })
    logger.info('Connected to MongoDB')
  } catch (error) {
    logger.error('Error connecting to MongoDB:', error.message)
  }
}

connectToDatabase()

module.exports = mongoose
