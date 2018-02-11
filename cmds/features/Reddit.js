const Command = require('../BaseCmd')

const reddit = new (require('../../util/RedditTools'))()

class Reddit extends Command {
  constructor (client) {
    super(client, {
      name: 'reddit',
      group: 'features',
      memberName: 'reddit',
      throttling: { usages: 1, duration: 10 },
      aliases: ['r'],
      description: 'Returns a random post from the front page of the given subreddit.',
      examples: ['+reddit r/Aww', '+r facepalm', '+r facepalm top all 50'],
      args: [{
        key: 'subreddit',
        label: 'Subreddit',
        type: 'string',
        prompt: 'Which subreddit would you like to pull a post from?'
      }, {
        key: 'sort',
        label: 'Sort',
        default: 'hot',
        type: 'string',
        prompt: 'Would you like to sort by `hot`, `top`, `controversial`, or `new`?',
        validate: (val, msg, arg) => {
          if (val === 'hot' ||
              val === 'top' ||
              val === 'controversial' ||
              val === 'new') {
            return true
          } else {
            return 'Would you like to sort by `hot`, `top`, `controversial`, or `new`?'
          }
        }
      }, {
        key: 'from',
        label: 'From',
        default: 'day',
        type: 'string',
        prompt: 'Would you like to pull from the `day`, `week`, `month`, `year`, or `all` time?',
        validate: (val, msg, arg) => {
          if (val === 'day' ||
              val === 'week' ||
              val === 'month' ||
              val === 'year' ||
              val === 'all') {
            return true
          } else {
            return 'Would you like to pull from the `day`, `week`, `month`, `year`, or `all` time?'
          }
        }
      }, {
        key: 'limit',
        label: 'Limit',
        default: '25',
        type: 'integer',
        min: 25,
        max: 75,
        prompt: 'How many posts would you like to pull (25 - 75)?'
      }]
    })
  }

  async run (msg, { subreddit, sort, from, limit }) {
    if (subreddit.indexOf('/') !== -1) {
      subreddit = subreddit.slice(subreddit.indexOf('/') + 1)
    }

    return reddit.getRandomPost(subreddit, sort, from, limit).then(post => {
      msg.channel.send(post)
    })
  }
}

module.exports = Reddit
