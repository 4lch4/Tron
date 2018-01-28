const Marriage = require('../util/Marriage')
const tools = new (require('../../util/Tools'))()

const { Command } = require('discord.js-commando')

class Marry extends Command {
  constructor (client) {
    super(client, {
      name: 'marry',
      group: 'features',
      memberName: 'marry',
      throttling: { usages: 1, duration: 60 },
      description: 'Used to marry a user or display the marriages of yourself or a mentioned user.',
      examples: ['+marry @Alcha#2625', '+marry list', '+marry list @Alcha#2625'],
      argsType: 'multiple'
    })
  }

  async run (msg, args) {
    switch (args.length) {
      case 0:
        return msg.reply(`this command requires at least one argument.\n\n` +
                  `Please try mentioning a user or use \`+marry list\` to list your current marriages.`)

      case 1:
        if (args[0].match(/<@!?\d+>/)) {
            // User mentioned
          const mentionedUserId = args[0].substring(args[0].indexOf(args[0].match(/\d/)), args[0].indexOf('>'))
          const marriage = new Marriage(mentionedUserId, msg.author.id)

          if (await marriage.married()) return msg.reply('you two are already married! Whatchu tryin\' to pull? :wink:')
          else {
            msg.channel.send(`<@${mentionedUserId}>, do you take <@${msg.author.id}>'s hand in marriage? :ring:`).then(m => {
              marriage.getProposalResponse(msg.channel, mentionedUserId).then(accepted => {
                if (accepted) {
                  marriage.saveMarriage().then(res => {
                    msg.channel.send(`Congratulations, <@${msg.author.id}>, you're now married to <@${mentionedUserId}>!`)
                  }).catch(err => {
                    msg.channel.send('There seems to have been an error.. If this continues, please contact support.')
                    msg.channel.send(err)
                    console.error(`${tools.formattedTime} - There was an error attempting to save a users marriages:`)
                    console.error(err)
                  })
                } else {
                  msg.channel.send(`Awww... :cry:`).then(m => {
                    marriage.complete()
                  })
                }
              }).catch(err => {
                if (err === 'time') msg.channel.send(`Sorry <@${msg.author.id}>, looks like you won't be getting a response this time around. :cry:`)
                else {
                  msg.channel.send(
                    'There was an error when trying to execute the marriage proposal.\n\n' +
                    'Please try again and if it continues to fail, contact support.'
                  )
                  console.error(`${tools.formattedTime} - There was an error attempting to list a users marriages:`)
                  console.error(err)
                }
              })
            })
          }
          return
        } else if (args[0].toLowerCase() === 'list') {
          // List command executed on author
          const marriage = new Marriage(msg.author.id)
          const marriedList = await marriage.getMarriedList()
          const embedFields = await marriage.convertIdsToFields(marriedList, this.client)
          const embed = await marriage.generateMarriedListEmbed(msg.author.username, embedFields, this.client)

          marriage.complete()
          this._throttles.delete(msg.author.id) // Resets throttling timer

          return msg.channel.send(embed)
        } else return msg.reply(`you have provided an invalid argument. Please check the help for this command.`)

      case 2:
        if (args[0].toLowerCase() === 'list') {
          if (args[1].match(/<@!?\d+>/)) {
            const mentionedUserId = args[1].substring(args[1].indexOf(args[1].match(/\d/)), args[1].indexOf('>'))
            const marriage = new Marriage(mentionedUserId)
            const marriedList = await marriage.getMarriedList()
            const embedFields = await marriage.convertIdsToFields(marriedList, this.client)
            const embed = await marriage.generateMarriedListEmbed(msg.author.username, embedFields, this.client)
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

module.exports = Marry
