const { Command } = require('discord.js-commando')

const ioTools = new (require('../../util/IOTools'))()

const path = require('path')

class Trump extends Command {
  constructor (client) {
    super(client, {
      name: 'trump',
      group: 'reactions',
      memberName: 'trump',
      throttling: { usages: 1, duration: 5 },
      description: 'Returns a trump gif based on the provided arguments.',
      examples: ['+trump fake', '+trump wrong'],
      args: [{
        key: 'type',
        label: 'Type of image.',
        prompt: 'What kind of Trump image?',
        type: 'string'
      }]
    })
  }

  async run (msg, { type }) {
    ioTools.getImage(path.join('trump', `${type}.gif`)).then(image => {
      msg.channel.send('', { files: [image] })
    })
  }
}

module.exports = Trump
