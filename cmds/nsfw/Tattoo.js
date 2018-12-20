const Command = require('../BaseCmd')
const reddit = new (require('../../util/RedditTools'))()

const tatSubs = require('./Sources').Tatts

class Tattoo extends Command {
  constructor (client) {
    super(client, {
      name: 'tattoo',
      group: 'nsfw',
      memberName: 'tattoo',
      description: 'Returns a random nsfw tattoo\'d female from a variety of subreddits.',
      examples: ['+tattoo', '+tattoo 5'],
      args: [{
        key: 'count',
        type: 'integer',
        prompt: '',
        default: 1,
        min: 1,
        max: 10
      }],
      nsfw: true
    })
  }

  async run (msg, { count }) {
    let post = await reddit.getRandomNSFWPost(tatSubs, count)
    return Command.sendMessage(msg.channel, post, this.client.user).catch(err => this.error(err))
  }
}

module.exports = Tattoo
