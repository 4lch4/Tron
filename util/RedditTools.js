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
   * @param {number} [limit] The amount of posts to request (default = 25)
   * @param {number} [count] The amount of posts to return (default = 1)
   */
  getRandomTopPost (subreddit, from = 'day', limit = 25, count = 1) {
    if (subreddit instanceof Array) {
      const random = tools.getRandom(0, subreddit.length)
      subreddit = subreddit[random]
    }

    return new Promise((resolve, reject) => {
      reddit.r(subreddit).sort('top').from(from).limit(limit, (err, data, res) => {
        if (err) reject(err)

        if (count === 1 && data !== undefined && data.data !== undefined) {
          const randomPost = tools.getRandom(0, data.data.children.length)
          resolve(data.data.children[randomPost].data.url)
        } else if (data !== undefined && data.data !== undefined) {
          let posts = this.selectPosts(data.data.children, count)
          resolve(posts)
        }
      })
    })
  }

  /**
   * Gets a random top post or posts from the given subreddit(s) (required). The
   * count parameter determines exactly how many posts to return. This method is
   * primarily for the NSFW commands of as they all use the same from/limit
   * values by default so there's no need to overcomplicate their call in the
   * command file. This method simply calls the getRandomTopPost method with the
   * default values for the NSFW commands. (e.g. from = day; limit = 50)
   *
   * The url to each image within the post is returned via a promise in an
   * individual String or String array.
   *
   * @param {string|string[]} subreddit The subreddit(s) to pull the posts from
   * @param {number} [count] The amount of posts to return (default = 1)
   *
   * @returns {Promise<string|string[]>}
   */
  getRandomNSFWPost (subreddit, count = 1) {
    return this.getRandomTopPost(subreddit, 'day', 50, count)
  }

  /**
   * Select a number of posts from the given array of posts if a count is
   * provided. Otherwise, only one post is returned.
   *
   * NOTE: The post(s) is/are returned as the url to the image within the
   * post(s), not the entirety of the post(s).
   *
   * @param {string[]} posts The posts to select from
   * @param {number} [count] The amount of posts to select (default = 1)
   */
  selectPosts (posts, count = 1) {
    let newPosts = []
    for (let x = 0; x < count; x++) {
      let random = tools.getRandom(0, posts.length)
      newPosts.push(posts[random].data.url)
    }

    return newPosts
  }

  getRandomHotPost (subreddit, sort = 'hot', from = 'day', limit = 25) {
    if (subreddit instanceof Array) {
      const random = tools.getRandom(0, subreddit.length)
      subreddit = subreddit[random]
    }

    return new Promise((resolve, reject) => {
      reddit.r(subreddit).sort(sort).from(from).limit(limit, (err, data, res) => {
        if (err) reject(err)

        try {
          const randomPost = tools.getRandom(0, data.data.children.length)
          resolve(data.data.children[randomPost].data.url)
        } catch (err) {
          reject(err)
        }
      })
    })
  }
}

module.exports = RedditTools
