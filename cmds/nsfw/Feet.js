const Command = require('../BaseCmd')
const reddit = new (require('../../util/RedditTools'))()

const feetSubs = require('./Sources').Feet

class Feet extends Command {
  constructor (client) {
    super(client, {
      name: 'feet',
      group: 'nsfw',
      memberName: 'feet',
      description: 'Returns a random feet fetish image, not always NSFW, but generally, from a variety of subreddits.',
      examples: ['+feet', '+feet 5'],
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
    let post = await reddit.getRandomNSFWPost(feetSubs, count)
    return Command.sendMessage(msg.channel, post, this.client.user).catch(err => this.error(err))
  }
}

module.exports = Feet
