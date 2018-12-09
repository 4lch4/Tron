const Command = require('../BaseCmd')

class Emotes extends Command {
  constructor (client) {
    super(client, {
      name: 'emotes',
      group: 'admin',
      memberName: 'emotes',
      description: 'Displays all of the emotes available on the server.',
      examples: ['+emotes'],
      guildOnly: true
    })
  }

  async run (msg, args) {
    if (msg.guild.available) {
      let animatedEmoji = []
      let stillEmoji = []

      msg.guild.emojis.each(emoji => {
        if (emoji.animated) animatedEmoji.push(emoji)
        else stillEmoji.push(emoji)
      })

      let output = [
        '**Standard Emotes:**',
        `${stillEmoji.join(' ')}\n`,
        '**Animated Emotes (Requires Discord Nitro):**',
        `${animatedEmoji.join(' ')}\n`

      ]

      if (output.join('\n').length < 2000) msg.channel.send(output.join('\n'))
      else {
        msg.channel.send(`${output[0]}\n${output[1]}`)
        msg.channel.send(`${output[2]}\n${output[3]}`)
      }
    }
  }
}

module.exports = Emotes
