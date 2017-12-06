const { Command } = require('discord.js-commando')

class Kick extends Command {
  constructor (client) {
    super(client, {
      name: 'admin-kick',
      group: 'admin',
      memberName: 'admin-kick',
      description: 'Kicks the mentioned user from the server.',
      examples: ['+admin-kick @Alcha#2621', '+admin-kick @Alcha#2621 \'He\'s a total tuul.\''],
      userPermissions: ['ADMINISTRATOR'],
      args: [{
        key: 'user',
        label: 'User',
        prompt: 'Who would you like to kick from the server?',
        type: 'user'
      }, {
        key: 'reason',
        label: 'Reason',
        prompt: 'Why is this user being kicked?',
        type: 'string',
        default: 'undefined'
      }]
    })
  }

  async run (msg, { user, reason }) {
    msg.mentions.members.first()
      .kick(reason)
      .then(member => msg.reply(`${member.user.username} has been kicked for ${reason}.`))
  }
}

module.exports = Kick
