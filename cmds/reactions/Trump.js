const { Command } = require('discord.js-commando')
const path = require('path')

const ioTools = new (require('../../util/IOTools'))()

class Trump extends Command {
  constructor (client) {
    super(client, {
      name: 'trump',
      group: 'reactions',
      memberName: 'trump',
      throttling: { usages: 1, duration: 10 },
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
    ioTools.getImagePath(path.join('trump', `${type}.gif`)).then(image => {
      msg.channel.send('', { files: [image] })
    })
  }
}

module.exports = Trump
