const Command = require('../BaseCmd')
const Nekos = require('nekos.life')
const nekos = new Nekos()

const tools = new (require('../../util/Tools'))()

class Neko extends Command {
  constructor (client) {
    super(client, {
      name: 'neko',
      group: 'features',
      memberName: 'neko',
      guildOnly: false,
      description: 'Displays nekos of various shapes and sizes.',
      examples: ['+neko', '+neko nsfw'],
      args: [{
        key: 'type',
        default: 'sfw',
        prompt: 'Would you like SFW or NSFW content?',
        validate: val => {
          if (val === 'sfw' || val === 'nsfw') return true
          else return 'Please provide either `sfw` or `nsfw` for the content type.'
        },
        parse: val => val.toLowerCase()
      }]
    })
  }

  async run (msg, { type }) {
    switch (type) {
      case 'sfw': return msg.channel.send(await getSfwNekoUrl())

      case 'nsfw':
        if (msg.channel.nsfw) {
          return msg.channel.send(await getNsfwNekoUrl())
        } else return msg.reply('NSFW commands must be run in a NSFW channel.')
    }
  }
}

module.exports = Neko

const getNsfwNekoUrl = async () => {
  try {
    if (tools.getRandom(0, 2) === 0) {
      let { url } = await nekos.nsfw.neko()
      return url
    } else {
      let { url } = await nekos.nsfw.nekoGif()
      return url
    }
  } catch (err) { console.error(err) }
}

const getSfwNekoUrl = async () => {
  try {
    if (tools.getRandom(0, 2) === 0) {
      let { url } = await nekos.sfw.neko()
      return url
    } else {
      let { url } = await nekos.sfw.nekoGif()
      return url
    }
  } catch (err) { console.error(err) }
}
