const Command = require('../BaseCmd')

const ioTools = new (require('../../util/IOTools'))()
const tools = new (require('../../util/Tools'))()

const maleVarieties = ['dude', 'guy', 'male', 'bro']

class Newds extends Command {
  constructor (client) {
    super(client, {
      name: 'newds',
      group: 'nsfw',
      memberName: 'newds',
      aliases: ['newd', 'nood', 'nude', 'nudes'],
      description: 'Sends a random nude to the mentioned user.',
      examples: ['+newds @Alcha#0042', '+newds dude @Alcha#0042'],
      args: [{
        key: 'sex',
        label: 'Sex',
        prompt: 'Did you want to send a guy or gal?',
        default: 'girl',
        type: 'string'
      }],
      nsfw: true
    })
  }

  async run (msg, { sex }) {
    if (maleVarieties.indexOf(sex) !== -1) {
      this.log(`Found a male choice.`)
    } else {
      if (msg.mentions.users.size > 0) {
        ioTools.readDataFile('ButtImages.txt').then(fileData => {
          const fileLines = fileData.split('\n')
          const random = tools.getRandom(0, fileLines.length)

          msg.mentions.users.forEach((user, index, array) => {
            user.createDM().then(channel => {
              channel.send(fileLines[random]).catch(err => console.error(err))
            })
          })

          msg.channel.send('Your message has been sent. ;)')

          msg.delete().catch(err => {
            if (err.message !== 'Missing Permissions') this.log(err)
          })
        })
      } else {
        msg.reply('you must mention at least one user to send a message to.')
      }
    }
  }
}

module.exports = Newds
