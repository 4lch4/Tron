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
        label: 'Type of image',
        prompt: 'Which type of Trump image?',
        type: 'string',
        validate: (value, msg, arg) => {
          if (value === 'fake' || value === 'wrong' || value === 'test') return true
          else return 'you have provided an invalid input. Please try a valid input (e.g. fake/wrong).'
        }
      }]
    })
  }

  async run (msg, { type }) {
    ioTools.getImagePath(path.join('trump', `${type}.gif`)).then(image => {
      msg.channel.send('', { files: [image] })
    }).catch(err => console.error(err))
  }
}

module.exports = Trump
