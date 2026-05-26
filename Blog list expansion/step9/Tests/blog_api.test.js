const { test, describe, before, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')
const app = require('../app')
const Blog = require('../Models/blogs')
const User = require('../Models/user')

const api = supertest(app)

const initialBlogs = [
  {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
  },
  {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Statement_Considered_Harmful.html',
    likes: 5,
  },
]

let token

beforeEach(async () => {
  await User.deleteMany({})
  await Blog.deleteMany({})

  const passwordHash = await bcrypt.hash('sekret', 10)
  const user = await new User({ username: 'root', name: 'Superuser', passwordHash }).save()

  for (const blog of initialBlogs) {
    const blogObject = new Blog({
      ...blog,
      user: user._id,
    })
    const savedBlog = await blogObject.save()
    user.blogs = user.blogs.concat(savedBlog._id)
  }

  await user.save()

  // Get token for authenticated requests
  const loginResponse = await api
    .post('/api/login')
    .send({ username: 'root', password: 'sekret' })

  token = loginResponse.body.token
})

describe('when there is initially some blogs saved', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, initialBlogs.length)
  })

  test('blogs have id field instead of _id', async () => {
    const response = await api.get('/api/blogs')
    const blog = response.body[0]
    assert(blog.id !== undefined)
    assert(blog._id === undefined)
  })

  test('a valid blog can be added', async () => {
    const newBlog = {
      title: 'async/await testing',
      author: 'Ada Lovelace',
      url: 'https://example.com/async-await-testing',
      likes: 12,
    }

    const response = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    assert(response.body.user)
    assert(response.body.user.username)

    const blogsResponse = await api.get('/api/blogs')
    assert.strictEqual(blogsResponse.body.length, initialBlogs.length + 1)

    const titles = blogsResponse.body.map(blog => blog.title)
    assert(titles.includes('async/await testing'))
  })

  test('blogs include contributor user info', async () => {
    const response = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    assert(response.body.length > 0)
    const blog = response.body[0]

    assert(blog.user)
    assert(blog.user.username)
    assert(blog.user.name)
  })

  test('if likes field is not given, it defaults to 0', async () => {
    const newBlog = {
      title: 'test blog without likes',
      author: 'Test Author',
      url: 'https://example.com/test',
    }

    const response = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.likes, 0)
  })

  test('blog without title is not added and returns 400', async () => {
    const newBlog = {
      author: 'Test Author',
      url: 'https://example.com/test',
      likes: 5,
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(400)

    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, initialBlogs.length)
  })

  test('blog without url is not added and returns 400', async () => {
    const newBlog = {
      title: 'Test Blog',
      author: 'Test Author',
      likes: 5,
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(400)

    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, initialBlogs.length)
  })

  test('a blog can be deleted by id', async () => {
    const blogsAtStart = await api.get('/api/blogs')
    const blogToDelete = blogsAtStart.body[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204)

    const blogsAtEnd = await api.get('/api/blogs')
    assert.strictEqual(blogsAtEnd.body.length, initialBlogs.length - 1)

    const titles = blogsAtEnd.body.map(blog => blog.title)
    assert(!titles.includes(blogToDelete.title))
  })

  test('deleting a non-existent blog returns 404', async () => {
    const nonExistentId = new mongoose.Types.ObjectId().toString()

    await api
      .delete(`/api/blogs/${nonExistentId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(404)
  })

  test('likes of a blog can be updated', async () => {
    const blogsAtStart = await api.get('/api/blogs')
    const blogToUpdate = blogsAtStart.body[0]

    const update = {
      likes: blogToUpdate.likes + 1,
    }

    const response = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(update)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.likes, blogToUpdate.likes + 1)
    assert.strictEqual(response.body.id, blogToUpdate.id)
  })

  test('updating a non-existent blog returns 404', async () => {
    const nonExistentId = new mongoose.Types.ObjectId().toString()

    await api
      .put(`/api/blogs/${nonExistentId}`)
      .send({ likes: 99 })
      .expect(404)
  })
})

describe('token-based authentication', () => {
  test('adding a blog fails without token', async () => {
    const newBlog = {
      title: 'async/await testing',
      author: 'Ada Lovelace',
      url: 'https://example.com/async-await-testing',
      likes: 12,
    }

    const response = await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)

    assert(response.body.error)
    assert(response.body.error.includes('token'))
  })

  test('adding a blog fails with invalid token', async () => {
    const newBlog = {
      title: 'async/await testing',
      author: 'Ada Lovelace',
      url: 'https://example.com/async-await-testing',
      likes: 12,
    }

    const response = await api
      .post('/api/blogs')
      .set('Authorization', 'Bearer invalidtoken')
      .send(newBlog)
      .expect(401)

    assert(response.body.error)
  })

  test('deleting a blog fails without token', async () => {
    const blogsAtStart = await api.get('/api/blogs')
    const blogToDelete = blogsAtStart.body[0]

    const response = await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(401)

    assert(response.body.error)
    assert(response.body.error.includes('token'))
  })

  test('user cannot delete another user\'s blog', async () => {
    // Create a second user
    const newUser = {
      username: 'newuser',
      name: 'New User',
      password: 'password123',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)

    // Get token for new user
    const loginResponse = await api
      .post('/api/login')
      .send({ username: 'newuser', password: 'password123' })

    const newUserToken = loginResponse.body.token

    // Try to delete root user's blog
    const blogsAtStart = await api.get('/api/blogs')
    const blogToDelete = blogsAtStart.body[0]

    const response = await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `Bearer ${newUserToken}`)
      .expect(403)

    assert(response.body.error)
    assert(response.body.error.includes('unauthorized'))

    // Verify blog still exists
    const blogsAtEnd = await api.get('/api/blogs')
    assert.strictEqual(blogsAtEnd.body.length, blogsAtStart.body.length)
  })
})

after(async () => {
  await mongoose.connection.close()
})
