const Command = require('../BaseCmd')
const reddit = new (require('../../util/RedditTools'))()
const buttSubs = [
  'asstastic',
  'pawg',
  'facedownassup',
  'ass',
  'brunetteass',
  'CheekyBottoms',
  'datgap',
  'underbun',
  'pawgtastic',
  'BestBooties',
  'CuteLittleButts'
]

class Butts extends Command {
  constructor (client) {
    super(client, {
      name: 'butts',
      group: 'nsfw',
      aliases: ['butt', 'booty', 'ass'],
      memberName: 'butts',
      throttling: { usages: 1, duration: 10 },
      description: 'Returns a random butt image or gif from a variety of subreddits.',
      examples: ['+butts', '+booty 5'],
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
    let post = await reddit.getRandomNSFWPost(buttSubs, count)
    msg.channel.send(post).catch(err => this.error(err))
  }
}

module.exports = Butts
