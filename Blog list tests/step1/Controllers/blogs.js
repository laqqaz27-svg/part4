const blogsRouter = require('express').Router()
const Blog = require('../Models/blogs')

blogsRouter.get('/', async (request, response, next) => {
  try {
    const blogs = await Blog.find({})
    response.json(blogs)
  } catch (error) {
    next(error)
  }
})

module.exports = blogsRouter
