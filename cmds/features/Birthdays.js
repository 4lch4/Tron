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
    const op = args[0]
    const user = getUserIdFromStr(args[1])

    if (isValidOperation(op)) {
      switch (op) {
        case 'add':
          let birthday
          if (user === undefined) birthday = new Birthday(msg.author.id)
          else birthday = new Birthday(user)

          return addBirthday(birthday, msg)

        case 'list':
          return listBirthdays(birthday, msg, this.client)

        case 'update':
          const info = await birthday.getInfo(msg)
          birthday.updateBirthday(info).then(res => {
            console.log(res)
            msg.reply('your birthday has been updated!')
          })
          break

        default:
          return msg.reply('now, how in the sam hill did you get this to happen?\nPlease contact Alcha using the `+support` command.')
      }
    } else return msg.reply('Please provide a valid value (add, list, update, delete).')
  }
}

module.exports = Birthdays

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
    return msg.reply('this birthday has already been stored. If you wish to add a birthday for someone else, mention them like so: `+bdays add @User#1234`')
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
const listBirthdays = (birthday, msg, client) => {
  birthday.getServerBdays(msg, client).then(bdays => {
    let content = ['Here is a list of server members who have their birthday added and set to public:\n```']

    bdays.forEach(bday => {
      content.push(`- ${bday.username} on ${bday.date}`)
    })

    content.push('```')

    msg.channel.send(content.join('\n'))
  })
}
