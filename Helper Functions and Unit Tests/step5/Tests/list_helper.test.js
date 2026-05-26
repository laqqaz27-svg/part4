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

describe('most blogs', () => {
  const blogs = [
    {
      title: 'first',
      author: 'Gatluak Waat',
      likes: 7
    },
    {
      title: 'second',
      author: 'Gatluak Waat',
      likes: 5
    },
    {
      title: 'third',
      author: 'Gatluak Waat',
      likes: 10
    },
    {
      title: 'fourth',
      author: 'Hannah',
      likes: 12
    }
  ]

  test('returns author with most blogs', () => {
    const result = listHelper.mostBlogs(blogs)

    assert.deepStrictEqual(result, {
      author: 'Gatluak Waat',
      blogs: 3
    })
  })
})


describe('most likes', () => {
  const blogs = [
    {
      title: 'first',
      author: 'Edsger W. Dijkstra',
      likes: 5
    },
    {
      title: 'second',
      author: 'Edsger W. Dijkstra',
      likes: 12
    },
    {
      title: 'third',
      author: 'Robert C. Martin',
      likes: 10
    }
  ]

  test('returns author with most likes', () => {
    const result = listHelper.mostLikes(blogs)

    assert.deepStrictEqual(result, {
      author: 'Edsger W. Dijkstra',
      likes: 17
    })
  })
})