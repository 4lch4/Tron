const Command = require('../BaseCmd')
const tools = new (require('../../util/Tools'))()

class Unmute extends Command {
  constructor (client) {
    super(client, {
      name: 'unmute',
      group: 'admin',
      memberName: 'unmute',
      description: 'Unmutes the mentioned user(s) from text and voice-chat on the server.',
      examples: ['+unmute @Alcha#0042', '+unmute @Alcha#0042 @Altcha#4829'],
      argsType: 'multiple'
    })
  }

  async run (msg, args) {
    args.forEach((arg, index) => {
      let match = arg.match(/<@(\d+)>/)
      if (match) {
        let memberToMute = this.client.guilds.get(msg.guild.id).members.get(match[1])
        let muteRole = this.client.guilds.get(msg.guild.id).roles.find('name', 'tron-mute')
        if (muteRole !== undefined) {
          memberToMute.removeRole(muteRole).then(member => {
            msg.reply(`you have unmuted ${member.user.username}.`)
          }).catch(err => {
            if (err.code === 50001) {
              msg.reply('please ensure Tron has the correct permissions to remove roles before using this command.')
            } else if (err.code === 50013) {
              msg.reply(
                'I don\'t seem to have the right permissions to remove roles.' + '\n' +
                'If you continue to see this error, please contact +support.'
              )
            } else {
              msg.reply('there seems to have been an error. Please contact support.')
              console.error(`Error on ${tools.formattedUTCTime}:`, err)
            }
          })
        } // else msg.reply('this server doesn\'t appear to have a tron-mute role. Please use +initialize to add it.')
      }
    })
  }
}

module.exports = Unmute
