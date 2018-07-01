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
    reddit.getRandomTopPost('FoodPorn').then(post => {
      msg.channel.send(post).catch(err => this.error(err))
    }).catch(err => console.error(err))
  }
}

module.exports = FoodPorn
