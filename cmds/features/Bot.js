const BaseCmd = require('../BaseCmd')
const config = require('../../util/config.json')
const { MessageEmbed } = require('discord.js')
const info = require('../../package.json')
const Moment = require('moment')
const tools = new (require('../../util/Tools'))()

class Bot extends BaseCmd {
  constructor (client) {
    super(client, {
      name: 'bot',
      memberName: 'bot',
      group: 'features',
      description: 'Displays various information about Tron and the servers it is on.',
      aliases: ['bot-info', 'botinfo', 'info'],
      examples: ['+bot', '+botinfo']
    })
  }

  async run (msg, args) {
    let botUser = this.client.user
    let embed = new MessageEmbed({
      'title': botUser.username,
      'description': info.description,
      'color': 4682777,
      'timestamp': new Moment().toDate(),
      'footer': {
        'icon_url': botUser.avatarURL,
        'text': `Tron - ${info.version}`
      },
      'thumbnail': {
        'url': botUser.avatarURL()
      },
      'author': {
        'name': msg.member.username,
        'icon_url': msg.member.avatarURL
      },
      'fields': generateFields(this.client)
    })

    return msg.channel.send('', embed)
  }
}

module.exports = Bot

const generateFields = (client) => {
  let fields = [{
    'name': 'Server Count',
    'value': client.guilds.size,
    'inline': true
  }, {
    'name': 'User Count',
    'value': tools.numberWithCommas(client.users.size),
    'inline': true
  }, {
    'name': 'Uptime',
    'value': `${tools.numberWithCommas(Math.round(client.uptime / 1000 / 60))} mins`,
    'inline': true
  }, {
    'name': 'Command Count',
    'value': client.registry.commands.size,
    'inline': true
  }]

  client.owners.forEach(owner => {
    fields.push({
      'name': 'Owner',
      'value': owner.tag,
      'inline': true
    })
  })

  config.developers.forEach(dev => {
    fields.push({
      'name': 'Developer',
      'value': dev,
      'inline': true
    })
  })

  return fields
}
