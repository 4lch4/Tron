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
      argsType: 'multiple'
    })
  }

  async run (msg, args) {
    if (msg.member.permissions.has(perms.MANAGE_MESSAGES)) {
      // Continue with deletion
      if (args !== undefined) {
        if (!isNaN(args[0])) {
          let count = args[0]
          if (msg.mentions.users.size > 0) {
            msg.mentions.users.forEach(user => {
              let _count = count
              msg.channel.messages.each(message => {
                if (message.author.id === user.id && _count !== 0) {
                  message.delete()
                  _count--
                }
              })
            })
          } else {
            msg.channel.bulkDelete(count)
              .then(msgs => msg.reply(`You've deleted ${msgs.size} messages.`))
              .catch(err => {
                if (err.code === 50013) msg.reply('Unfortunately, I do not have permission to delete messages in this channel.')
                else console.error(err)
              })
          }
        } else return msg.reply('The number to purge that was provided was not a valid number.')
      } else return msg.reply('You must supply a number of messages to be purged.')
    } else return msg.reply('You do not have the required permissions (**MANAGE_MESSAGES**) on this server to use this command.')
  }
}

module.exports = Purge
