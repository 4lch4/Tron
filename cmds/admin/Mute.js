const Command = require('../BaseCmd')
const tools = new (require('../../util/Tools'))()

class Mute extends Command {
  constructor (client) {
    super(client, {
      name: 'mute',
      group: 'admin',
      memberName: 'mute',
      description: 'Mutes the mentioned user(s) from text and voice-chat on the server.',
      examples: ['+mute @Alcha#2625', '+mute @Alcha#2625 @Altcha#4829'],
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
          memberToMute.addRole(muteRole).then(member => {
            msg.reply(`you have muted ${member.user.username}.`)
          }).catch(err => {
            if (err.code === 50001) {
              msg.reply('please ensure Tron has the correct permissions to add roles before using this command.')
            } else if (err.code === 50013) {
              msg.reply(
                'I don\'t seem to have the right permissions to add roles.' + '\n' +
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

module.exports = Mute
