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
      examples: ['+butts'],
      nsfw: true
    })
  }

  async run (msg, args) {
    reddit.getRandomTopPost(buttSubs, 'day', 50).then(post => {
      msg.channel.send(post)
    })
  }
}

module.exports = Butts
