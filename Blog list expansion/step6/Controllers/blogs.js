const blogsRouter = require('express').Router()
const Blog = require('../Models/blogs')
const User = require('../Models/user')
const { tokenValidator } = require('../Utils/middleware')

blogsRouter.get('/', async (request, response, next) => {
  try {
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
    response.json(blogs)
  } catch (error) {
    next(error)
  }
})

blogsRouter.post('/', tokenValidator, async (request, response, next) => {
  try {
    const body = request.body

    const user = await User.findById(
      request.userId
    )

    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes || 0,
      user: user._id,
    })

    const savedBlog = await blog.save()

    user.blogs = user.blogs.concat(
      savedBlog._id
    )

    await user.save()

    const populatedBlog = await Blog
      .findById(savedBlog._id)
      .populate('user', {
        username: 1,
        name: 1,
      })

    response.status(201).json(populatedBlog)

  } catch (error) {
    next(error)
  }
})

blogsRouter.delete('/:id', tokenValidator, async (request, response, next) => {
  try {
    const blog = await Blog.findById(request.params.id)

    if (!blog) {
      return response.status(404).json({ error: 'blog not found' })
    }

    if (blog.user.toString() !== request.userId.toString()) {
      return response.status(403).json({ error: 'unauthorized - can only delete own blogs' })
    }

    await Blog.findByIdAndDelete(request.params.id)

    const user = await User.findById(request.userId)
    user.blogs = user.blogs.filter(blogId => blogId.toString() !== request.params.id)
    await user.save()

    response.status(204).end()
  } catch (error) {
    next(error)
  }
})

blogsRouter.put('/:id', async (request, response, next) => {
  try {
    const updatedBlog = await Blog.findByIdAndUpdate(
      request.params.id,
      request.body,
      {
        returnDocument: 'after',
        runValidators: true,
        context: 'query',
      }
    )

    if (!updatedBlog) {
      return response.status(404).json({ error: 'blog not found' })
    }

    response.json(updatedBlog)
  } catch (error) {
    next(error)
  }
})

module.exports = blogsRouter
