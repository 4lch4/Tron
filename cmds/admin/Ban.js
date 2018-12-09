const Command = require('../BaseCmd')

class Ban extends Command {
  constructor (client) {
    super(client, {
      name: 'admin-ban',
      group: 'admin',
      memberName: 'admin-ban',
      description: 'Bans the mentioned user from the server.',
      examples: ['+admin-ban @Alcha#0042', '+admin-ban @Alcha#0042 \'He\'s a total tuul.\''],
      userPermissions: ['ADMINISTRATOR'],
      args: [{
        key: 'user',
        label: 'User',
        prompt: 'Who would you like to ban from the server?',
        type: 'user'
      }, {
        key: 'reason',
        label: 'Reason',
        prompt: 'Why is this user being banned?',
        type: 'string',
        default: 'undefined'
      }]
    })
  }

  async run (msg, { user, reason }) {
    msg.mentions.members.first()
      .ban(reason)
      .then(member => msg.reply(`${member.user.username} has been banned for ${reason}.`))
  }
}

module.exports = Ban
