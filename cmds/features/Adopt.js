const Command = require('../BaseCmd')
const AdoptDB = require('../../util/db/AdoptDB')

class Adopt extends Command {
  constructor (client) {
    super(client, {
      name: 'adopt',
      group: 'features',
      memberName: 'adopt',
      throttling: { usages: 1, duration: 10 },
      description: 'Allows you to adopt a member of your server.',
      examples: ['+adopt @Alcha#2625']
    })
  }

  async run (msg, args) {
    switch (determineInputType(msg.content)) {
      case 'add': {
        if (msg.mentions.users.size > 0) {
          msg.mentions.users.forEach(user => adoptUser(msg, user.id))
        } else msg.reply('you must mention at least one person to adopt.')
        break
      }

      case 'list': {
        let adoption = new AdoptDB()
        let list = await adoption.getAdoptionsList(msg.author, this.client)
        msg.channel.send(list)
        break
      }

      default: {
        break
      }
    }
  }
}

module.exports = Adopt

const adoptUser = async (msg, adoptee) => {
  let adopter = msg.author.id

  if (adopter !== undefined && adoptee !== undefined) {
    let adoption = new AdoptDB(adopter, adoptee)

    if (await adoption.exists()) msg.reply('you\'ve already adopted this person.')
    else {
      await msg.channel.send(`<@${adoptee}>, do you wish to be adopted by <@${adopter}>? (Yes/No)`)
      try {
        let res = await Command.getResponse(msg, val => val.toLowerCase() === 'yes' || val.toLowerCase() === 'no', adoptee)
        if (res === undefined) return msg.reply('Sorry, looks like you won\'t be getting a response this time around :cry:')
        else if (res.toLowerCase() === 'yes') {
          // WOOT
          adoption.save().then(res => {
            msg.reply('looks like you got a yes.')
          }).catch(err => console.error(err))
        } else {
          // Aww
          msg.reply('looks like you got a no.')
        }
      } catch (err) {
        console.error(err)
      }
    }
  } else {
    console.error('There was no message or adoptee provided to the adoptUser method.')
  }
}

/**
 * Analyzes the given String and determines what should be done with the content
 * of it, is the user requesting to list another users adoptions, add an
 * adoption? Etc.
 *
 * @param {String} input The string to analyze.
 */
const determineInputType = input => {
  if (input.toLowerCase().includes('list')) {
    return 'list'
  } else return 'add'
}
