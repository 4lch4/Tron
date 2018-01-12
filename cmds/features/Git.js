const { Command } = require('discord.js-commando')

class Git extends Command {
  constructor (client) {
    super(client, {
      name: 'git',
      group: 'features',
      memberName: 'git',
      throttling: { usages: 1, duration: 10 },
      description: 'Returns a link to the Github repository for Tron.',
      examples: ['+git'],
      aliases: ['github', 'repo']
    })
  }

  async run (msg, args) {
    msg.reply('you can find the git repo for Tron here: https://github.com/Paranoid-Devs/Tron')
  }
}

module.exports = Git
