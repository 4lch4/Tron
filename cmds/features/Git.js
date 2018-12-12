const Command = require('../BaseCmd')
const pkgInfo = require('../../package.json')

class Git extends Command {
  constructor (client) {
    super(client, {
      name: 'git',
      group: 'features',
      memberName: 'git',
      description: 'Returns a link to the Github repository for Tron.',
      examples: ['+git'],
      aliases: ['github', 'repo']
    })
  }

  async run (msg, args) {
    return Command.sendMessage(msg.channel, `you can find the git repo for Tron here: ${pkgInfo.repository.url}`, this.client.user)
  }
}

module.exports = Git
