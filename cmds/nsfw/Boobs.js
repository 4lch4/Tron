const Command = require('../BaseCmd')
const reddit = new (require('../../util/RedditTools'))()

const boobSubs = [
  'boobs',
  'Boobies',
  'Stacked',
  'BustyPetite',
  'Cleavage',
  'bustyasians',
  'boltedontits',
  'burstingout'
]

class Boobs extends Command {
  constructor (client) {
    super(client, {
      name: 'boobs',
      group: 'nsfw',
      memberName: 'boobs',
      aliases: ['boob', 'boobies'],
      description: 'Returns a random boob image or gif from a variety of subreddits.',
      examples: ['+boobs', '+boobies 10'],
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
    let post = await reddit.getRandomNSFWPost(boobSubs, count)
    msg.channel.send(post).catch(err => this.error(err))
  }
}

module.exports = Boobs
