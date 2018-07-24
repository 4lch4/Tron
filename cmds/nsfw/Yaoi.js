const Command = require('../BaseCmd')
const tumblr = new (require('../../util/TumblrTools'))()

const blogUrl = 'lady-zenora.tumblr.com'

class Yaoi extends Command {
  constructor (client) {
    super(client, {
      name: 'yaoi',
      group: 'nsfw',
      memberName: 'yaoi',
      description: 'Returns a random yaoi image or gif.',
      examples: ['+yaoi'],
      nsfw: true
    })
  }

  async run (msg, args) {
    tumblr.getRandomPhoto(blogUrl).then(photo => {
      msg.channel.send(photo)
    })
  }
}

module.exports = Yaoi
