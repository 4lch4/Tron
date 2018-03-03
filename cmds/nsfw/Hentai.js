const Command = require('../BaseCmd')
const reddit = new (require('../../util/RedditTools'))()

const hentaiSubs = [
  'hentai',
  'rule34',
  'rule34feet'
]

class Hentai extends Command {
  constructor (client) {
    super(client, {
      name: 'hentai',
      group: 'nsfw',
      memberName: 'hentai',
      throttling: { usages: 1, duration: 10 },
      description: 'Returns a random hentai image/gif.',
      examples: ['+hentai', '+hentai 5'],
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
    let post = await reddit.getRandomNSFWPost(hentaiSubs, count)
    msg.channel.send(post).catch(err => this.error(err))
  }
}

module.exports = Hentai
