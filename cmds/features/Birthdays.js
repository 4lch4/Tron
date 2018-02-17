const BaseCmd = require('../BaseCmd')
const Birthday = require('../util/Birthday')

/**
 *
 * @param {string[]} args
 */
const cleanArs = args => {
  let newArgs = []
  args.forEach(val => newArgs.push(val.toLowerCase()))
  return newArgs
}

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
    const birthday = new Birthday(msg.author.id)

    if (args.length > 0) {
      args = cleanArs(args)
      switch (args[0]) {
        case 'add':
          if (await birthday.stored()) {
            // Users birthday has already been stored, use update
            return msg.reply('your birthday is already stored. Please use the `update` argument instead of `add`.')
          } else {
            const info = await birthday.getInfo(msg)
            const stored = await birthday.store(info)

            if (stored) msg.reply('your birthday has successfully been stored!')
            else msg.reply('there was an error saving your birthday info, please contact `+support`.')
          }
          break

        case 'list':
          birthday.getServerBdays(msg, this.client).then(bdays => {
            let content = ['Here is a list of server members who have their birthday added and set to public:\n```']

            bdays.forEach(bday => {
              content.push(`- ${bday.username} on ${bday.date}`)
            })

            content.push('```')

            msg.channel.send(content.join('\n'))
          })
          break

        case 'update':
          return msg.reply('this is currently being developed and is not available to the public.')

        default:

          break
      }
    } else {
      msg.reply('working.')
    }
  }
}

module.exports = Birthdays
