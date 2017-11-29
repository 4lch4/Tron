const { Command } = require('discord.js-commando')
const reddit = new (require('../../util/RedditTools'))()

const gaySubs = [
  'cockrating',
  'BonersInPublic',
  'curved_cock',
  'MassiveCock',
  'ratemycock',
  'RedditorCum',
  'NSFW_DICK_and_Cock',
  'TotallyStraight',
  'CockOutline',
  'lovegaymale'
]

class Gay extends Command {
  constructor (client) {
    super(client, {
      name: 'gay',
      group: 'nsfw',
      memberName: 'gay',
      throttling: { usages: 1, duration: 5 },
      description: 'Returns a random gay image or gif from a variety of subreddits and tumblr pages.',
      examples: ['+gay'],
      nsfw: true
    })
  }

  async run (msg, args) {
    reddit.getRandomTopPost(gaySubs, 'day', 50).then(post => {
      msg.channel.send(post)
    })
  }
}

module.exports = Gay
