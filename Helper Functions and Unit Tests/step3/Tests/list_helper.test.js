const { test, describe } = require('node:test')
const assert = require('node:assert')

const listHelper = require('../utils/list_helper')

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)

  assert.deepStrictEqual(result, 1)
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

  const blogs = [
    {
      _id: '1',
      title: 'laqqaz',
      author: 'Gatluak Waat',
      url: 'http://example.com/1',
      likes: 5
    },
    {
      _id: '2',
      title: 'another blog',
      author: 'John',
      url: 'http://example.com/2',
      likes: 5
    },
    {
      _id: '3',
      title: 'third blog',
      author: 'Mary',
      url: 'http://example.com/3',
      likes: 5
    }
  ]

  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog)

    assert.strictEqual(result, 5)
  })

  test('of a bigger list is calculated right', () => {
    const result = listHelper.totalLikes(blogs)

    assert.strictEqual(result, 15)
  })
})
describe('favorite blog', () => {
  const blogs = [
    {
      _id: '1',
      title: 'laqqaz',
      author: 'james',
      url: 'http://example.com/1',
      likes: 5
    },
    {
      _id: '2',
      title: 'another blog',
      author: 'brandon',
      url: 'http://example.com/2',
      likes: 10
    },
    {
      _id: '3',
      title: 'third blog',
      author: 'evan',
      url: 'http://example.com/3',
      likes: 15
    }
  ]

  test('returns the blog with the most likes', () => {
    const result = listHelper.favoriteBlog(blogs)

    assert.deepStrictEqual(result, blogs[2])
  })
})