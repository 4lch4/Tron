const { Command } = require('discord.js-commando')
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
      throttling: { usages: 1, duration: 5 },
      description: '',
      examples: ['+hentai'],
      nsfw: true
    })
  }

  async run (msg, args) {
    reddit.getRandomTopPost(hentaiSubs, 'day', 50).then(post => {
      msg.channel.send(post)
    })
  }
}

module.exports = Hentai
