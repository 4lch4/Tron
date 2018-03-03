const Command = require('../BaseCmd')
const reddit = new (require('../../util/RedditTools'))()

const feetSubs = [
  'CelebrityFeet',
  'FFSocks',
  'Feet_NSFW',
  'FootFetish',
  'FFNBPS',
  'feetish',
  'scent_of_women_feet',
  'AsianFeet',
  'gayfootfetish',
  'HighHeels',
  'Soles',
  'CosplayFeet',
  'dirtyfeet',
  'DesiFeet',
  'ebonyfeet',
  'rule34feet',
  'girlsinanklesocks',
  'Porn_Star_Feet',
  'FeetVideos',
  'Soles_And_Holes',
  'Footjobs'
]

class Feet extends Command {
  constructor (client) {
    super(client, {
      name: 'feet',
      group: 'nsfw',
      memberName: 'feet',
      throttling: { usages: 1, duration: 10 },
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
    msg.channel.send(post).catch(err => this.error(err))
  }
}

module.exports = Feet
