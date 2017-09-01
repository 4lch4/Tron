const config = require('../util/config.json')

const tumblr = require('tumblr.js')
const client = tumblr.createClient({
  credentials: {
    consumer_key: config.tumblr.consumer_key,
    consumer_secret: config.tumblr.consumer_secret,
    token: config.tumblr.token,
    token_secret: config.tumblr.token_secret
  },
  returnPromises: true
})

const Tools = require('../util/Tools')
const tools = new Tools()

const blogUrl = 'lady-zenora.tumblr.com'

class Yaoi {
  constructor (options) {
    this.options = options || {}
  }

  getYaoiPhoto () {
    return new Promise((resolve, reject) => {
      this.pickRandomPost(blogUrl).then((post) => {
        let random = tools.getRandom(0, post.photos.length)

        resolve(post.photos[random].original_size.url)
      })
    })
  }

  pickRandomPost (url) {
    return new Promise((resolve, reject) => {
      client.blogPosts(url, {
        type: 'photo'
      }).then((data) => {
        let random = tools.getRandom(0, data.posts.length)

        resolve(data.posts[random])
      })
    })
  }
}

module.exports = Yaoi
