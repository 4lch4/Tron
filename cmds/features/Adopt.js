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
      msg.channel.send(`<@${adoptee}>, do you wish to be adopted by <@${adopter}>? (Yes/No)`).then(m => {
        getAdoptResponse(msg.channel, adoptee).then(res => {
          if (res) {
            // WOOT
            adoption.save().then(res => {
              msg.reply('looks like you got a yes.')
            }).catch(err => console.error(err))
          } else {
            // Aww
            msg.reply('looks like you got a no.')
          }
        }).catch(err => console.error(err))
      }).catch(err => console.error(err))
    }
  } else {
    console.error('There was no message or adoptee provided to the adoptUser method.')
  }
}

const getAdoptResponse = (channel, adoptee) => {
  return new Promise((resolve, reject) => {
    let collector = channel.createMessageCollector(m =>
      m.member.id === adoptee && m.channel.id === channel.id, { time: 60000 }
    )

    collector.on('collect', (m, c) => {
      switch (m.content.trim().toLowerCase()) {
        case 'yes': {
          // WOOT
          resolve(true)
          collector.stop()
          break
        }

        case 'no': {
          // Aww
          resolve(false)
          collector.stop()
          break
        }
      }
    })
  })
}

/**
 * Analyzes the given String and determines what should be done with the content
 * of it, is the user requesting to list another users adoptions, add an
 * adoption? Etc.
 *
 * @param {String} input The string to analyze.
 */
const determineInputType = input => {
  console.log(`determineInputType() input = ${input}`)
  if (input.toLowerCase().includes('list')) {
    return 'list'
  } else return 'add'
}
