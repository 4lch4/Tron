const { Message, Client } = require('discord.js') // Used for JSDocs
const BaseCmd = require('../BaseCmd')
const Birthday = require('../util/Birthday')

class Birthdays extends BaseCmd {
  constructor (client) {
    super(client, {
      name: 'birthdays',
      memberName: 'birthdays',
      group: 'features',
      aliases: ['birthday', 'bday', 'bdays'],
      description: 'Allows you to add your birthday and enable birthday notifications.',
      examples: ['+birthdays add', '+bday list', '+bdays notify'],
      argsType: 'multiple'
    })
  }

  async run (msg, args) {
    args = this.cleanArgs(args)
    const user = getUserIdFromStr(args[1])
    const op = args[0]
    let birthday

    if (isValidOperation(op)) {
      switch (op) {
        case 'add':
          if (user === undefined) birthday = new Birthday(msg.author.id)
          else birthday = new Birthday(user)

          return addBirthday(birthday, msg)

        case 'list':
          return listBirthdays(msg, this.client)

        case 'update':
          if (user === undefined) birthday = new Birthday(msg.author.id)
          else birthday = new Birthday(user)

          const info = await birthday.getInfo(msg)
          const update = await birthday.updateBirthday(info)

          if (update) return msg.reply('this birthday has been updated.')
          else return msg.reply('there seems to have been an error. Please contact `+support`.')

        default:
          return msg.reply('now, how in the sam hill did you get this to happen?\nPlease contact Alcha using the `+support` command.')
      }
    } else return msg.reply('Please provide a valid value (add, list, update, delete).')
  }
}

module.exports = Birthdays

/**
 * Determines if the provided string is a valid operation such as add, list,
 * update, or delete and returns true or false.
 *
 * @param {string} val The string containing the argument
 */
const isValidOperation = val => {
  switch (val) {
    case 'add': return true
    case 'list': return true
    case 'update': return true
    case 'delete': return true
    default:
      return false
  }
}

/**
 * Gets a user id from the provided string. Usually the content of a mention so
 * something like <@397971962737197057> for example.
 *
 * @param {string} str The string containing the user id
 */
const getUserIdFromStr = str => {
  if (str === undefined) return undefined

  const start = str.search(/[0-9]/)
  const end = str.indexOf('>')
  return str.substring(start, end)
}

/**
 *
 * @param {Birthday} birthday
 * @param {Message} msg
 *
 * @returns {Promise<Message>}
 */
const addBirthday = async (birthday, msg) => {
  if (await birthday.stored()) {
    // Users birthday has already been stored
    return msg.reply('this birthday has already been stored. If you wish to udpate it, simply use the `+bday update` command.')
  } else {
    const info = await birthday.getInfo(msg)
    const stored = await birthday.store(info)

    if (stored) msg.reply('this birthday has successfully been stored!')
    else msg.reply('there was an error saving this birthday info, please contact `+support`.')
  }
}

/**
 *
 * @param {Birthday} birthday
 * @param {Message} msg
 * @param {Client} client
 *
 * @returns {Promise<Message>}
 */
const listBirthdays = (msg, client) => {
  const birthday = new Birthday(msg.author.id)

  birthday.getServerBdays(msg, client).then(bdays => {
    let content = ['Here is a list of server members who have their birthday added and set to public:\n```']

    bdays.forEach(bday => {
      content.push(`- ${bday.username} on ${bday.date}`)
    })

    content.push('```')

    msg.channel.send(content.join('\n'))
  })
}
