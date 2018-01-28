const Marriage = require('../util/Marriage')
const tools = new (require('../../util/Tools'))()

const { Command } = require('discord.js-commando')

class Divorce extends Command {
  constructor (client) {
    super(client, {
      name: 'divorce',
      group: 'features',
      memberName: 'divorce',
      throttling: { usages: 1, duration: 60 },
      description: 'Used to divorce a user or display the divorces of yourself or a mentioned user.',
      examples: ['+divorce @Alcha#2625', '+divorce list', '+divorce list @Alcha#2625'],
      argsType: 'multiple'
    })
  }

  async run (msg, args) {
    switch (args.length) {
      case 0:
        return msg.reply(`this command requires at least one argument.\n\n` +
                  `Please try mentioning a user or use \`+divorce list\` to list your current divorces.`)

      case 1:
        if (args[0].match(/<@!?\d+>/)) {
            // User mentioned
          const mentionedUserId = args[0].substring(args[0].indexOf(args[0].match(/\d/)), args[0].indexOf('>'))
          const marriage = new Marriage(mentionedUserId, msg.author.id)

          if (await marriage.divorced(false, true)) return msg.reply('you two are already divorced! Whatchu tryin\' to pull?')
          else {
            msg.channel.send(`<@${mentionedUserId}>, do you accept <@${msg.author.id}>'s divorce proposal?`).then(m => {
              marriage.getProposalResponse(msg.channel, mentionedUserId).then(accepted => {
                if (accepted) {
                  marriage.saveDivorce().then(res => {
                    msg.channel.send(`<@${msg.author.id}>, and <@${mentionedUserId}>, you are no longer married.`)
                  }).catch(err => {
                    msg.channel.send('There seems to have been an error.. If this continues, please contact support.')
                    msg.channel.send(err)
                    console.error(`${tools.formattedTime} - There was an error attempting to save a users divorces:`)
                    console.error(err)
                  })
                } else {
                  msg.channel.send(`Awww... :cry:`).then(m => {
                    marriage.complete()
                  })
                }
              }).catch(err => {
                if (err === 'time') msg.channel.send(`Sorry <@${msg.author.id}>, looks like you won't be getting a response this time around.`)
                else {
                  msg.channel.send(
                    'There was an error when trying to execute the divorce proposal.\n\n' +
                    'Please try again and if it continues to fail, contact support.'
                  )
                  console.error(`${tools.formattedTime} - There was an error attempting to list a users divorces:`)
                  console.error(err)
                }
              })
            })
          }
          return
        } else if (args[0].toLowerCase() === 'list') {
          // List command executed on author
          const marriage = new Marriage(msg.author.id)
          const divorcedList = await marriage.getDivorcedList()
          const embedFields = await marriage.convertIdsToFields(divorcedList, this.client)
          const embed = await marriage.generateDivorcedListEmbed(msg.author.username, embedFields, this.client)

          marriage.complete()
          this._throttles.delete(msg.author.id) // Resets throttling timer

          return msg.channel.send(embed)
        } else return msg.reply(`you have provided an invalid argument. Please check the help for this command.`)

      case 2:
        if (args[0].toLowerCase() === 'list') {
          if (args[1].match(/<@!?\d+>/)) {
            const mentionedUserId = args[1].substring(args[1].indexOf(args[1].match(/\d/)), args[1].indexOf('>'))
            const marriage = new Marriage(mentionedUserId)
            const divorcedList = await marriage.getDivorcedList()
            const embedFields = await marriage.convertIdsToFields(divorcedList, this.client)
            const embed = await marriage.generateDivorcedListEmbed(msg.author.username, embedFields, this.client)
            marriage.complete()

            return msg.channel.send(embed)
          }
        }

        console.log(args)
        return msg.channel.send(`There seems to have been a problem.. Please contact support (\`+support\`).`)

      default:
        msg.reply(`you have provided an invalid amount of arguments.`)
        break
    }
  }
}

module.exports = Divorce
