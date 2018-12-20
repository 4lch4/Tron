const Command = require('../BaseCmd')
const reddit = new (require('../../util/RedditTools'))()

class FoodPorn extends Command {
  constructor (client) {
    super(client, {
      name: 'foodporn',
      group: 'nsfw',
      memberName: 'foodporn',
      aliases: ['foodz', 'foodies', 'foods', 'foodpron', 'food'],
      description: 'Returns a random image of FoodPorn from the r/FoodPorn subreddit.',
      examples: ['+foodporn']
    })
  }

  async run (msg, args) {
    const post = await reddit.getRandomTopPost('FoodPorn')
    return Command.sendMessage(msg.channel, post, this.client.user).catch(err => this.error(err))
  }
}

module.exports = FoodPorn
