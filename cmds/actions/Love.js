const { Command } = require('discord.js-commando')

const IOTools = require('../../util/IOTools')
const ioTools = new IOTools()
const Tools = require('../../util/Tools')
const tools = new Tools()

module.exports = class Love extends Command {
  constructor (client) {
    super(client, {
      name: 'love',
      group: 'actions',
      memberName: 'love',
      guildOnly: true,
      throttling: { usages: 1, duration: 5 },
      description: 'Show your love to a server member.',
      examples: ['+love @Alcha#2621'],
      args: [
        {
          key: 'user',
          prompt: 'Which user do you want to love?',
          type: 'member',
          default: ''
        }
      ]
    })
  }

  async run (msg, args) {
    ioTools.getImageFilenames('love').then(filenames => {

    })
    return msg.channel.send('Testing')
  }
}
