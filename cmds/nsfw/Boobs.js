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
      aliases: ['boobs', 'boobies'],
      throttling: { usages: 1, duration: 10 },
      description: 'Returns a random boob image or gif from a variety of subreddits.',
      examples: ['+boobs'],
      args: [{
        key: 'count',
        type: 'integer',
        prompt: '',
        default: 1
      }],
      nsfw: true
    })
  }

  run (msg, { count }) {
    reddit.getRandomTopPost(boobSubs, 'day', 50).then(post => {
      msg.channel.send(post)
    })
  }
}

module.exports = Boobs
