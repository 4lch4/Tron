const BaseCmd = require('../BaseCmd')
const perms = require('discord.js').Permissions.FLAGS
class Purge extends BaseCmd {
  constructor (client) {
    super(client, {
      name: 'purge',
      memberName: 'purge',
      group: 'admin',
      description: 'Purges the last given amount of messages in the channel.',
      aliases: ['purges'],
      examples: ['+purge'],
      guildOnly: true,
      args: [{
        key: 'count',
        prompt: 'How many messages would you like to delete?',
        type: 'integer'
      }]
    })
  }

  async run (msg, { count }) {
    if (msg.member.permissions.has(perms.MANAGE_MESSAGES)) {
      // Continue with deletion
      msg.channel.bulkDelete(count)
        .then(msgs => msg.reply(`You've deleted ${msgs.size} messages.`))
        .catch(console.error)
    } else return msg.reply('You do not have the required permissions (**MANAGE_MESSAGES**) on this server to use this command.')
  }
}

module.exports = Purge
