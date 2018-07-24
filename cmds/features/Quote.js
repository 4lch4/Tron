const Command = require('../BaseCmd')

const tools = new (require('../../util/Tools'))()
const ioTools = new (require('../../util/IOTools'))()

class Quote extends Command {
  constructor (client) {
    super(client, {
      name: 'quote',
      group: 'features',
      memberName: 'quote',
      description: 'Returns a random quote of interest.',
      examples: ['+quote']
    })
  }

  async run (msg, args) {
    ioTools.readDataFile('Quotes.txt').then(fileData => {
      const fileLines = fileData.split('\n')
      const random = tools.getRandom(0, fileLines.length)
      msg.channel.send(fileLines[random])
    })
  }
}

module.exports = Quote
