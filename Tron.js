// #region Const and requires declarations
const config = require('./util/config.json')
const IOTools = require('./util/IOTools')
const Tools = require('./util/Tools')
const AdminTools = require('./util/AdminTools')
const info = require('./package.json')
const Canvas = require('canvas')
const Moment = require('moment')

const insultCompliment = require('insult-compliment')

const ioTools = new IOTools()
const tools = new Tools()
const adminTools = new AdminTools()

const reddit = require('redwrap')

const roleNames = config.roleNames
const Eris = require('eris')

// For crash logging
const Raven = require('raven')
Raven.config('https://48c87e30f01f45a7a112e0b033715f3d:d9b9df5b82914180b48856a41140df34@sentry.io/181885').install()

const NodeRestClient = require('node-rest-client').Client

const popura = require('popura')
const malClient = popura(config.malUsername, config.malPassword)

let PowerWashingLinks = []

// Bot declaration
const bot = new Eris.CommandClient(config.token, {}, {
  defaultHelpCommand: false,
  description: info.description,
  owner: config.owner,
  prefix: config.prefix,
  name: 'Tron'
})

/**
 * Returns the default command options for most commands. Sets the cooldown and
 * cooldown message to the values set in the project config.json. Accepts an
 * optional array of aliases to be included for the command.
 *
 * @example commandOptions(['pang', 'peng', 'pling'])
 * @param {*} aliasesIn
 */
const commandOptions = aliasesIn => {
  return {
    aliases: aliasesIn,
    cooldown: config.DEFAULT_COOLDOWN,
    cooldownMessage: config.DEFAULT_COOLDOWN_MESSAGE,
    caseInsensitive: true
  }
}

/**
 * Sends a message to the given channel using the bot constant. The first two
 * fields are required as they say where to send what. The third, file, field,
 * is optional as it can be used for sending files.
 *
 * @param {number} channelId
 * @param {*} message
 * @param {*} file
 */
const sendMessage = (channelId, message, file) => {
  bot.createMessage(channelId, message, file).catch(err => {
    if (err) {
      console.log('There was an error when attempting to send a message:')
      console.log(err)
    }
  })
}

const Ship = require('./cmds/Ship')
const ship = new Ship()

const Reactions = require('./cmds/Reactions')
const reactions = new Reactions()

const Marriage = require('./cmds/Marriage')
const marriage = new Marriage()

const Lewds = require('./cmds/Lewds')
const lewds = new Lewds()

const Mute = require('./cmds/Mute')
const muteCmd = new Mute()

const Yaoi = require('./cmds/Yaoi')
const yaoiCmd = new Yaoi()
// #endregion Const and requires declarations

// #region Admin Commands
const adminCmd = bot.registerCommand('admin', (msg, args) => {})
const adminCmdOptions = {
  requirements: {
    roleNames: ['tron-mod', 'Mods']
  }
}

adminCmd.registerSubcommand('user', (msg, args) => {
  tools.getUserFromId(args[0], bot, (user) => {
    if (user !== null) {
      console.log(user)
      user.getDMChannel().then(privChannel => {
        console.log(privChannel)
      })
    }
  })
})

/**
* Command Name: Admin List
* Description : Lists various info for admins, such as the server count using the
* servers argument.
*/
adminCmd.registerSubcommand('list', (msg, args) => {
  if (config.adminids.includes(msg.author.id) && args.length === 1) {
    if (args[0].toLowerCase() === 'servers') {
      return 'Server count = ' + bot.guilds.size
    }
  }
}, adminCmdOptions)

/**
* Command Name: Ban
* Description : Bans a user from the server it is executed on.
*/
adminCmd.registerSubcommand('ban', (msg, args) => {
  if (args.length > 1 && msg.mentions.length > 0) {
    let reason = args.slice(msg.mentions.length).join(' ')

    if (reason.length > 0) {
      msg.mentions.forEach((mention, index, mapObj) => {
        tools.getMember(msg, mention).then((member) => {
          msg.channel.guild.banMember(member.id, 0, reason)

          sendMessage(msg.channel.id, member.username + ' has been banned from the server.')
        })
      })
    } else {
      msg.mentions.forEach((mention, index, mapObj) => {
        tools.getMember(msg, mention).then((member) => {
          msg.channel.guild.banMember(member.id)

          sendMessage(msg.channel.id, member.username + ' has been banned from the server.')
        })
      })
    }
  } else if (msg.mentions.length > 0) {
    msg.mentions.forEach((mention, index, mapObj) => {
      tools.getMember(msg, mention).then((member) => {
        msg.channel.guild.banMember(member.id)

        sendMessage(msg.channel.id, member.username + ' has been banned from the server.')
      })
    })
  } else {
    return 'Please mention at least one user to ban and an optional reason after the mentioned user(s).'
  }
}, adminCmdOptions)

/**
* Command Name: Kick User
* Description : Kicks the mentioned users from the server the command is executed
* on.
*/
adminCmd.registerSubcommand('kick', (msg, args) => {
  if (args.length > 1 && msg.mentions.length > 0) {
    let reason = args.slice(msg.mentions.length).join(' ')

    if (reason.length > 0) {
      msg.mentions.forEach((mention, index, mapObj) => {
        tools.getMember(msg, mention).then((member) => {
          msg.channel.guild.kickMember(member.id, reason)

          sendMessage(msg.channel.id, member.username + ' has been kicked from the server.')
        })
      })
    } else {
      msg.mentions.forEach((mention, index, mapObj) => {
        tools.getMember(msg, mention).then((member) => {
          msg.channel.guild.kickMember(member.id)

          sendMessage(msg.channel.id, member.username + ' has been kicked from the server.')
        })
      })
    }
  } else if (msg.mentions.length > 0) {
    msg.mentions.forEach((mention, index, mapObj) => {
      tools.getMember(msg, mention).then((member) => {
        msg.channel.guild.kickMember(member.id)

        sendMessage(msg.channel.id, member.username + ' has been kicked from the server.')
      })
    })
  } else {
    return 'Please mention at least one user to kick and an optional reason after the mentioned user(s).'
  }
}, adminCmdOptions)

/**
* Command Name: Initialize
* Description : Some early alpha stage stuff when I working on RSS feeds. Only
* leaving it in case it becomes useful when I come back to adding web comic
* support.
* Requested By: Me? I think.
*/
bot.registerCommand('initialize', (msg, args) => {
  if (msg.author.id === config.owner) {
    adminTools.initializeServer(bot, msg).then(success => {
      if (success) sendMessage(msg.channel.id, 'Server initialized!')
    })
  }
}, {
  aliases: ['init']
})

/**
 * Evaluates and returns the given args value as Javascript.
 * @param {*} args
 */
const evaluate = (msg, args) => {
  try {
    return eval(args.join(' '))
  } catch (err) {
    return err.message
  }
}

/**
* Command Name: Evaluate
* Description : The eval command for Tron that is *only* available to me (Alcha).
* Requested By: Alcha (heh)
*/
bot.registerCommand('evaluate', (msg, args) => {
  if (msg.author.id === config.owner) {
    sendMessage(msg.channel.id, '`' + evaluate(msg, args) + '`', undefined)
  }
}, {
  aliases: ['eval']
})

/**
* Command Name: Mute
* Description : Will mute all of the users mentioned in the message using the
    tron-mute role.
* Requested By: Alcha
*/
bot.registerCommand('mute', (msg, args) => {
  if (msg.mentions[0] !== undefined && msg.channel.guild !== undefined) {
    msg.mentions.forEach((user, index, array) => {
      muteCmd.muteUser(msg, user).then((muted) => {
        if (muted) {
          sendMessage(msg.channel.id, {
            embed: {
              description: '**' + user.username + '** has been muted from text and voice by **' + msg.author.username + '**.',
              color: 0x008000
            }
          })
        }
      })
    })
  } else {
    return 'Please mention at least one user to mute.'
  }
}, adminCmdOptions)

/**
* Command Name: Unmute
* Description : Will unmute all mentioned users.
* Requested By: Alcha
*/
bot.registerCommand('unmute', (msg, args) => {
  if (msg.mentions[0] !== undefined && msg.channel.guild !== undefined) {
    msg.mentions.forEach((user, index, array) => {
      muteCmd.unmuteUser(msg, user).then((muted) => {
        if (muted) {
          sendMessage(msg.channel.id, {
            embed: {
              description: '**' + user.username + '** has been unmuted from text and voice by **' + msg.author.username + '**.',
              color: 0x008000
            }
          })
        }
      })
    })
  } else {
    return 'Please mention at least one user to mute.'
  }
}, adminCmdOptions)
// #endregion Admin Commands

// #region Commands in Test
/**
* Command Name: Affix
* Description : Displays specific information about a mythic affix in
* Requested By:
*/

// ========================== LoL API Commands ================================================== //
const LoLAid = require('./cmds/LoL')
const lolAid = new LoLAid()

let lolCmd = bot.registerCommand('lol', (msg, args) => {

})

lolCmd.registerSubcommand('matches', (msg, args) => {
  let username = tools.concatArgs(args)

  lolAid.getMatchlistBySummonerName(username, 10)
    .then(data => {
      console.log('data.length = ' + data.length)
      let message = 'A list of the requested users last ten games:\n'

      for (let x = 0; x < data.length; x++) {
        message += '- Game id: ' + data[x].gameId + '\n'
        message += '  - Role: ' + data[x].role + '\n'
        message += '  - Lane: ' + data[x].lane + '\n\n'
      }

      sendMessage(msg.channel.id, message)
    })
    .catch(err => {
      console.log(err)
      sendMessage(msg.channel.id, 'Unfortunately, there was an error: ' + err.message)
    })
})

let convertContentFilter = guild => {
  switch (guild.explicitContentFilter) {
    case 0:
      return 'OFF'

    case 1:
      return 'On for people without roles'

    case 2:
      return 'On for all'

    default:
      break
  }
}

bot.registerCommand('server', (msg, args) => {
  let guild = msg.channel.guild
  let member
  if (msg.member !== undefined) member = msg.member
  else member = msg.author

  let guildOwner

  if (parseInt(msg.author.id) === 140183864076140544) {
    guildOwner = '<@' + msg.author.id + '>'
  } else {
    guildOwner = '<@' + guild.ownerID + '>'
  }

  sendMessage(msg.channel.id, {
    'embed': {
      'title': guild.name,
      'description': 'Server Id: ' + guild.id + '\nServer Region: ' + guild.region.toUpperCase(),
      'color': 4682777,
      'timestamp': new Moment().toDate(),
      'thumbnail': {
        'url': guild.iconURL
      },
      'author': {
        'name': member.username,
        'icon_url': member.avatarURL
      },
      'fields': [{
        'name': 'Explicit Content Filter',
        'value': convertContentFilter(guild),
        'inline': true
      },
      {
        'name': 'Emojis',
        'value': guild.emojis.length,
        'inline': true
      },
      {
        'name': 'Members',
        'value': guild.members.size,
        'inline': true
      },
      {
        'name': 'Roles',
        'value': guild.roles.size,
        'inline': true
      },
      {
        'name': 'Tron Joined On',
        'value': new Moment(guild.joinedAt).format('MMMM Do YYYY @ HH:mm:ss')
      },
      {
        'name': 'Server Created On',
        'value': new Moment(guild.createdAt).format('MMMM Do YYYY @ HH:mm:ss')
      },
      {
        'name': 'Currently Owned By',
        'value': guildOwner
      }
      ]
    }
  })
}, {
  caseInsensitive: true
})

// ========================== Trivia Game Command =============================================== //
const Trivia = require('./cmds/Trivia')
const trivia = new Trivia()
const Entities = require('html-entities').AllHtmlEntities
const entities = new Entities()

let triviaCmd = bot.registerCommand('trivia', (msg, args) => {
  return tools.incorrectUsage(msg, '+trivia <start | stop | categories>', '+trivia start')
}, {
  caseInsensitive: true
})

triviaCmd.registerSubcommand('start', (msg, args) => {
  if (args.length === 1) {
    trivia.getQuestions(parseInt(args[0])).then(questions => {
      const answers = tools.shuffle([
        questions[0].correct_answer,
        questions[0].incorrect_answers[0],
        questions[0].incorrect_answers[1],
        questions[0].incorrect_answers[2]
      ])

      const content = entities.decode(questions[0].question) + '\n\n' +
      '```\n' + '1. ' + entities.decode(answers[0]) + '\n' +
      '2. ' + entities.decode(answers[1]) + '\n' +
      '3. ' + entities.decode(answers[2]) + '\n' +
      '4. ' + entities.decode(answers[3]) + '```'

      bot.createMessage(msg.channel.id, content).then(msg => {
        console.log('Message sent.')
      }).catch(err => console.log(err))
    }).catch(err => console.log(err))
  } else {
    // Incorrect command usage, display help info
    return tools.incorrectUsage(msg, '+trivia start <category id>', '+trivia start 1', 'Get a list of categories with `+trivia categories`')
  }
}, {
  caseInsensitive: true
})

triviaCmd.registerSubcommand('categories', (msg, args) => {
  return trivia.categories
}, {
  aliases: ['cat', 'cats'],
  caseInsensitive: true
})

// ========================== Meme Command ====================================================== //
const memeClient = new NodeRestClient()
let memeCmd = bot.registerCommand('meme', (msg, args) => {

}, {
  caseInsensitive: true
})

memeCmd.registerSubcommand('doge', (msg, args) => {
  let url = 'https://api.imgflip.com/caption_image'
  let opts = {
    template_id: 8072285,
    username: 'Alcha',
    password: config.imgFlipPass,
    text0: 'This is a test.',
    text1: 'this is also a test'
  }
  memeClient.post(url, opts, (data, resp) => {
    console.log(data)
  })
}, {
  caseInsensitive: true
})

// #endregion Commands in Test

// #region User Commands
/**
* Command Name: Dreamy
* Description : Returns a random image from a collection given to me by Dreamy.
* Requested By: Dreamy
*/
bot.registerCommand('dreamy', (msg, args) => {
  reactions.pickDreamyImage((dreamyImage) => {
    sendMessage(msg.channel.id, undefined, {
      file: dreamyImage,
      name: 'Dreamy.gif'
    })
  })

  ioTools.incrementCommandUse('dreamy')
}, commandOptions)

/**
* Command Name: Kayla/Yoana
* Description : Displays a random gif selected by Snow/Yoana.
* Requested By: Snow
*/
bot.registerCommand('kayla', (msg, args) => {
  if (parseInt(msg.author.id) === 142092834260910080 || parseInt(msg.author.id) === 217870035090276374 || msg.author.id === config.owner) {
    reactions.pickKaylaImage().then(img => {
      sendMessage(msg.channel.id, undefined, {
        file: img,
        name: 'Kayla.gif'
      })
    })
  } else {
    return 'This command is unavailable to you.'
  }
}, commandOptions(['yoana']))

/**
* Command Name: Zorika
* Description : Returns a random phrase that Zori wants.
* Requested By: Zorika/Zori
*/
bot.registerCommand('zorika', (msg, args) => {
  return 'God Damn It Jay!'
}, commandOptions(['zori']))

/**
* Command Name: Jay
* Description : Returns an image of Stitch.
*/
bot.registerCommand('jay', (msg, args) => {
  ioTools.getImage('/home/alcha/tron/images/Jay.png', (img) => {
    sendMessage(msg.channel.id, undefined, {
      file: img,
      name: 'Jay.png'
    })
  })
}, commandOptions(['jaydawg', 'dajaydawg']))

/**
* Command Name: Key
* Description : Returns a random image that Key has placed in his key folder.
* Requested By: Key
*/
bot.registerCommand('key', (msg, args) => {
  if (!isNaN(parseInt(args[0]))) {
    reactions.pickKeyImage(args[0]).then((data) => {
      sendMessage(msg.channel.id, undefined, data)
    })
  } else {
    reactions.pickKeyImage().then((data) => {
      sendMessage(msg.channel.id, undefined, data)
    })
  }
}, {
  caseInsensitive: true
})

/**
* Command Name: Ami
* Description : Returns whatever Ami has requested.
* Requested By: Ami
*/
bot.registerCommand('ami', (msg, args) => {
  return '𝓽𝓱𝓮 𝓲𝓶𝓹𝓾𝓻𝓮 𝓱𝓮𝓷𝓽𝓪𝓲 𝓺𝓾𝓮𝓮𝓷'
}, commandOptions)

/**
 * Command Name: Rose
 * Description : Returns a random image that Rose has stored in her rose folder.
 * Requested By: PrimRose/WolfieRose
 */
bot.registerCommand('rose', (msg, args) => {
  if (!isNaN(parseInt(args[0]))) {
    reactions.pickRoseImage((img, filename) => {
      sendMessage(msg.channel.id, undefined, {
        file: img,
        name: filename
      })
    }, args[0])
  } else {
    reactions.pickRoseImage((img, filename) => {
      sendMessage(msg.channel.id, undefined, {
        file: img,
        name: filename
      })
    })
  }

  ioTools.incrementCommandUse('rose')
}, commandOptions(['eevee']))

// ========================== Alcha Command (Requested by Utah) ================================= //
bot.registerCommand('alcha', (msg, args) => {
  if (!isNaN(parseInt(args[0]))) {
    reactions.pickJerryImage(args[0]).then((data) => {
      sendMessage(msg.channel.id, undefined, data)
    })
  } else {
    reactions.pickJerryImage().then((data) => {
      sendMessage(msg.channel.id, undefined, data)
    })
  }

  ioTools.incrementCommandUse('alcha')
}, commandOptions(['morty', 'jerry']))

// ========================== Foupa Command ===================================================== //
bot.registerCommand('foupa', (msg, args) => {
  if (!isNaN(parseInt(args[0]))) {
    reactions.pickFoupaImage(args[0]).then((data) => {
      sendMessage(msg.channel.id, undefined, data)
    })
  } else {
    reactions.pickFoupaImage().then((data) => {
      sendMessage(msg.channel.id, undefined, data)
    })
  }
}, {
  aliases: ['friendlyneighborhoodpedo'],
  requirements: {
    userIDs: ['219270060936527873', '159844469464760320']
  },
  caseInsensitive: true,
  permissionMessage: 'This command is unavailable to you.',
  cooldown: config.DEFAULT_COOLDOWN,
  cooldownMessage: config.DEFAULT_COOLDOWN_MESSAGE
})

// ========================== Utah Command ====================================================== //
bot.registerCommand('utah', (msg, args) => {
  if (msg.channel.guild !== undefined) {
    if (parseInt(msg.channel.guild.id) === 254496813552238594) {
      sendMessage(msg.channel.id, '<@139474184089632769> <:Tiggered:256668458480041985>')
    } else if (parseInt(msg.channel.guild.id) === 197846974408556544) {
      sendMessage(msg.channel.id, '<@139474184089632769> <:Tiggered:298313391444066305>')
    } else if (parseInt(msg.channel.guild.id) === 325420023705370625) {
      sendMessage(msg.channel.id, '<@139474184089632769> <:Tiggered:327634830483259393>')
    } else {
      console.log('Guild = ' + msg.channel.guild.name)
      console.log('id = ' + msg.channel.guild.id)
    }

    ioTools.incrementCommandUse('utah')
  }
}, commandOptions)

// ========================== Alex Command ====================================================== //
bot.registerCommand('alex', (msg, args) => {
  if (msg.channel.guild !== undefined) {
    if (parseInt(msg.channel.guild.id) === 254496813552238594) {
      sendMessage(msg.channel.id, '<@!191316261299290112> 🖕')
      ioTools.incrementCommandUse('alex')
    }
  }
}, commandOptions)

bot.registerCommand('batts', (msg, args) => {
  if (!isNaN(parseInt(args[0]))) {
    reactions.pickBattsieImage(args[0]).then((data) => {
      sendMessage(msg.channel.id, undefined, data)
    })
  } else {
    reactions.pickBattsieImage().then((data) => {
      sendMessage(msg.channel.id, undefined, data)
    })
  }
}, commandOptions(['battsie']))

bot.registerCommand('derp', (msg, args) => {
  return 'Is loved by <@219270060936527873> more than anyone.'
}, commandOptions)

bot.registerCommand('potato', (msg, args) => {
  ioTools.getImage('/home/alcha/tron/images/potato.png', (img) => {
    sendMessage(msg.channel.id, undefined, {
      file: img,
      name: 'Potato.png'
    })
  })
}, commandOptions)
// #endregion User Commands

// #region Feature Commands
/**
* Command Name: Bot
* Description : Lists bot info.
* Requested By: Alcha
*/
bot.registerCommand('bot', (msg, args) => {
  let member
  if (msg.member !== undefined) member = msg.member
  else member = msg.author

  const pkg = require('./package')
  const erisVersion = require('eris/package.json').version

  sendMessage(msg.channel.id, {
    'embed': {
      'title': bot.user.username,
      'description': pkg.description,
      'url': 'https://paranoiddevs.com/tron',
      'color': 4682777,
      'timestamp': new Moment().toDate(),
      'footer': {
        'icon_url': bot.user.avatarURL,
        'text': 'Tron ' + info.version
      },
      'thumbnail': {
        'url': bot.user.avatarURL
      },
      'author': {
        'name': member.username,
        'icon_url': member.avatarURL
      },
      'fields': [{
        'name': 'Server Count',
        'value': bot.guilds.size,
        'inline': true
      }, {
        'name': 'User Count',
        'value': tools.numberWithCommas(bot.users.size),
        'inline': true
      }, {
        'name': 'Uptime',
        'value': tools.numberWithCommas(Math.round(bot.uptime / 1000 / 60)) + ' mins',
        'inline': true
      }, {
        'name': 'Eris Version',
        'value': erisVersion,
        'inline': true
      }]
    }
  })
})

const quoteCmd = bot.registerCommand('quote', (msg, args) => {
  ioTools.readFile('/home/alcha/tron/Quotes.txt', (content) => {
    if (content !== undefined) {
      let temp = content.split('\n')
      let random = tools.getRandom(0, temp.length)

      sendMessage(msg.channel.id, temp[random])
    }
  })
}, commandOptions(['quotes']))

quoteCmd.registerSubcommand('cm', (msg, args) => {
  ioTools.readFile('CM_Quotes.txt', (content) => {
    let temp = content.split('\n')
    let random = tools.getRandom(0, temp.length)

    sendMessage(msg.channel.id, temp[random])
  })
}, commandOptions)

/**
* Command Name: Ping
* Description : Pings the bot.
*/
bot.registerCommand('ping', (msg, args) => {
  return 'Pong!'
}, {
  description: 'Pong!',
  fullDescription: 'Used to check if the bot is up.'
})

/**
* Command Name: Invite
* Description : Returns the link to invite Tron to another server.
*/
bot.registerCommand('invite', (msg, args) => {
  return 'Would you like me to join your server? :smiley: \n' + config.invitelink
}, commandOptions)

/**
* Command Name: Stats
* Description : Returns the overall stats of command usage or the numbers for a
* particular command.
*/
bot.registerCommand('stats', (msg, args) => {
  if (args.length === 0) {
    ioTools.getAllCommandUsage((results) => {
      let fields = []

      for (let i = 0; i < results.length; i++) {
        fields[i] = {
          name: results[i].COMMAND_NAME,
          value: results[i].COMMAND_USE_COUNT,
          inline: true
        }
      }

      sendMessage(msg.channel.id, {
        embed: {
          title: 'Command Stats', // Title of the embed
          description: "Here's a list of the commands available and how many times they've been used.",
          color: 0x008000, // Color, either in hex (show), or a base-10 integer
          fields: fields
        }
      })
    })
  } else {
    ioTools.getCommandUsage(args[0], (results) => {
      if (results[0] !== undefined) {
        sendMessage(msg.channel.id, {
          embed: {
            color: 0x008000,
            fields: [{
              name: results[0].COMMAND_NAME,
              value: results[0].COMMAND_USE_COUNT
            }]
          }
        })
      } else {
        sendMessage(msg.channel.id, 'Please use a valid command, this does not exist in the database.')
      }
    })
  }

  ioTools.incrementCommandUse('stats')
}, commandOptions(['stat']))

/**
* Command Name: RateWaifu
* Description : Randomly rates a user on a scale of 0 - 10. Some "special" users
* have their scores locked to interesting replies. When a special case is added,
* I do my best to place their name in a comment to make later debugging much
* easier.
* Requested By: Bella and Kayla
*/
bot.registerCommand('ratewaifu', (msg, args) => {
  tools.doesMsgContainShu(msg).then((shuFlag) => {
    if (shuFlag) {
      sendMessage(msg.channel.id, 'You have mentioned a user who does not wish to be mentioned. Please refrain from doing this in the future.')
    } else {
      if (msg.channel.guild !== undefined && msg.mentions.length === 1) {
        switch (parseInt(msg.mentions[0].id)) {
          case 219270060936527873:    // Alcha
            sendMessage(msg.channel.id, '**' + msg.mentions[0].username + '**-senpai, I\'d rate you 11/10. \n\n_notice me_')
            break
          case 317138587491631104:    // Travis
            sendMessage(msg.channel.id, '**' + msg.mentions[0].username + '**-dono, I\'d rate you 11/10. :fire:')
            break
          case 158740486352273409:    // Micaww
            sendMessage(msg.channel.id, '**' + msg.mentions[0].username + "**, I'd rate you 0/10 waifu.")
            break
          case 142092834260910080:    // Snow/Daddy Yoana
            sendMessage(msg.channel.id, '**' + msg.mentions[0].username + "**, I'd rate you -69/10 waifu.")
            break
          case 146023112008400896:    // Aaron/Mamba
            sendMessage(msg.channel.id, '**' + msg.mentions[0].username + '**, I\'d rate you 0/10 waifu.')
            break
          case 120797492865400832:    // Bella
            sendMessage(msg.channel.id, '**' + msg.mentions[0].username + "**, I'd rate you 12/10 waifu. :fire: :fire:")
            break
          case 139474184089632769:    // Utah
            sendMessage(msg.channel.id, '**' + msg.mentions[0].username + "**, I'd rate you -∞/10 waifu.")
            break
          case 167546638758445056:    // DerpDeSerp
            sendMessage(msg.channel.id, '**' + msg.mentions[0].username + "**, I'd rate you ∞/10 waifu. The best of the best.")
            break
          case 351967369247326209:    // Heather/Kristina
            sendMessage(msg.channel.id, '**' + msg.mentions[0].username + "**, I'd rate you " + tools.getRandom(6, 11) + '/10 waifu.')
            break
          case 271499964109029377:    // Daddy Zee
            sendMessage(msg.channel.id, '**' + msg.mentions[0].username + '**, I\'d rate you ' + tools.getRandom(8, 13) + '/10 waifu.')
            break

          default:
            const random = tools.getRandom(0, 11)
            const message = '**' + msg.mentions[0].username + "**, I'd rate you " + random + '/10 waifu.'

            sendMessage(msg.channel.id, message)
            break
        }
      }
    }

    ioTools.incrementCommandUse('rate')
  })
}, commandOptions(['rate']))

/**
* Command Name: Git
* Description : Returns a link to the Github repository for Tron.
*/
bot.registerCommand('git', (msg, args) => {
  sendMessage(msg.channel.id, 'You can find the git repo for Tron here: https://github.com/Paranoid-Devs/Tron')

  ioTools.incrementCommandUse('git')
}, commandOptions(['repo', 'github', 'codebase']))

// #region Role Based Commands
/**
* Command Name: Add Role
* Description : Add a role to the list of currently available roles on a given
* server. Only usable by those with the tron-mod role or server administration
* privelages.
*/
bot.registerCommand('addr', (msg, args) => {
  if (msg.channel.guild !== null) {
    if (tools.memberIsMod(msg)) {
      const comparison = tools.concatArgs(args)
      const roles = msg.channel.guild.roles

      roles.forEach((value, key, mapObj) => {
        if (value.name !== null) {
          const name = value.name.toLowerCase()

          if (name === comparison) {
            roleNames.push(value.name)
            sendMessage(msg.channel.id, 'Added ' + value.name + ' to list of available roles.')
          }
        }
      })
    }
  }
}, commandOptions(['addrole', 'plusrole']))

/**
* Command Name: List Roles
* Description : Returns a list of the currently available
* Requested By:
*/
bot.registerCommand('listr', (msg, args) => {
  let message = 'List of currently available roles:\n'

  roleNames.forEach((curr, index, arr) => {
    message += '- **' + curr + '**\n'
  })

  sendMessage(msg.channel.id, message)
}, {
  caseInsensitive: true,
  description: 'List roles that are available to join.',
  fullDescription: 'Lists the roles that have been added by an administrator that are available.'
})

/**
* Command Name: Leave Role
* Description : Leaves a role or roles that have been specified by the user.
* Requested By:
*/
bot.registerCommand('leaver', (msg, args) => {
  let comparison = tools.concatArgs(args)

  if (msg.channel.guild !== null) {
    let userId = msg.author.id

    if (comparison === 'all') {
      tools.removeAllRoles(userId, msg, bot)
    } else {
      let roleId = tools.getRoleId(msg, comparison)

      if (roleId.length > 1) {
        if (tools.allowedRole(comparison)) {
          msg.channel.guild.removeMemberRole(userId, roleId)
          sendMessage(msg.channel.id, ":outbox_tray: You've successfully been removed from your requested group.")
          msg.delete()
          ioTools.incrementCommandUse('leaver')
        }
      }
    }
  }
}, {
  caseInsensitive: true,
  description: 'Leave a role.',
  fullDescription: 'Used to leave a specific role, usually to also leave an associated channel.'
})

/**
* Command Name: Join Role
* Description : Allows a user to join a role for any number of reasons.
*/
bot.registerCommand('joinr', (msg, args) => {
  let comparison = tools.concatArgs(args)

  if (msg.channel.guild !== undefined) {
    let userId = msg.author.id

    if (comparison === 'all') {
      tools.addAllRoles(userId, msg, bot)
    } else {
      let roleId = tools.getRoleId(msg, comparison)

      if (roleId.length > 1) {
        if (tools.allowedRole(comparison)) {
          msg.channel.guild.addMemberRole(userId, roleId)
          sendMessage(msg.channel.id, ":inbox_tray: You've successfully been added to your requested group.")
          msg.delete()
          ioTools.incrementCommandUse('joinr')
        }
      }
    }
  }
}, commandOptions)
// #endregion Role Based Commands

/**
* Command Name: Avatar
* Description : Attemptes to retrieve a 1024x1024 version of the mentioned user
* in the provided msg object. If there isn't an image of that size, the next
* largest is located and returned.
* Requested By: Battsie
*/
bot.registerCommand('Avatar', (msg, args) => {
  if (msg.mentions.length === 1) {
    let url = msg.mentions[0].dynamicAvatarURL(null, 1024)
    let origFilename = url.substring(url.lastIndexOf('/') + 1, url.lastIndexOf('?'))

    ioTools.downloadFiles([{
      url: url,
      dest: '/home/alcha/tron/images/avatar/' + origFilename
    }], (filenames) => {
      filenames.forEach((filename, key, array) => {
        ioTools.getImage(filename, (image) => {
          sendMessage(msg.channel.id, undefined, {
            file: image,
            name: origFilename
          })
        })
      })
    })
  } else {
    return 'Please only mention one user at a time.'
  }
}, {
  cooldown: config.DEFAULT_COOLDOWN,
  cooldownMessage: config.DEFAULT_COOLDOWN_MESSAGE,
  aliases: ['profile'],
  caseInsensitive: true
})

/**
* Command Name: Ship
* Description : Ship two users and generate a random couple name for them.
*/
bot.registerCommand('Ship', (msg, args) => {
  tools.doesMsgContainShu(msg).then((shuFlag) => {
    if (shuFlag) {
      sendMessage(msg.channel.id, 'You have mentioned a user who does not wish to be mentioned. Please refrain from doing this in the future.')
    } else {
      if (msg.channel.guild !== undefined && msg.mentions.length === 2) {
        const urls = [msg.mentions[0].avatarURL, msg.mentions[1].avatarURL]

        ship.getShipImages(urls, (images) => {
          let avatarCanvas = new Canvas(384, 128)
          let ctx = avatarCanvas.getContext('2d')

          for (let i = 0; i < 3; i++) {
            ctx.drawImage(images[i], (i * 128), 0, 128, 128)

            if (i === 2) {
              ship.getShipName(msg, (shipName) => {
                let shipMsg = 'Lovely shipping!\n' +
                  'Ship name: **' + shipName + '**'

                sendMessage(msg.channel.id, shipMsg, {
                  file: avatarCanvas.toBuffer(),
                  name: shipName + '.png'
                })
              })
            }
          }
        })
      }
    }

    ioTools.incrementCommandUse('ship')
  })
}, {
  caseInsensitive: true,
  cooldown: config.DEFAULT_COOLDOWN,
  cooldownMessage: config.DEFAULT_COOLDOWN_MESSAGE,
  description: 'Ship two users.',
  fullDescription: 'Takes the two mentioned users and mashes their names into a lovely mess.'
})

/**
* Command Name: Reddit
* Description : Allows users to select a random image from a given subreddit.
*/
bot.registerCommand('reddit', (msg, args) => {
  let subreddit = args.join('')

  reddit.r(subreddit).sort('top').from('day').limit(50, (err, data, res) => {
    if (err) {
      console.log(err)
      return
    }
    let randomPost = tools.getRandom(0, data.data.children.length)

    if (data.data.children[randomPost] !== undefined) {
      if (data.data.children[randomPost].data.over_18 && !msg.channel.nsfw) {
        sendMessage(msg.channel.id, 'It appears the result of this search is NSFW and this channel is not flagged for NSFW content. Please try in another channel.')
      } else {
        sendMessage(msg.channel.id, data.data.children[randomPost].data.url)
      }
    } else {
      console.log('data.data.children[randomPost].data===undefined')
      console.log('subreddit = ' + subreddit)
      console.log('randomPost = ' + randomPost)
      console.log(data.data.children)
      sendMessage(msg.channel.id, 'Unfortunately, something went wrong and the developers have been alerted. Please try again.')
    }

    ioTools.incrementCommandUse('reddit')
  })
}, commandOptions(['r']))

// ========================= Suggestion Command ================================================= //
const mongo = require('mongodb').MongoClient
const mongoInsertSuggestion = (suggestion, db, cb) => {
  db.collection('suggestions').insertOne({
    'author': suggestion.author,
    'timestamp': suggestion.timestamp,
    'content': suggestion.content
  }, (err, res) => {
    if (err) console.log(err)
    else cb()
  })
}

const listCmd = bot.registerCommand('list', (msg, args) => {

})

listCmd.registerSubcommand('suggestions', (msg, args) => {
  if (msg.author.id === config.owner) {
    mongo.connect(config.mongoURI, (err, db) => {
      if (err) console.log(err)
      else {
        let cursor = db.collection('suggestions').find()
        cursor.each((err, doc) => {
          if (doc !== null) console.log(doc)
          if (err) console.log(err)
        })
      }
    })
  }
})

bot.registerCommand('suggestion', (msg, args) => {
  mongo.connect(config.mongoURI, (err, db) => {
    if (err) {
      console.log('There was an error attempting to connect to the MongoDB:\n')
      console.log(err.errors)
    } else {
      mongoInsertSuggestion({
        'author': msg.author.username,
        'timestamp': msg.timestamp,
        'content': tools.concatArgs(args)
      }, db, () => {
        tools.getUserFromId(config.owner, bot, owner => {
          owner.getDMChannel().then(dmChannel => {
            sendMessage(dmChannel.id, ':inbox_tray: A suggestion has been received!')
          })
        })

        sendMessage(msg.channel.id, 'Your suggestion has been received, thank you!')
      })
    }
  })
}, {
  argsRequired: true,
  caseInsensitive: true,
  description: 'Provide a suggestion to the bot authors.',
  fullDescription: 'Provide a suggestion for a command or new feature you would like to see in Tron.',
  guildOnly: false,
  usage: '`+suggestion Give me all your money.`'
})

let malCmd = bot.registerCommand('mal', (msg, args) => {})

let malSearchCmd = malCmd.registerSubcommand('search', (msg, args) => {})

malSearchCmd.registerSubcommand('anime', (msg, args) => {
  if (args.length === 0) {

  } else {
    let name = tools.concatArgs(args)

    malClient.searchAnimes(name).then(animes => {
      animes.forEach((anime, index, map) => {
        let animeUrl = 'https://myanimelist.net/anime/' + anime.id + '/' + anime.title.replace(/ /g, '_')

        sendMessage(msg.channel.id, {
          embed: {
            title: anime.title,
            description: 'Score: **' + anime.score.toString() + '**',
            color: 0x336699,
            url: animeUrl,
            fields: [ // Array of field objects
              {
                name: 'Type',
                value: anime.type,
                inline: true
              },
              {
                name: 'Episodes',
                value: anime.episodes,
                inline: true
              },
              {
                name: 'Status',
                value: anime.status,
                inline: true
              },
              {
                name: 'Synopsis',
                value: anime.synopsis,
                inline: false
              }
            ],
            footer: {
              text: 'Data retrieved from MyAnimeList.net.',
              icon_url: 'https://myanimelist.cdn-dena.com/images/faviconv5.ico'
            }
          }
        })
      })
    }).catch(err => console.log(err))
  }
})

malSearchCmd.registerSubcommand('manga', (msg, args) => {
  if (args.length === 0) {

  } else {
    let name = tools.concatArgs(args)

    malClient.searchMangas(name).then(mangas => {
      mangas.forEach((manga, index, map) => {
        if (index + 1 !== mangas.length) {
          let synopsis
          let type
          let volumes
          let status
          let score
          let title
          let image

          if (manga.synopsis === null || manga.synopsis === undefined || manga.synopsis.length < 2) {
            synopsis = 'N/A'
          } else {
            synopsis = manga.synopsis.replace(/\[\/?i]/g, '_')
              .replace(/\[\/?b]/g, '**')
              .replace(/(\[url=)/g, '(')
              .replace(/]\b/g, ') ')
              .replace(/(\[\/url\])/g, ' ')
          }

          if (manga.type === null) type = 'N/A'
          else type = manga.type

          if (manga.volumes === null) volumes = 'N/A'
          else volumes = manga.volumes

          if (manga.status === null) status = 'N/A'
          else status = manga.status

          if (manga.score === undefined || manga.score === null || manga.score.length === 0) score = 'N/A'
          else score = manga.score

          if (manga.title === undefined || manga.title === null || manga.title.length < 2) title = 'N/A'
          else title = manga.title

          if (manga.image === undefined || manga.image === null || manga.image.length < 2) image = 'N/A'
          else image = manga.image

          let mangaUrl = 'https://myanimelist.net/manga/' + manga.id + '/' + title.replace(/ /g, '_')

          sendMessage(msg.channel.id, {
            embed: {
              title: title,
              thumbnail: {
                url: image
              },
              description: 'Score: **' + score.toString() + '**',
              color: 0x336699,
              url: mangaUrl,
              fields: [ // Array of field objects
                {
                  name: 'Type',
                  value: type,
                  inline: true
                },
                {
                  name: 'Volumes',
                  value: volumes,
                  inline: true
                },
                {
                  name: 'Status',
                  value: status,
                  inline: true
                },
                {
                  name: 'Synopsis',
                  value: synopsis,
                  inline: false
                }
              ],
              footer: {
                text: 'Data retrieved from MyAnimeList.net.',
                icon_url: 'https://myanimelist.cdn-dena.com/images/faviconv5.ico'
              }
            }
          }).catch((err) => {
            console.log('Error occured searching for manga.')
            console.log(err)
          })
        }
      })
    }).catch(err => console.log(err))
  }
}, commandOptions)

/* let malUserCmd = */
malCmd.registerSubcommand('user', (msg, args) => {
  if (args.length === 0) {
    sendMessage(msg.channel.id, 'You must include the username of an account on MAL.')
  } else {
    let username = args[0]
    if (args[1] !== undefined && args[1].toLowerCase() === 'anime') {
      malClient.getAnimeList(username).then((res) => {
        let fields = []
        res.list.sort((a, b) => {
          if (a.my_score > b.my_score) return 1
          else if (a.my_score < b.my_score) return -1
          else return 0
        })

        for (let i = res.list.length; fields.length < 30; i--) {
          if (res.list[i] !== undefined && res.list[i].my_score !== 0) {
            fields.push({
              name: res.list[i].series_title,
              value: res.list[i].my_score,
              inline: true
            })
          }
        }

        sendMessage(msg.channel.id, {
          embed: {
            title: 'Currently watching ' + res.myinfo.user_watching + ' anime.', // Title of the embed
            description: 'Has spent ' + res.myinfo.user_days_spent_watching + ' days watching anime.',
            author: { // Author property
              name: res.myinfo.user_name,
              url: 'https://myanimelist.net/profile/' + res.myinfo.user_name,
              icon_url: 'https://myanimelist.cdn-dena.com/images/userimages/' + res.myinfo.user_id + '.jpg'
            },
            color: 0x336699,
            fields: fields,
            footer: {
              text: 'Data retrieved from MyAnimeList.net.',
              icon_url: 'https://myanimelist.cdn-dena.com/images/faviconv5.ico'
            }
          }
        }).catch(err => console.log(err))
      }).catch(err => {
        console.log(err)
        sendMessage(msg.channel.id, 'Unfortunately, it appears this username does not exist. Please verify and try again.')
      })
    } else if (args[1] !== undefined && args[1].toLowerCase() === 'manga') {
      malClient.getMangaList(username).then((res) => {
        let fields = []

        res.list.sort((a, b) => {
          if (a.my_score < b.my_score) return 1
          else if (a.my_score > b.my_score) return -1
          else return 0
        })

        res.list.forEach((manga, index, map) => {
          if (manga.my_score === 0 && manga.my_status === 2) {
            fields.push({
              name: manga.series_title,
              value: manga.my_score,
              inline: true
            })
          } else if (manga.my_score !== 0) {
            fields.push({
              name: manga.series_title,
              value: manga.my_score,
              inline: true
            })
          }
        })

        sendMessage(msg.channel.id, {
          embed: {
            title: 'Currently reading ' + res.myinfo.user_reading + ' manga', // Title of the embed
            description: 'Has spent ' + res.myinfo.user_days_spent_watching + ' days reading manga.',
            url: 'https://myanimelist.net/animelist/' + res.myinfo.user_name + '?status=1',
            author: { // Author property
              name: res.myinfo.user_name,
              url: 'https://myanimelist.net/profile/' + res.myinfo.user_name,
              icon_url: 'https://myanimelist.cdn-dena.com/images/userimages/' + res.myinfo.user_id + '.jpg'
            },
            color: 0x336699, // Color, either in hex (show), or a base-10 integer
            fields: fields,
            footer: {
              text: 'Data retrieved from MyAnimeList.net.',
              icon_url: 'https://myanimelist.cdn-dena.com/images/faviconv5.ico'
            }
          }
        }).catch(err => {
          console.log(err)
        })
      }).catch((err) => {
        console.log(err)
        sendMessage(msg.channel.id, 'Unfortunately, it appears this username does not exist. Please verify and try again.')
      })
    } else if (args[1] === undefined) {
      malClient.getAnimeList(username).then((res) => {
        sendMessage(msg.channel.id, {
          embed: {
            title: 'Currently watching ' + res.myinfo.user_watching + ' anime', // Title of the embed
            description: 'Has spent ' + res.myinfo.user_days_spent_watching + ' days watching anime.',
            url: 'https://myanimelist.net/animelist/' + res.myinfo.user_name + '?status=1',
            author: { // Author property
              name: res.myinfo.user_name,
              url: 'https://myanimelist.net/profile/' + res.myinfo.user_name,
              icon_url: 'https://myanimelist.cdn-dena.com/images/userimages/' + res.myinfo.user_id + '.jpg'
            },
            color: 0x336699, // Color, either in hex (show), or a base-10 integer
            thumbnail: {},
            fields: [ // Array of field objects
              {
                name: 'Completed',
                value: res.myinfo.user_completed,
                inline: true
              },
              {
                name: 'On Hold',
                value: res.myinfo.user_onhold,
                inline: true
              },
              {
                name: 'Dropped',
                value: res.myinfo.user_dropped,
                inline: true
              }
            ],
            footer: {
              text: 'Data retrieved from MyAnimeList.net.',
              icon_url: 'https://myanimelist.cdn-dena.com/images/faviconv5.ico'
            }
          }
        }).catch(err => {
          console.log(err)
        })
      }).catch((err) => {
        console.log(err)
        sendMessage(msg.channel.id, 'Unfortunately, it appears this username does not exist. Please verify and try again.')
      })
    }
  }
}, commandOptions)
// #endregion Feature Commands

// #region Reaction Commands
/**
* Command Name: Cry
* Description : Returns a random gif of someone crying.
*/
bot.registerCommand('cry', (msg, args) => {
  reactions.pickCryImage((cryImage) => {
    sendMessage(msg.channel.id, undefined, {
      file: cryImage,
      name: 'Cry.gif'
    })

    ioTools.incrementCommandUse('cry')
  })
}, {
  aliases: ['crys', 'cried'],
  caseInsensitive: true,
  cooldownMessage: config.DEFAULT_COOLDOWN_MESSAGE,
  cooldown: config.DEFAULT_COOLDOWN,
  description: 'Displays random cry gif.',
  fullDescription: 'Displays a random cry gif.'
})

/**
* Command Name: Meh
* Description : Returns a random gif that illustrates the feeling of meh.
* Requested By: Alcha
*/
bot.registerCommand('meh', (msg, args) => {
  ioTools.getImage('/home/alcha/tron/images/meh.gif', (img) => {
    sendMessage(msg.channel.id, undefined, {
      file: img,
      name: 'meh.gif'
    })
  })
}, commandOptions)

bot.registerCommand('lewd', (msg, args) => {
  if (!isNaN(parseInt(args[0]))) {
    reactions.pickLewdImage(args[0]).then(imgObject => {
      sendMessage(msg.channel.id, undefined, {
        file: imgObject.image,
        name: imgObject.filename
      })
    })
  } else {
    reactions.pickLewdImage().then(imgObject => {
      sendMessage(msg.channel.id, undefined, {
        file: imgObject.image,
        name: imgObject.filename
      })
    })
  }
}, commandOptions)

/**
* Command Name: Cat
* Description : Returns a random cat image/gif.
* Requested By: Neko
*/
bot.registerCommand('cat', (msg, args) => {
  if (!isNaN(parseInt(args[0]))) {
    reactions.pickCatImage((img, filename) => {
      sendMessage(msg.channel.id, undefined, {
        file: img,
        name: filename
      })
    }, args[0])
  } else {
    reactions.pickCatImage((img, filename) => {
      sendMessage(msg.channel.id, undefined, {
        file: img,
        name: filename
      })
    })
  }

  ioTools.incrementCommandUse('cat')
}, commandOptions(['neko']))

// #endregion Reaction Commands

// #region Action Commands
/**
* Command Name: Marry
* Description : Propose to a user or use any of the subcommands.
* Requested By: PrimRose
*/
const marry = bot.registerCommand('marry', (msg, args) => {
  tools.doesMsgContainShu(msg).then((shuFlag) => {
    if (shuFlag) {
      sendMessage(msg.channel.id, 'You have mentioned a user who does not wish to be mentioned. Please refrain from doing this in the future.')
    } else {
      // Verify at least one user was mentioned
      if (msg.mentions.length > 0) {
        // Verify the first mentioned user wasn't the author to avoid trying to marry just yourself
        if (msg.mentions[0].id === msg.author.id) {
          sendMessage(msg.channel.id, "You can't marry yourself! What kind of a backwards country you think this is?")
        } else {
          // Pass mentioned users to verifyProposal to determine if a proposal is valid
          marriage.verifyProposal(msg, (cleanUsers, allVerified) => {
            // Let the validated users know they've been proposed to
            marriage.alertUsersToProposals(msg.channel.id, cleanUsers, bot)

            // Add a proposal to the database for each validated user
            cleanUsers.forEach((mention, index, mentions) => {
              marriage.addProposal(msg.author.id, mention.id,
                (results) => {
                  if (results.message.length > 0) {
                    sendMessage(msg.channel.id, results.message + ' - _If this was an error, please contact the developer._')
                  }
                })
            })

            // If one of the users weren't verified for some reason, let the proposer know
            // TODO: Provide more information on which user wasn't verified and possibly why
            if (allVerified === false) {
              sendMessage(msg.channel.id, 'Unfortunately, one or more of the users you proposed to is already married to you or you have a pending proposal.')
            }
          })
        }
      } else {
        sendMessage(msg.channel.id, 'Please make sure to mention one or more users in order to use this command.')
      }
    }
  })
}, commandOptions(['propose']))

/**
* Command Name: Marriage List
* Description : Displays a list of marriages a given user is in (if any exist)
*/
marry.registerSubcommand('list', (msg, args) => {
  if (msg.mentions.length !== 0) {
    tools.doesMsgContainShu(msg).then((shuFlag) => {
      if (shuFlag) {
        sendMessage(msg.channel.id, 'You have mentioned a user who does not wish to be mentioned. Please refrain from doing this in the future.')
      } else {
        let userId = msg.mentions[0].id
        marriage.getMarriages(userId, (marriages) => {
          let message = ''
          if (marriages.length > 0) {
            message = msg.mentions[0].username + ' is currently married to:\n```\n'
            for (let x = 0; x < marriages.length; x++) {
              if (marriages[x].SPOUSE_A_ID !== userId) {
                message += '- ' + tools.getUsernameFromId(marriages[x].SPOUSE_A_ID, bot) + ' since ' + marriages[x].MARRIAGE_DATE + '\n'
              } else if (marriages[x].SPOUSE_B_ID !== userId) {
                message += '- ' + tools.getUsernameFromId(marriages[x].SPOUSE_B_ID, bot) + ' since ' + marriages[x].MARRIAGE_DATE + '\n'
              }
            }

            message += '```'
          } else {
            message = "Unfortunately, you're not currently married to anyone. :cry:"
          }

          sendMessage(msg.channel.id, message)
        })
      }
    })
  } else {
    marriage.getMarriages(msg.author.id, (marriages) => {
      let message = ''
      if (marriages.length > 0) {
        message = 'You are currently married to:\n```\n'
        for (let x = 0; x < marriages.length; x++) {
          if (marriages[x].SPOUSE_A_ID !== msg.author.id) {
            message += '- ' + tools.getUsernameFromId(marriages[x].SPOUSE_A_ID, bot) + ' since ' + marriages[x].MARRIAGE_DATE + '\n'
          } else if (marriages[x].SPOUSE_B_ID !== msg.author.id) {
            message += '- ' + tools.getUsernameFromId(marriages[x].SPOUSE_B_ID, bot) + ' since ' + marriages[x].MARRIAGE_DATE + '\n'
          }
        }
        message += '```'
      } else {
        message = "Unfortunately, you're not currently married to anyone. :cry:"
      }

      sendMessage(msg.channel.id, message)
    })
  }
}, commandOptions(['lists', 'fuckbook', 'history']))

/**
* Command Name: Marriage Accept
* Description : Accept a marriage proposal.
*/
marry.registerSubcommand('accept', (msg, args) => {
  marriage.getProposalType(msg.author.id, 1, (results) => {
    if (results !== null && results.length > 1) {
      if (args.length === 0) {
        marriage.formatProposals(results, bot, (formattedMsg) => {
          formattedMsg = 'You currently have ' + results.length + ' proposals, please indicate which one you wish to accept (e.g. +marry accept 1):\n\n' + formattedMsg

          sendMessage(msg.channel.id, formattedMsg)
        })
      } else if (args.length === 1) {
        if (!isNaN(args[0])) {
          marriage.acceptProposal({
            id: results[args[0]].PROPOSER_ID,
            username: results[args[0]].PROPOSER_USERNAME
          }, {
            id: msg.author.id,
            username: msg.author.username
          }, (err, success) => {
            if (err) console.log(err)
            else if (success) sendMessage(msg.channel.id, "Congratulations, you're now married to <@" + results[args[0]].PROPOSER_ID + '>')
          })
        }
      }
    } else if (results.length === 1) {
      marriage.acceptProposal({
        id: results[0].PROPOSER_ID,
        username: results[0].PROPOSER_USERNAME
      }, {
        id: msg.author.id,
        username: msg.author.username
      }, (err, success) => {
        if (err) console.log(err)
        else if (success) sendMessage(msg.channel.id, "Congratulations, you're now married to <@" + results[0].PROPOSER_ID + '>')
      })
    } else {
      sendMessage(msg.channel.id, "Unfortunately, it appears you don't have any pending proposals. :slight_frown:")
    }
  })
}, commandOptions)

/**
* Command Name: Marriage Deny
* Description : Deny a marriage proposal.
*/
marry.registerSubcommand('deny', (msg, args) => {
  marriage.getProposals(msg.author.id, (results) => {
    if (results !== null && results.length > 1) {
      if (args.length === 0) {
        marriage.formatProposals(results, bot, (formattedMsg) => {
          formattedMsg = 'You currently have ' + results.length + ' proposals, please indicate which one you wish to deny (e.g. +marry deny 1):\n\n' + formattedMsg
          sendMessage(msg.channel.id, formattedMsg)
        })
      } else if (args.length === 1) {
        marriage.removeProposal(results[args[0]].PROPOSER_ID, msg.author.id, (results) => {
          if (results.message.length === 0) {
            sendMessage(msg.channel.id, "Aww, you've successfully denied the proposal.")
          }
        })
      }
    } else if (results.length === 1) {
      marriage.removeProposal(results[0].PROPOSER_ID, msg.author.id, (results) => {
        if (results.message.length === 0) {
          sendMessage(msg.channel.id, "Aww, you've successfully denied the proposal.")
        }
      })
    } else {
      sendMessage(msg.channel.id, "It appears you don't have any pending proposals, please try again later.")
    }
  })
}, commandOptions(['reject', 'rejected', 'refuse']))

/**
* Command Name: Divorce
* Description : Proposes a divorce to a given user.
*/
const divorce = bot.registerCommand('divorce', (msg, args) => {
  tools.doesMsgContainShu(msg).then((shuFlag) => {
    if (shuFlag) {
      sendMessage(msg.channel.id, 'You have mentioned a user who does not wish to be mentioned. Please refrain from doing this in the future.')
    } else {
      if (msg.mentions.length > 0) {
        let userId1 = msg.author.id
        let userId2 = msg.mentions[0].id

        marriage.verifyDivorce(userId1, userId2, (marriageIn) => {
          if (marriageIn !== null) {
            marriage.addDivorceProposal(userId1, userId2, (success) => {
              if (success) {
                sendMessage(msg.channel.id, "I'm sorry <@" + userId2 + '>, it appears ' + msg.author.username + ' wants a divorce. :slight_frown:\n\n' +
                  'Please use `+divorce accept` or `+divorce deny` to accept or deny the divorce request. Keep in mind, denying a divorce for too long without good reason _may_ have some side effects...')
              }
            })
          } else {
            sendMessage(msg.channel.id, 'Unfortunately, the divorce could not be verified. This could happen for a number of reasons:\n\n' +
              '- You already have a pending divorce with this user.\n' +
              "- You aren't actually married to this user.\n" +
              "- The bot is down and nothing is really working, so you most likely won't see this... :sweat_smile:")
          }
        })
      }
    }
  })
}, commandOptions(['divorces', 'alienate', 'separate']))

/**
* Command Name: Divorce Accept
* Description : Accept a divorce proposal.
*/
divorce.registerSubcommand('accept', (msg, args) => {
  marriage.getDivorceProposals(msg.author.id, (results) => {
    if (results !== null && results.length > 1) {
      if (args.length === 0) {
        marriage.formatDivorceProposals(results, bot, (formattedMsg) => {
          formattedMsg = 'You currently have ' + results.length + ' divorce proposals, please indicate which one you wish to accept (e.g. +divorce accept 1):\n\n' + formattedMsg

          sendMessage(msg.channel.id, formattedMsg)
        })
      } else if (args.length === 1) {
        if (!isNaN(args[0])) {
          marriage.acceptDivorceProposal(results[args[0]].DIVORCER_ID, msg.author.id, (err, success) => {
            if (err) console.log(err)
            else if (success) sendMessage(msg.channel.id, "You've successfuly divorced <@" + results[args[0]].DIVORCER_ID + '>')
          })
        }
      }
    } else if (results.length === 1) {
      marriage.acceptDivorceProposal(results[0].DIVORCER_ID, msg.author.id, (err, success) => {
        if (err) console.log(err)
        else if (success) sendMessage(msg.channel.id, "You've successfuly divorced <@" + results[0].DIVORCER_ID + '>')
      })
    } else {
      sendMessage(msg.channel.id, 'It appears as though you do not have any pending divorces! :tada:')
    }
  })
}, commandOptions)

/**
* Command Name: Divorce Deny
* Description : Deny a divorce request.
*/
divorce.registerSubcommand('deny', (msg, args) => {
  marriage.getDivorceProposals(msg.author.id, (results) => {
    if (results !== null && results.length > 1) {
      if (args.length === 0) {
        marriage.formatDivorceProposals(results, bot, (formattedMsg) => {
          formattedMsg = 'You currently have ' + results.length + ' divorce proposals, please indicate which one you wish to deny (e.g. +divorce deny 1):\n\n' + formattedMsg
          sendMessage(msg.channel.id, formattedMsg)
        })
      } else if (args.length === 1) {
        marriage.removeDivorceProposal(results[args[0]].id, msg.author.id, (results) => {
          if (results.message.length === 0) {
            sendMessage(msg.channel.id, "You've successfully denied the proposal.")
          }
        })
      }
    } else if (results.length === 1) {
      marriage.removeDivorceProposal(results[0].DIVORCER_ID, msg.author.id, (results) => {
        if (results.message.length === 0) {
          sendMessage(msg.channel.id, "You've successfully denied the proposal.")
        }
      })
    } else {
      sendMessage(msg.channel.id, "It appears you don't have any pending divorce proposals, please try again later.")
    }
  })
}, commandOptions(['reject', 'rejected']))

/**
* Command Name: Divorce List
* Description : Displays a list of divorces (if any exist) of the given user.
*/
divorce.registerSubcommand('list', (msg, args) => {
  tools.doesMsgContainShu(msg).then((shuFlag) => {
    if (shuFlag) {
      sendMessage(msg.channel.id, 'You have mentioned a user who does not wish to be mentioned. Please refrain from doing this in the future.')
    } else {
      // List current divorces of author or provided mention
      marriage.getDivorces(msg.author.id, (divorces) => {
        if (divorces.length === 0) {
          sendMessage(msg.channel.id, 'It appears as though you do not have any divorces! :tada:')
        } else {
          let message = 'Here is a list of your current divorces:\n```\n'

          for (let x = 0; x < divorces.length; x++) {
            if (divorces[x].DIVORCER_ID !== msg.author.id) {
              let username = tools.getUsernameFromId(divorces[x].DIVORCER_ID, bot)
              if (username.length > 0) {
                message += '- ' + username + ' since ' + divorces[x].DIVORCE_DATE + '\n'
              }
            } else if (divorces[x].DIVORCEE_ID !== msg.author.id) {
              let username = tools.getUsernameFromId(divorces[x].DIVORCEE_ID, bot)
              if (username.length > 0) {
                message += '- ' + username + ' since ' + divorces[x].DIVORCE_DATE + '\n'
              }
            }
          }

          message += '```'

          sendMessage(msg.channel.id, message)
        }
      })
    }
  })
}, commandOptions)

/**
* Command Name: Compliment
* Description : Compliment a user.
*/
bot.registerCommand('compliment', (msg, args) => {
  let compliment = insultCompliment.Compliment()

  if (msg.mentions[0] !== undefined) {
    if (compliment.startsWith('I')) return '<@' + msg.mentions[0].id + '>, ' + compliment
    else return '<@' + msg.mentions[0].id + '>, ' + tools.lowerFirstC(compliment)
  } else {
    if (compliment.startsWith('I')) return '<@' + msg.author.id + '>, ' + compliment
    else return '<@' + msg.author.id + '>, ' + tools.lowerFirstC(compliment)
  }
}, commandOptions(['comp', 'nice']))

/**
* Command Name: Insult
* Description : Insults a user.
* Requested By: Key
*/
bot.registerCommand('insult', (msg, args) => {
  let insult = insultCompliment.Insult()

  if (msg.mentions[0] !== undefined) {
    if (insult.startsWith('I')) return '<@' + msg.mentions[0].id + '>, ' + insult
    else return '<@' + msg.mentions[0].id + '>, ' + tools.lowerFirstC(insult)
  } else {
    if (insult.startsWith('I')) return '<@' + msg.author.id + '>, ' + insult
    else return '<@' + msg.author.id + '>, ' + tools.lowerFirstC(insult)
  }
}, commandOptions(['rude']))

/**
* Command Name: Love
* Description : Displays a random Love gif.
*/
bot.registerCommand('love', (msg, args) => {
  tools.doesMsgContainShu(msg).then((shuFlag) => {
    if (shuFlag) {
      sendMessage(msg.channel.id, 'You have mentioned a user who does not wish to be mentioned. Please refrain from doing this in the future.')
    } else {
      if (msg.channel.guild !== undefined) {
        reactions.pickLoveImage((loveImage) => {
          let message = ''

          if (msg.mentions[0] !== undefined) {
            let user = msg.mentions[0].username
            message = '**' + user + "**, you've been loved by **" + msg.author.username + '**. :heart:'
          }

          sendMessage(msg.channel.id, message, {
            file: loveImage,
            name: 'Love.gif'
          })
        })
      }
    }

    ioTools.incrementCommandUse('love')
  })
}, commandOptions(['loves']))

/**
* Command Name: Poke
* Description : Displays a random Poke gif.
*/
bot.registerCommand('poke', (msg, args) => {
  tools.doesMsgContainShu(msg).then((shuFlag) => {
    if (shuFlag) {
      sendMessage(msg.channel.id, 'You have mentioned a user who does not wish to be mentioned. Please refrain from doing this in the future.')
    } else {
      if (msg.mentions.length === 1) {
        reactions.pickPokeImage((img) => {
          let message = '**' + msg.mentions[0].username + "**, you've been poked by **" + msg.author.username + '**.'

          sendMessage(msg.channel.id, message, {
            file: img,
            name: 'Poke.gif'
          })

          ioTools.incrementCommandUse('poke')
        })
      } else {
        return 'Invalid input, please make sure to mention a user.'
      }
    }
  })
}, commandOptions(['pokes']))

/**
* Command Name: Slap
* Description : Displays a random Slap gif.
*/
bot.registerCommand('slap', (msg, args) => {
  tools.doesMsgContainShu(msg).then((shuFlag) => {
    if (shuFlag) {
      sendMessage(msg.channel.id, 'You have mentioned a user who does not wish to be mentioned. Please refrain from doing this in the future.')
    } else {
      if (args.length === 2 && !isNaN(parseInt(args[0]))) {
        reactions.pickSlapImage((img) => {
          let message = ''
          if (msg.mentions.length > 0) {
            message = '**' + msg.mentions[0].username + "**, you've been slapped by **" + msg.author.username + '**.'
          }

          sendMessage(msg.channel.id, message, {
            file: img,
            name: 'Slap.gif'
          })
        }, args[0])
      } else if (msg.mentions.length > 0) {
        reactions.pickSlapImage((img) => {
          let message = ''
          if (msg.mentions.length > 0) {
            message = '**' + msg.mentions[0].username + "**, you've been slapped by **" + msg.author.username + '**.'
          }

          sendMessage(msg.channel.id, message, {
            file: img,
            name: 'Slap.gif'
          })
        })
      }
    }
  })

  ioTools.incrementCommandUse('slap')
}, commandOptions(['slaps']))

/**
* Command Name: Kiss
* Description : Displays a random Kiss gif.
*/
bot.registerCommand('kiss', (msg, args) => {
  tools.doesMsgContainShu(msg).then((shuFlag) => {
    if (shuFlag) {
      sendMessage(msg.channel.id, 'You have mentioned a user who does not wish to be mentioned. Please refrain from doing this in the future.')
    } else {
      if (args.length === 2 && !isNaN(parseInt(args[0]))) {
        reactions.pickKissImage((img) => {
          let user = msg.mentions[0].username
          let message = '**' + user + "**, you've been kissed by **" + msg.author.username + '**. :kiss:'

          sendMessage(msg.channel.id, message, {
            file: img,
            name: 'Kiss.gif'
          })
        }, args[0])
      } else if (msg.mentions.length > 0) {
        reactions.pickKissImage((img) => {
          let user = msg.mentions[0].username
          let message = '**' + user + "**, you've been kissed by **" + msg.author.username + '**. :kiss:'

          sendMessage(msg.channel.id, message, {
            file: img,
            name: 'Kiss.gif'
          })
        })
      } else {
        sendMessage(msg.channel.id, 'Please make sure to mention one or more users in order to use this command.')
      }
    }
  })

  ioTools.incrementCommandUse('kiss')
}, commandOptions(['kisses']))

/**
* Command Name: Pat
* Description : Displays a random Pat gif.
*/
bot.registerCommand('pat', (msg, args) => {
  tools.doesMsgContainShu(msg).then((shuFlag) => {
    if (shuFlag) {
      sendMessage(msg.channel.id, 'You have mentioned a user who does not wish to be mentioned. Please refrain from doing this in the future.')
    } else {
      if (args.length === 2 && !isNaN(parseInt(args[0]))) {
        reactions.pickPatImage((img) => {
          let user = msg.mentions[0].username
          let message = '**' + user + '**, you got a pat from **' + msg.author.username + '**.'

          sendMessage(msg.channel.id, message, {
            file: img,
            name: 'Pat.gif'
          })
        }, args[0])
      } else {
        reactions.pickPatImage((img) => {
          let user = msg.mentions[0].username
          let message = '**' + user + '**, you got a pat from **' + msg.author.username + '**.'

          sendMessage(msg.channel.id, message, {
            file: img,
            name: 'Pat.gif'
          })
        })
      }
    }
  })

  ioTools.incrementCommandUse('pat')
}, commandOptions(['pats', 'tap', 'taps']))

/**
* Command Name: Kill
* Description : Displays a random Kill gif.
*/
bot.registerCommand('kill', (msg, args) => {
  tools.doesMsgContainShu(msg).then((shuFlag) => {
    if (shuFlag) {
      sendMessage(msg.channel.id, 'You have mentioned a user who does not wish to be mentioned. Please refrain from doing this in the future.')
    } else {
      if (args.length === 2 && !isNaN(parseInt(args[0]))) {
        reactions.pickKillImage((img) => {
          let message = ''
          if (msg.mentions.length > 0) {
            let user = msg.mentions[0].username
            message = '**' + user + "**, you've been killed by **" + msg.author.username + '**. :knife:'
          }

          sendMessage(msg.channel.id, message, {
            file: img,
            name: 'Kill.gif'
          })
        }, args[0])
      } else {
        reactions.pickKillImage((img) => {
          let message = ''
          if (msg.mentions.length > 0) {
            let user = msg.mentions[0].username
            message = '**' + user + "**, you've been killed by **" + msg.author.username + '**. :knife:'
          }

          sendMessage(msg.channel.id, message, {
            file: img,
            name: 'Kill.gif'
          })
        })
      }
    }
  })

  ioTools.incrementCommandUse('kill')
}, commandOptions(['kills']))

/**
* Command Name: Punch
* Description : Displays a random Punch gif.
*/
bot.registerCommand('punch', (msg, args) => {
  tools.doesMsgContainShu(msg).then((shuFlag) => {
    if (shuFlag) {
      sendMessage(msg.channel.id, 'You have mentioned a user who does not wish to be mentioned. Please refrain from doing this in the future.')
    } else {
      if (args.length === 2 && !isNaN(parseInt(args[0]))) {
        reactions.pickPunchImage((img) => {
          let user = msg.mentions[0].username
          let message = '**' + user + "**, you've been punched by **" + msg.author.username + '**. :punch:'

          sendMessage(msg.channel.id, message, {
            file: img,
            name: 'Punch.gif'
          })
        }, args[0])
      } else {
        reactions.pickPunchImage((img) => {
          let user = msg.mentions[0].username
          let message = '**' + user + "**, you've been punched by **" + msg.author.username + '**. :punch:'

          sendMessage(msg.channel.id, message, {
            file: img,
            name: 'Punch.gif'
          })
        })
      }
    }
  })

  ioTools.incrementCommandUse('punch')
}, commandOptions(['punches']))

/**
* Command Name: Wave
* Description : Displays a random Wave gif.
*/
bot.registerCommand('wave', (msg, args) => {
  reactions.pickWaveImage((img) => {
    sendMessage(msg.channel.id, undefined, {
      file: img,
      name: 'Wave.gif'
    })

    ioTools.incrementCommandUse('wave')
  })
}, commandOptions(['waves']))

/**
* Command Name: Spank
* Description : Displays a random Spank gif.
*/
bot.registerCommand('spank', (msg, args) => {
  tools.doesMsgContainShu(msg).then((shuFlag) => {
    if (shuFlag) {
      sendMessage(msg.channel.id, 'You have mentioned a user who does not wish to be mentioned. Please refrain from doing this in the future.')
    } else {
      reactions.pickSpankImage((img) => {
        let user = msg.mentions[0].username
        let message = '**' + user + "**, you've been spanked by **" + msg.author.username + '**. :wave:'

        sendMessage(msg.channel.id, message, {
          file: img,
          name: 'Spank.gif'
        })

        ioTools.incrementCommandUse('spank')
      })
    }
  })
}, {
  cooldownMessage: config.DEFAULT_COOLDOWN_MESSAGE,
  cooldown: config.DEFAULT_COOLDOWN,
  aliases: ['spanks'],
  caseInsensitive: true
})

/**
* Command Name: Kick
* Description : Displays a random Kick gif.
*/
bot.registerCommand('kick', (msg, args) => {
  tools.doesMsgContainShu(msg).then((shuFlag) => {
    if (shuFlag) {
      sendMessage(msg.channel.id, 'You have mentioned a user who does not wish to be mentioned. Please refrain from doing this in the future.')
    } else {
      if (args.length === 2 && !isNaN(parseInt(args[0]))) {
        reactions.pickKickImage((img) => {
          let user = msg.mentions[0].username
          let message = '**' + user + "**, you've been kicked by **" + msg.author.username + '**.'

          sendMessage(msg.channel.id, message, {
            file: img,
            name: 'Kick.gif'
          })
        }, args[0])
      } else if (msg.mentions.length > 0) {
        reactions.pickKickImage((img) => {
          let user = msg.mentions[0].username
          let message = '**' + user + "**, you've been kicked by **" + msg.author.username + '**.'

          sendMessage(msg.channel.id, message, {
            file: img,
            name: 'Kick.gif'
          })
        })
      } else {
        return 'Invalid input, please make sure to mention a user.'
      }
    }

    ioTools.incrementCommandUse('kick')
  })
}, commandOptions(['kicks']))

/**
* Command Name: Bite
* Description : Displays a random Bite gif.
*/
bot.registerCommand('bite', (msg, args) => {
  tools.doesMsgContainShu(msg).then((shuFlag) => {
    if (shuFlag) {
      sendMessage(msg.channel.id, 'You have mentioned a user who does not wish to be mentioned. Please refrain from doing this in the future.')
    } else {
      reactions.pickBiteImage((biteImage) => {
        var message = ''

        if (msg.mentions[0] !== undefined) {
          var user = msg.mentions[0].username
          message = '**' + user + "**, you've been bitten by **" + msg.author.username + '**.'
        }

        sendMessage(msg.channel.id, message, {
          file: biteImage,
          name: 'Bite.gif'
        })
      })
    }

    ioTools.incrementCommandUse('bite')
  })
}, commandOptions(['bites']))

/**
* Command Name: Nobulli
* Description : Returns a random bully gif and tells a user not to bully another.
* Requested By: Onyx
*/
bot.registerCommand('nobulli', (msg, args) => {
  tools.doesMsgContainShu(msg).then((shuFlag) => {
    if (shuFlag) {
      sendMessage(msg.channel.id, 'You have mentioned a user who does not wish to be mentioned. Please refrain from doing this in the future.')
    } else {
      if (args.length === 2 && !isNaN(parseInt(args[0]))) {
        reactions.pickNobulliImage((img) => {
          tools.getUsernames(args, bot, (usernames) => {
            let message = ''

            if (usernames.length === 2) {
              message = '**' + usernames[0] + "**, don't you dare bulli **" + usernames[1] + '**!'
            }

            sendMessage(msg.channel.id, message, {
              file: img,
              name: 'Nobulli.gif'
            })
          })
        }, args[0])
      } else {
        return 'Please mention 2 users to include in the message.'
      }
    }
  })

  ioTools.incrementCommandUse('nobulli')
}, commandOptions(['bulli', 'bully', 'nobully']))

/**
* Command Name: Lick
* Description : Displays a random Lick gif.
*/
bot.registerCommand('lick', (msg, args) => {
  tools.doesMsgContainShu(msg).then((shuFlag) => {
    if (shuFlag) {
      sendMessage(msg.channel.id, 'You have mentioned a user who does not wish to be mentioned. Please refrain from doing this in the future.')
    } else {
      if (args.length === 2 && !isNaN(parseInt(args[0]))) {
        reactions.pickLickImage(args[0]).then((img) => {
          let user = msg.mentions[0].username
          let message = '**' + user + "**, you've been licked by **" + msg.author.username + '**. :tongue:'

          sendMessage(msg.channel.id, message, {
            file: img,
            name: 'Lick.gif'
          })
        }, args[0])
      } else if (msg.mentions.length > 0) {
        reactions.pickLickImage().then((img) => {
          let user = msg.mentions[0].username
          let message = '**' + user + "**, you've been licked by **" + msg.author.username + '**. :tongue:'

          sendMessage(msg.channel.id, message, {
            file: img,
            name: 'Lick.gif'
          })
        })
      } else {
        sendMessage(msg.channel.id, 'Please make sure to mention one or more users in order to use this command')
      }
    }
  })

  ioTools.incrementCommandUse('lick')
}, commandOptions(['licks']))

/**
* Command Name: Hug
* Description : Displays a random Hug gif.
*/
bot.registerCommand('hug', (msg, args) => {
  tools.doesMsgContainShu(msg).then((shuFlag) => {
    if (shuFlag) {
      sendMessage(msg.channel.id, 'You have mentioned a user who does not wish to be mentioned. Please refrain from doing this in the future.')
    } else {
      if (msg.mentions[0] !== undefined) {
        reactions.pickHugImage((hugImage) => {
          let user = msg.mentions[0].username
          let message = '**' + user + '**, has received hugs from **' + msg.author.username + '**. :hugging:'

          sendMessage(msg.channel.id, message, {
            file: hugImage,
            name: 'Hugs.gif'
          })

          ioTools.incrementCommandUse('hugs')
        })
      } else {
        return 'Invalid input, please make sure to mention a user.'
      }
    }
  })
}, commandOptions(['hugs', 'cuddles']))
// #endregion Action Commands

// #region NSFW Commands
/**
* Command Name: Tattoo
* Description : Displays a random NSFW Tattoo image to the given channel so long
*   as it's tagged for NSFW content.
*/
bot.registerCommand('tattoo', (msg, args) => {
  if (!msg.channel.nsfw) {
    sendMessage(msg.channel.id, 'NSFW commands can only be executed in a channel flagged NSFW.')
  } else {
    let tatSubs = [
      'HotChicksWithTattoos',
      'SuicideGirls',
      'SceneGirls',
      'PrettyAltGirls'
    ]

    let random = tools.getRandom(0, tatSubs.length)

    reddit.r(tatSubs[random]).sort('top').from('day').limit(50, (err, data, res) => {
      if (err) {
        console.log(err)
        return err
      }

      let randomPost = tools.getRandom(0, data.data.children.length)

      if (data.data.children[randomPost] !== undefined) {
        sendMessage(msg.channel.id, data.data.children[randomPost].data.url)
      } else {
        console.log('data.data.children[randomPost].data===undefined')
        console.log('subreddit = ' + tatSubs[random])
        console.log(data.data.children)
        sendMessage(msg.channel.id, 'Unfortunately, something went wrong and the developers have been alerted. Please try again.')
      }
    })
  }
})

bot.registerCommand('newd', (msg, args) => {
  if (!msg.channel.nsfw) {
    sendMessage(msg.channel.id, 'NSFW commands can only be executed in a channel flagged NSFW.')
  } else {
    tools.doesMsgContainShu(msg).then((shuFlag) => {
      if (shuFlag) {
        sendMessage(msg.channel.id, 'You have mentioned a user who does not wish to be mentioned. Please refrain from doing this in the future.')
      } else {
        if (msg.channel.guild === undefined) {
          // Private message channel
          // TODO: Added private message support.
        } else {
          // Guild channel
          if (msg.mentions !== undefined && msg.mentions.length > 0) {
            lewds.getButt((butt, filename) => {
              msg.mentions.forEach((mention, index, array) => {
                mention.getDMChannel().then((channel) => {
                  if (mention.bot) {
                    sendMessage(msg.channel.id, "You can't send private messages to a bot.")
                  } else {
                    sendMessage(channel.id, '', {
                      file: butt,
                      name: filename
                    }).then((message) => {
                      // Process message?
                      console.log(msg.author.username + ' sent a lewd message to ' + mention.username + '.')
                    }).catch((err) => {
                      if (err.code === 20009) {
                        sendMessage(channel.id, "Unfortunately, it appears you can't receive explicit content. Please add Tron to your friends and try again.")
                      }
                    })
                  }
                })
              })

              if (msg.mentions.length === 1) {
                sendMessage(msg.channel.id, 'Your message has most likely been sent. :wink:')
              } else {
                sendMessage(msg.channel.id, 'Your messages have most likely been sent. :wink:')
              }
            })
          }
        }
      }
    })
  }

  ioTools.incrementCommandUse('newd')
}, {
  aliases: ['sendnude', 'sendnudes', 'nudes', 'snude', 'sn', 'slideintodms', 'sendnoods', 'sendnoots', 'newds'],
  caseInsensitive: true,
  deleteCommand: true,
  description: "For those spicy nudes you've been wanting ( . Y . )",
  fullDescription: ':lenny:',
  usage: '[@users] e.g. `+sendnudes @Alcha#2621 @MissBella#6480`'
})

bot.registerCommand('boobs', (msg, args) => {
  if (!msg.channel.nsfw) {
    sendMessage(msg.channel.id, 'NSFW commands can only be executed in a channel flagged NSFW.')
  } else {
    let boobSubs = [
      'boobs',
      'Boobies',
      'Stacked',
      'BustyPetite',
      'Cleavage',
      'bustyasians',
      'boltedontits',
      'burstingout'
    ]

    let randomSub = tools.getRandom(0, boobSubs.length)

    reddit.r(boobSubs[randomSub]).sort('top').from('day').limit(50, (err, data, res) => {
      if (err) {
        Raven.captureException(err)
        sendMessage(msg.channel.id, err)
      } else {
        let randomPost = tools.getRandom(0, data.data.children.length)

        sendMessage(msg.channel.id, data.data.children[randomPost].data.url)

        ioTools.incrementCommandUse('boobs')
      }
    })
  }
}, {
  aliases: ['boob', 'breasts', 'tits', 'bewbs', 'bewb']
})

bot.registerCommand('hentai', (msg, args) => {
  if (!msg.channel.nsfw) {
    sendMessage(msg.channel.id, 'NSFW commands can only be executed in a channel flagged NSFW.')
  } else {
    let hentaiSubs = [
      'hentai',
      'rule34',
      'rule34feet'
    ]

    let randomSub = tools.getRandom(0, hentaiSubs.length)

    reddit.r(hentaiSubs[randomSub]).sort('top').from('day').limit(50, (err, data, res) => {
      if (err) {
        Raven.captureException(err)
        sendMessage(msg.channel.id, err)
      } else {
        let randomPost = tools.getRandom(0, data.data.children.length)

        sendMessage(msg.channel.id, data.data.children[randomPost].data.url)

        ioTools.incrementCommandUse('hentai')
      }
    })
  }
}, {
  aliases: ['boob', 'breasts', 'tits']
})

bot.registerCommand('butt', (msg, args) => {
  if (!msg.channel.nsfw) {
    sendMessage(msg.channel.id, 'NSFW commands can only be executed in a channel flagged NSFW.')
  } else {
    let buttSubs = [
      'asstastic',
      'pawg',
      'facedownassup',
      'ass',
      'brunetteass',
      'CheekyBottoms',
      'datgap',
      'underbun',
      'pawgtastic',
      'BestBooties',
      'CuteLittleButts'
    ]

    let randomSub = tools.getRandom(0, buttSubs.length)

    reddit.r(buttSubs[randomSub]).sort('top').from('day').limit(50, (err, data, res) => {
      if (err) {
        Raven.captureException(err)
        sendMessage(msg.channel.id, err)
      } else {
        let randomPost = tools.getRandom(0, data.data.children.length)

        sendMessage(msg.channel.id, data.data.children[randomPost].data.url)

        ioTools.incrementCommandUse('butt')
      }
    })
  }
}, {
  aliases: ['butts', 'booty', 'ass']
})

bot.registerCommand('feet', (msg, args) => {
  if (!msg.channel.nsfw) {
    sendMessage(msg.channel.id, 'NSFW commands can only be executed in a channel flagged NSFW.')
  } else {
    let feetSubs = [
      'CelebrityFeet',
      'FFSocks',
      'Feet_NSFW',
      'FootFetish',
      'FFNBPS',
      'feetish',
      'scent_of_women_feet',
      'AsianFeet',
      'gayfootfetish',
      'HighHeels',
      'Soles',
      'CosplayFeet',
      'dirtyfeet',
      'DesiFeet',
      'ebonyfeet',
      'rule34feet',
      'girlsinanklesocks',
      'Porn_Star_Feet',
      'FeetVideos',
      'Soles_And_Holes',
      'Footjobs'
    ]

    let randomSub = tools.getRandom(0, feetSubs.length)

    reddit.r(feetSubs[randomSub]).sort('top').from('day').limit(50, (err, data, res) => {
      if (err) {
        Raven.captureException(err)
        sendMessage(msg.channel.id, err)
      } else {
        let randomPost = tools.getRandom(0, data.data.children.length)

        sendMessage(msg.channel.id, data.data.children[randomPost].data.url)

        ioTools.incrementCommandUse('feet')
      }
    })
  }
}, {
  aliases: ['feets', 'foot']
})

bot.registerCommand('gay', (msg, args) => {
  if (!msg.channel.nsfw) {
    sendMessage(msg.channel.id, 'NSFW commands can only be executed in a channel flagged NSFW.')
  } else {
    let gaySubs = [
      'cockrating',
      'BonersInPublic',
      'curved_cock',
      'MassiveCock',
      'ratemycock',
      'RedditorCum',
      'NSFW_DICK_and_Cock',
      'TotallyStraight',
      'CockOutline',
      'lovegaymale'
    ]

    let randomSub = tools.getRandom(0, gaySubs.length)

    reddit.r(gaySubs[randomSub]).sort('top').from('day').limit(50, (err, data, res) => {
      if (err) {
        Raven.captureException(err)
        sendMessage(msg.channel.id, err)
      } else {
        let randomPost = tools.getRandom(0, data.data.children.length)

        sendMessage(msg.channel.id, data.data.children[randomPost].data.url)

        ioTools.incrementCommandUse('gay')
      }
    })
  }
}, {
  aliases: ['dick', 'dicks', 'cock', 'penis']
})

bot.registerCommand('yaoi', (msg, args) => {
  if (!msg.channel.nsfw) {
    sendMessage(msg.channel.id, 'NSFW commands can only be executed in a channel flagged NSFW.')
  } else {
    yaoiCmd.getYaoiPhoto().then((photoUrl) => {
      sendMessage(msg.channel.id, photoUrl)

      ioTools.incrementCommandUse('yaoi')
    })
  }
})
// #endregion NSFW Commands

// #region Uncategorized
/**
* Command Name: PowerWashingPorn
* Description : Pulls random images from the top page images of all time on the
* r/PowerWashingPorn subreddit.
*/
bot.registerCommand('powerwashingporn', (msg, args) => {
  if (PowerWashingLinks.length === 0) {
    reddit.r('powerwashingporn').top().from('all').all((res) => {
      res.on('data', (data, res) => {
        data.data.children.forEach((child, index, mapObj) => {
          if (child.data.url !== undefined) {
            PowerWashingLinks.push(child.data.url)
          }
        })
      })

      res.on('error', (err) => {
        console.log('Error while parsing powerwashingporn:')
        console.log(err)
      })

      res.on('end', () => {
        let randomUrl = tools.getRandom(0, PowerWashingLinks.length)

        sendMessage(msg.channel.id, PowerWashingLinks[randomUrl])
      })

      ioTools.incrementCommandUse('powerwashing')
    })
  } else {
    let randomUrl = tools.getRandom(0, PowerWashingLinks.length)

    sendMessage(msg.channel.id, PowerWashingLinks[randomUrl])

    ioTools.incrementCommandUse('powerwashing')
  }
}, commandOptions)

/**
* Command Name: Dodge
* Description : Returns a random dodge gif.
* Requested By: PrimRose
*/
bot.registerCommand('dodge', (msg, args) => {
  if (args.length === 1 && !isNaN(parseInt(args[0]))) {
    reactions.pickDodgeImage(args[0]).then((img) => {
      sendMessage(msg.channel.id, undefined, {
        file: img,
        name: 'Dodge.gif'
      })
    })
  } else {
    reactions.pickDodgeImage().then((img) => {
      sendMessage(msg.channel.id, undefined, {
        file: img,
        name: 'Dodge.gif'
      })
    })
  }

  ioTools.incrementCommandUse('dodge')
}, commandOptions(['dodges']))

/**
* Command Name: VapeNash
* Description : Displays a random VapeNash gif.
* Requested By: Lagucci Mane
*/
bot.registerCommand('vn', (msg, args) => {
  reactions.pickVNImage((img) => {
    sendMessage(msg.channel.id, undefined, {
      file: img,
      name: 'VapeNation.gif'
    })
  })

  ioTools.incrementCommandUse('vapenation')
}, commandOptions(['vapenash', 'vape']))

/**
* Command Name: KillMe
* Description : Displays a random KillMe gif.
*/
bot.registerCommand('killme', (msg, args) => {
  reactions.pickKillMeImage((killMeImage) => {
    // Mika's requested killme command
    sendMessage(msg.channel.id, undefined, {
      file: killMeImage,
      name: 'KillMe.gif'
    })
  })

  ioTools.incrementCommandUse('killme')
}, commandOptions(['kms']))

// ========================== onReady Event Handler ============================================= //
bot.on('ready', () => {
  console.log('Tron is ready!')
  if (!isNaN(config.notificationChannel)) {
    sendMessage(config.notificationChannel, config.notificationMessage + ' > ' + tools.getFormattedTimestamp())
  }

  bot.editStatus('busy', {
    name: config.defaultgame,
    type: 1,
    url: ''
  })

  // setupRssReaders()
})

/**
* Command Name: Blush
* Description : Displays a random Blush gif.
*/
bot.registerCommand('blush', (msg, args) => {
  reactions.pickBlushImage((blushImage) => {
    sendMessage(msg.channel.id, undefined, {
      file: blushImage,
      name: 'Blush.gif'
    })

    ioTools.incrementCommandUse('blush')
  })
}, commandOptions)

/**
* Command Name: Rawr
* Description : Displays a random Rawr gif.
* Requested By: Squirts/Alex
*/
bot.registerCommand('rawr', (msg, args) => {
  if (!isNaN(parseInt(args[0]))) {
    reactions.pickRawrImage(args[0]).then((data) => {
      sendMessage(msg.channel.id, undefined, data)
    })
  } else {
    reactions.pickRawrImage().then((data) => {
      sendMessage(msg.channel.id, undefined, data)
    })
  }

  ioTools.incrementCommandUse('rawr')
}, commandOptions)

/**
* Command Name: Rekt
* Description : Displays a random Rekt gif.
*/
bot.registerCommand('rekt', (msg, args) => {
  reactions.pickRektImage((rektImage) => {
    sendMessage(msg.channel.id, undefined, {
      file: rektImage,
      name: 'Rekt.gif'
    })
  })

  ioTools.incrementCommandUse('rekt')
}, commandOptions)

// ========================== Trump Commands ==================================================== //
let trumpFake = null
let trumpWrong = null

const trumpCmd = bot.registerCommand('trump', (msg, args) => {
  if (args.length === 0) {
    return 'Invalid input, arguments required. Try `+trump fake` or `+trump wrong`.'
  }
}, commandOptions)

trumpCmd.registerSubcommand('fake', (msg, args) => {
  if (trumpWrong === null) {
    ioTools.getImage('trump/fake.gif', (img) => {
      trumpFake = img
      sendMessage(msg.channel.id, undefined, {
        file: img,
        name: 'Fake.gif'
      })
    })
  } else {
    sendMessage(msg.channel.id, undefined, {
      file: trumpFake,
      name: 'Fake.gif'
    })
  }

  ioTools.incrementCommandUse('trump-fake')
}, commandOptions(['cnn']))

trumpCmd.registerSubcommand('wrong', (msg, args) => {
  if (trumpWrong === null) {
    ioTools.getImage('trump/wrong.gif', (img) => {
      trumpWrong = img
      sendMessage(msg.channel.id, undefined, {
        file: img,
        name: 'Wrong.gif'
      })
    })
  } else {
    sendMessage(msg.channel.id, undefined, {
      file: trumpWrong,
      name: 'Wrong.gif'
    })
  }

  ioTools.incrementCommandUse('trump-wrong')
}, commandOptions)

/**
* Command Name: Wink
* Description : Displays a random Wink gif.
* Requested By: Thriller
*/
bot.registerCommand('wink', (msg, args) => {
  if (!isNaN(parseInt(args[0]))) {
    reactions.pickWinkImage(args[0]).then(data => {
      sendMessage(msg.channel.id, undefined, data)
    })
  } else {
    reactions.pickWinkImage().then(data => {
      sendMessage(msg.channel.id, undefined, data)
    })
  }
}, commandOptions)

/**
* Command Name: Dead
* Description : Displays an image for a dead chat.
* Requested By: Blake
*/
bot.registerCommand('dead', (msg, args) => {
  if (!isNaN(parseInt(args[0]))) {
    reactions.pickDeadImage(args[0]).then(data => {
      sendMessage(msg.channel.id, undefined, data)
    })
  } else {
    reactions.pickDeadImage().then(data => {
      sendMessage(msg.channel.id, undefined, data)
    })
  }
}, commandOptions)

/**
* Command Name: Shocked
* Description : Displays a shocked gif.
* Requested By: Thriller
*/
bot.registerCommand('shocked', (msg, args) => {
  if (!isNaN(parseInt(args[0]))) {
    reactions.pickShockedImage(args[0]).then((data) => {
      sendMessage(msg.channel.id, undefined, data)
    })
  } else {
    reactions.pickShockedImage().then((data) => {
      sendMessage(msg.channel.id, undefined, data)
    })
  }
})

/**
* Command Name: Disgusted
* Description : Displays a Disgusted gif.
* Requested By: Neko
*/
bot.registerCommand('disgusted', (msg, args) => {
  if (!isNaN(parseInt(args[0]))) {
    reactions.pickDisgustedImage(args[0]).then((data) => {
      sendMessage(msg.channel.id, undefined, data)
    })
  } else {
    reactions.pickDisgustedImage().then((data) => {
      sendMessage(msg.channel.id, undefined, data)
    })
  }
}, {
  aliases: ['disgust', 'gross'],
  caseInsensitive: true
})

/**
* Command Name: Smug
* Description : Displays a Smug gif.
* Requested By: Thriller
*/
bot.registerCommand('smug', (msg, args) => {
  if (!isNaN(parseInt(args[0]))) {
    reactions.pickSmugImage(args[0]).then((data) => {
      sendMessage(msg.channel.id, undefined, data)
    })
  } else {
    reactions.pickSmugImage().then((data) => {
      sendMessage(msg.channel.id, undefined, data)
    })
  }
})

/**
* Command Name: Coffee
* Description : Displays a Coffee gif/image.
* Requested By: Alcha
*/
bot.registerCommand('coffee', (msg, args) => {
  if (!isNaN(parseInt(args[0]))) {
    reactions.pickCoffeeImage(args[0]).then((data) => {
      sendMessage(msg.channel.id, undefined, data)
    })
  } else {
    reactions.pickCoffeeImage().then((data) => {
      sendMessage(msg.channel.id, undefined, data)
    })
  }
}, commandOptions)

/**
* Command Name: Scare
* Description : Displays a Scare gif/image.
* Requested By: Alcha
*/
bot.registerCommand('scare', (msg, args) => {
  if (!isNaN(parseInt(args[0]))) {
    reactions.pickScareImage(args[0]).then((data) => {
      sendMessage(msg.channel.id, undefined, data)
    })
  } else {
    reactions.pickScareImage().then((data) => {
      sendMessage(msg.channel.id, undefined, data)
    })
  }
}, commandOptions)

bot.registerCommand('swag', (msg, args) => {
  if (msg.mentions[0] !== undefined) {
    const id = parseInt(msg.mentions[0].id)
    if (id === 227830945040957440 ||
        id === 219270060936527873 ||
        id === 317138587491631104) {
      sendMessage(msg.channel.id, '**' + msg.mentions[0].username + `**, you've got a swag level of 11/10. :sunglasses:`)
    } else {
      const random = tools.getRandom(0, 11)
      sendMessage(msg.channel.id, '**' + msg.mentions[0].username + `**, you've got a swag level of ${random}/10.`)
    }
  }
})

// ========================== onMessageCreate Event Handler ===================================== //
bot.on('messageCreate', (msg) => {
  if (msg.channel.guild !== undefined &&
    msg.channel.guild.id === config.ownerServer &&
    parseInt(msg.author.id) !== 258162570622533635) {
    if (msg.content.includes('@everyone')) {
      let everyoneMention = ':mega: ``[' + tools.getFormattedTimestamp() + ']``' +
        '' + msg.author.username + ' has used the ``@everyone`` mention in the <#' + msg.channel.id + '> channel.'

      sendMessage(config.notificationChannel, everyoneMention)
    } else if (msg.content.includes('@here')) {
      let hereMention = ':mega: ``[' + tools.getFormattedTimestamp() + ']``' +
        '<@' + msg.author.id + '> has used the ``@here`` mention in the <#' + msg.channel.id + '> channel.'

      sendMessage(config.notificationChannel, hereMention)
    } else if (tools.messageIs(msg, 'god damn')) {
      sendMessage(msg.channel.id, 'https://i.imgur.com/ULUZMtV.gifv')
    } else if (tools.messageIs(msg, 'o/') && msg.author.id !== 258162570622533635) {
      sendMessage(msg.channel.id, '\\o')
    } else if (tools.messageIs(msg, '\\o') && msg.author.id !== 258162570622533635) {
      sendMessage(msg.channel.id, 'o/')
    } else if (tools.messageIs(msg, 'ayy') && msg.author.id !== 258162570622533635) {
      sendMessage(msg.channel.id, 'lmao')
    }
  }
})
// #endregion Uncategorized

// #region Help Commands
// ========================== Help Commands ===================================================== //
let helpText = require('./util/HelpText.json')

bot.unregisterCommand('help')

let helpCmd = bot.registerCommand('help', (msg, args) => {
  return helpText.base.join('')
}, {
  aliases: ['halp', 'helps', 'halps'],
  argsRequired: false,
  caseInsensitive: true,
  guildOnly: false
})

// ========================== Features Help Commands ============================================ //
helpCmd.registerSubcommand('change', (msg, args) => {
  return helpText.features.change.base.join('')
}, {
  argsRequired: false,
  caseInsensitive: true,
  guildOnly: false
})

helpCmd.registerSubcommand('features', (msg, args) => {
  return helpText.features.base.join('')
}, {
  argsRequired: false,
  caseInsensitive: true,
  guildOnly: false
})

helpCmd.registerSubcommand('quote', (msg, args) => {
  return helpText.features.quote.join('')
}, {
  argsRequired: false,
  caseInsensitive: true,
  guildOnly: false
})

helpCmd.registerSubcommand('ping', (msg, args) => {
  return helpText.features.ping.join('')
}, {
  argsRequired: false,
  caseInsensitive: true,
  guildOnly: false
})

helpCmd.registerSubcommand('invite', (msg, args) => {
  return helpText.features.invite.join('')
}, {
  argsRequired: false,
  caseInsensitive: true,
  guildOnly: false
})

helpCmd.registerSubcommand('stats', (msg, args) => {
  return helpText.features.stats.join('')
}, {
  argsRequired: false,
  caseInsensitive: true,
  guildOnly: false
})

helpCmd.registerSubcommand('ratewaifu', (msg, args) => {
  return helpText.features.ratewaifu.join('')
}, {
  aliases: ['rate'],
  argsRequired: false,
  caseInsensitive: true,
  guildOnly: false
})

helpCmd.registerSubcommand('git', (msg, args) => {
  return helpText.features.git.join('')
}, {
  argsRequired: false,
  caseInsensitive: true,
  guildOnly: false
})

helpCmd.registerSubcommand('addr', (msg, args) => {
  return helpText.features.addr.join('')
}, {
  argsRequired: false,
  caseInsensitive: true,
  guildOnly: false
})

helpCmd.registerSubcommand('listr', (msg, args) => {
  return helpText.features.listr.join('')
}, {
  argsRequired: false,
  caseInsensitive: true,
  guildOnly: false
})

helpCmd.registerSubcommand('leaver', (msg, args) => {
  return helpText.features.leaver.join('')
}, {
  argsRequired: false,
  caseInsensitive: true,
  guildOnly: false
})

helpCmd.registerSubcommand('joinr', (msg, args) => {
  return helpText.features.joinr.join('')
}, {
  argsRequired: false,
  caseInsensitive: true,
  guildOnly: false
})

helpCmd.registerSubcommand('avatar', (msg, args) => {
  return helpText.features.avatar.join('')
}, {
  argsRequired: false,
  caseInsensitive: true,
  guildOnly: false
})

helpCmd.registerSubcommand('ship', (msg, args) => {
  return helpText.features.ship.join('')
}, {
  argsRequired: false,
  caseInsensitive: true,
  guildOnly: false
})

helpCmd.registerSubcommand('actions', (msg, args) => {
  return helpText.actions.base.join('')
}, {
  argsRequired: false,
  caseInsensitive: true,
  guildOnly: false
})

helpCmd.registerSubcommand('users', (msg, args) => {
  return helpText.users.base.join('')
}, {
  argsRequired: false,
  caseInsensitive: true,
  guildOnly: false
})

helpCmd.registerSubcommand('reactions', (msg, args) => {
  return helpText.reactions.base.join('')
}, {
  argsRequired: false,
  caseInsensitive: true,
  guildOnly: false
})

helpCmd.registerSubcommand('love', (msg, args) => {
  return helpText.actions.love.join('')
}, {
  argsRequired: false,
  caseInsensitive: true,
  guildOnly: false
})

helpCmd.registerSubcommand('newd', (msg, args) => {
  return helpText.actions.newd.join('')
}, {
  argsRequired: false,
  caseInsensitive: true,
  guildOnly: false
})

helpCmd.registerSubcommand('poke', (msg, args) => {
  return helpText.actions.poke.join('')
}, {
  argsRequired: false,
  caseInsensitive: true,
  guildOnly: false
})

helpCmd.registerSubcommand('slap', (msg, args) => {
  return helpText.actions.slap.join('')
}, {
  argsRequired: false,
  caseInsensitive: true,
  guildOnly: false
})

helpCmd.registerSubcommand('kiss', (msg, args) => {
  return helpText.actions.kiss.join('')
}, {
  argsRequired: false,
  caseInsensitive: true,
  guildOnly: false
})

helpCmd.registerSubcommand('pat', (msg, args) => {
  return helpText.actions.pat.join('')
}, {
  argsRequired: false,
  caseInsensitive: true,
  guildOnly: false
})

helpCmd.registerSubcommand('kill', (msg, args) => {
  return helpText.actions.kill.join('')
}, {
  argsRequired: false,
  caseInsensitive: true,
  guildOnly: false
})

helpCmd.registerSubcommand('hugs', (msg, args) => {
  return helpText.actions.hugs.join('')
}, {
  argsRequired: false,
  caseInsensitive: true,
  guildOnly: false
})

helpCmd.registerSubcommand('punch', (msg, args) => {
  return helpText.actions.punch.join('')
}, {
  argsRequired: false,
  caseInsensitive: true,
  guildOnly: false
})

helpCmd.registerSubcommand('wave', (msg, args) => {
  return helpText.actions.wave.join('')
}, {
  argsRequired: false,
  caseInsensitive: true,
  guildOnly: false
})

helpCmd.registerSubcommand('spank', (msg, args) => {
  return helpText.actions.spank.join('')
}, {
  argsRequired: false,
  caseInsensitive: true,
  guildOnly: false
})

helpCmd.registerSubcommand('hug', (msg, args) => {
  return helpText.actions.hug.join('')
}, {
  argsRequired: false,
  caseInsensitive: true,
  guildOnly: false
})

helpCmd.registerSubcommand('kick', (msg, args) => {
  return helpText.actions.kick.join('')
}, {
  argsRequired: false,
  caseInsensitive: true,
  guildOnly: false
})

helpCmd.registerSubcommand('bite', (msg, args) => {
  return helpText.actions.bite.join('')
}, {
  argsRequired: false,
  caseInsensitive: true,
  guildOnly: false
})

helpCmd.registerSubcommand('dreamy', (msg, args) => {
  return helpText.users.dreamy.join('')
}, {
  argsRequired: false,
  caseInsensitive: true,
  guildOnly: false
})

helpCmd.registerSubcommand('alex', (msg, args) => {
  return helpText.users.alex.join('')
}, {
  argsRequired: false,
  caseInsensitive: true,
  guildOnly: false
})

helpCmd.registerSubcommand('utah', (msg, args) => {
  return helpText.users.utah.join('')
}, {
  argsRequired: false,
  caseInsensitive: true,
  guildOnly: false
})

helpCmd.registerSubcommand('jova', (msg, args) => {
  return helpText.users.jova.join('')
}, {
  argsRequired: false,
  caseInsensitive: true,
  guildOnly: false
})

// ========================== Reactions Help Command ============================================ //
helpCmd.registerSubcommand('cry', (msg, args) => {
  return helpText.reactions.cry.join('')
}, {
  argsRequired: false,
  caseInsensitive: true,
  guildOnly: false
})

helpCmd.registerSubcommand('confused', (msg, args) => {
  return helpText.reactions.confused.join('')
}, {
  argsRequired: false,
  caseInsensitive: true,
  guildOnly: false
})

helpCmd.registerSubcommand('killme', (msg, args) => {
  return helpText.reactions.killme.join('')
}, {
  argsRequired: false,
  caseInsensitive: true,
  guildOnly: false
})

helpCmd.registerSubcommand('pout', (msg, args) => {
  return helpText.reactions.pout.join('')
}, {
  argsRequired: false,
  caseInsensitive: true,
  guildOnly: false
})

helpCmd.registerSubcommand('dance', (msg, args) => {
  return helpText.reactions.dance.join('')
}, {
  argsRequired: false,
  caseInsensitive: true,
  guildOnly: false
})

helpCmd.registerSubcommand('blush', (msg, args) => {
  return helpText.reactions.blush.join('')
}, {
  argsRequired: false,
  caseInsensitive: true,
  guildOnly: false
})

helpCmd.registerSubcommand('rawr', (msg, args) => {
  return helpText.reactions.rawr.join('')
}, {
  argsRequired: false,
  caseInsensitive: true,
  guildOnly: false
})

helpCmd.registerSubcommand('rekt', (msg, args) => {
  return helpText.reactions.rekt.join('')
}, {
  argsRequired: false,
  caseInsensitive: true,
  guildOnly: false
})

// ========================== Marriage Help ===================================================== //
let marryHelpCmd = helpCmd.registerSubcommand('marry', (msg, args) => {
  return helpText.actions.marry.base.join('')
}, {
  argsRequired: false,
  caseInsensitive: true,
  guildOnly: false
})

marryHelpCmd.registerSubcommand('list', (msg, args) => {
  return helpText.actions.marry.list.join('')
}, {
  argsRequired: false,
  caseInsensitive: true,
  guildOnly: false
})

marryHelpCmd.registerSubcommand('accept', (msg, args) => {
  return helpText.actions.marry.accept.join('')
}, {
  argsRequired: false,
  caseInsensitive: true,
  guildOnly: false
})

marryHelpCmd.registerSubcommand('deny', (msg, args) => {
  return helpText.actions.marry.deny.join('')
}, {
  argsRequired: false,
  caseInsensitive: true,
  guildOnly: false
})

let divorceHelpCmd = helpCmd.registerSubcommand('divorce', (msg, args) => {
  return helpText.actions.divorce.base.join('')
}, {
  argsRequired: false,
  caseInsensitive: true,
  guildOnly: false
})

divorceHelpCmd.registerSubcommand('list', (msg, args) => {
  return helpText.actions.divorce.list.join('')
}, {
  argsRequired: false,
  caseInsensitive: true,
  guildOnly: false
})

divorceHelpCmd.registerSubcommand('accept', (msg, args) => {
  return helpText.actions.divorce.accept.join('')
}, {
  argsRequired: false,
  caseInsensitive: true,
  guildOnly: false
})

divorceHelpCmd.registerSubcommand('deny', (msg, args) => {
  return helpText.actions.divorce.deny.join('')
}, {
  argsRequired: false,
  caseInsensitive: true,
  guildOnly: false
})

let trumpHelp = helpCmd.registerSubcommand('trump', (msg, args) => {
  return helpText.reactions.trump.base.join('')
}, {
  argsRequired: false,
  caseInsensitive: true,
  guildOnly: false
})

trumpHelp.registerSubcommand('wrong', (msg, args) => {
  return helpText.reactions.trump.wrong.join('')
}, {
  argsRequired: false,
  caseInsensitive: true,
  guildOnly: false
})

trumpHelp.registerSubcommand('fake', (msg, args) => {
  return helpText.reactions.trump.fake.join('')
}, {
  argsRequired: false,
  caseInsensitive: true,
  guildOnly: false
})
// #endregion

// ========================== Connect Bot ======================================================= //
bot.connect()
