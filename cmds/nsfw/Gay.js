const Command = require('../BaseCmd')
const reddit = new (require('../../util/RedditTools'))()

const gaySubs = require('./Sources').Gay

class Gay extends Command {
  constructor (client) {
    super(client, {
      name: 'gay',
      group: 'nsfw',
      memberName: 'gay',
      aliases: ['dick', 'dicks', 'cock', 'cocks', 'penis', 'penises'],
      description: 'Returns a random gay image or gif from a variety of subreddits and tumblr pages.',
      examples: ['+gay', '+gay 5'],
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
    let post = await reddit.getRandomNSFWPost(gaySubs, count)
    return Command.sendMessage(msg.channel, post, this.client.user).catch(err => this.error(err))
  }
}

module.exports = Gay
