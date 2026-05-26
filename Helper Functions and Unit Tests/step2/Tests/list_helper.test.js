const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  assert.strictEqual(result, 1)
})

describe('total likes', () => {
  const listWithOneBlog = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright-violation.html',
      likes: 5
    }
  ]

  const Blogs = [
    {
      title: 'first blog',
      author: 'Laqqaz Gatluak',
      url: 'http://example.com',
      likes: 2
    },
    {
      title: 'second blog',
      author: 'Jane Smith',
      url: 'http://example.com',
      likes: 4
    },
    {
      title: 'third blog',
      author: 'Bob Johnson',
      url: 'http://example.com',
      likes: 6
    }
  ]

  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog)
    assert.strictEqual(result, 5)
  })

  test('of a bigger list is calculated right', () => {
    const result = listHelper.totalLikes(Blogs)
    assert.strictEqual(result, 12)
  })

  test('of empty list is zero', () => {
    const result = listHelper.totalLikes([])
    assert.strictEqual(result, 0)
  })
})