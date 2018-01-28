const reddit = require('redwrap')
const tools = new (require('./Tools'))()

class RedditTools {
  /**
   * Gets a random top post from the given subreddit (required). Uses the from
   * param to determine if it should pull from the top of all time, of the day,
   * etc. If one isn't provided, the default is day. The limit param determines
   * how many posts to pull from the subreddit, if none is provided 25 is the
   * default.
   *
   * @param {string|string[]} subreddit  The subreddit(s) to pull the posts from
   * @param {string} [from] The time interval to pull from (all, year, month, day)
   * @param {number} [limit] The amount of posts to request
   */
  getRandomTopPost (subreddit, from = 'day', limit = 25) {
    if (subreddit instanceof Array) {
      const random = tools.getRandom(0, subreddit.length)
      subreddit = subreddit[random]
    }

    return new Promise((resolve, reject) => {
      reddit.r(subreddit).sort('top').from(from).limit(limit, (err, data, res) => {
        if (err) reject(err)

        const randomPost = tools.getRandom(0, data.data.children.length)
        resolve(data.data.children[randomPost].data.url)
      })
    })
  }

  getRandomPost (subreddit, sort = 'hot', from = 'day', limit = 25) {
    if (subreddit instanceof Array) {
      const random = tools.getRandom(0, subreddit.length)
      subreddit = subreddit[random]
    }

    return new Promise((resolve, reject) => {
      reddit.r(subreddit).sort(sort).from(from).limit(limit, (err, data, res) => {
        if (err) reject(err)

        const randomPost = tools.getRandom(0, data.data.children.length)
        resolve(data.data.children[randomPost].data.url)
      })
    })
  }
}

module.exports = RedditTools
