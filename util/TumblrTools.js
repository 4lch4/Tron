const config = require('./config')

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

const tools = new (require('./Tools'))()

module.exports = class TumblrTools {
  getRandomPhoto (url) {
    return new Promise((resolve, reject) => {
      this.pickRandomPost(url).then((post) => {
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
