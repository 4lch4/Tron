const Command = require('../BaseCmd')
const config = require('../../util/config.json')
const tools = new (require('../../util/Tools'))()
const ioTools = new (require('../../util/IOTools'))()

class UnknownCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'unknown',
      memberName: 'unknown',
      group: 'features',
      description: 'N/A',
      unknown: true,
      hidden: true
    })
  }

  async run (msg, args) {
    let content = msg.content.substring(this.client.commandPrefix.length)
    if (msg.channel.id !== config.testChannel) { // Default testing channel, don't respond.
      let response = await tools.queryGiphy(content, this.client.user.username, this.client.user.displayAvatarURL())
      if (response !== null) {
        return Command.sendMessage(msg.channel, '', this.client.user, response)
      }
    }

    if (content.split(' ').length > 1) {
      content = content.split(' ').join('_')
    }

    if (await ioTools.imageFolderExists(content)) {
      const randomImg = await ioTools.getRandomImage(content)
      return Command.sendMessage(msg.channel, '', this.client.user, { files: [randomImg] })
    }
  }
}

module.exports = UnknownCommand
