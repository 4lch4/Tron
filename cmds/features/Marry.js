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
      description: 'Used to marry a user, respond to a proposal, or display a users marriages.',
      examples: ['+marry @Alcha#2621', '+marry @Alcha#2621 list', '+marry @Alcha#2621 deny'],
      args: [{
        key: 'user',
        prompt: 'Who are you wanting to use this command against?',
        type: 'user'
      }, {
        key: 'cmdType',
        prompt: 'WHAT?!',
        type: 'string',
        default: 'propose'
      }]
    })
  }

  async run (msg, { user, cmdType }) {
    if (cmdType === 'propose') {
      // If no cmdType is provided, attempt to perform a proposal
      const marriage = await Marriage.beginProposal(msg, user)

      if (await marriage.exists()) {
        msg.channel.send('It appears you\'re already married to this person. What kinda trick you tryin\' to pull? :wink:')
      } else {
        msg.channel.send(`<@${user.id}>, do you take <@${msg.author.id}>'s hand in marriage? :ring:`).then(m => {
          Marriage.getProposalResponse(msg.channel, user).then(accepted => {
            if (accepted) {
              marriage.save().then(res => {
                msg.channel.send(`Congratulations, <@${msg.author.id}>, you're now married to <@${user.id}>!`)
              }).catch(err => console.error(err))
            } else msg.channel.send(`Awww... :cry:`)
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
    } else if (cmdType === 'list') {
      // If a list is requested, get the list of spouses for the mentioned user
      const idList = await Marriage.getMarriedIdList(user.id)

      console.log(idList)

      // If the list actually contains marriages, generate an embed for display
      if (idList.length > 0) {
        const fields = await Marriage.convertIdsToFields(idList, this.client)

        Marriage.generateListEmbed(user.username, fields, this.client).then(embed => {
          msg.channel.send(embed)
        })
      } else msg.channel.send('This user currently has no marriages. :frowning:')
    }
  }
}

module.exports = Marry
