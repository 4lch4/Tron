const { Command } = require('discord.js-commando')
const reddit = new (require('../../util/RedditTools'))()

const tatSubs = [
  'HotChicksWithTattoos',
  'SuicideGirls',
  'SceneGirls',
  'PrettyAltGirls'
]

class Tattoo extends Command {
  constructor (client) {
    super(client, {
      name: 'tattoo',
      group: 'nsfw',
      memberName: 'tattoo',
      throttling: { usages: 1, duration: 10 },
      description: 'Returns a random nsfw tattoo\'d female from a variety of subreddits.',
      examples: ['+tattoo'],
      nsfw: true
    })
  }

  async run (msg, args) {
    reddit.getRandomTopPost(tatSubs, 'day', 50).then(post => {
      msg.channel.send(post)
    })
  }
}

module.exports = Tattoo
