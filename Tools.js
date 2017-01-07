"use strict"

const config = require('./config.json')
const moment = require('moment-timezone')
const whyCmds = [
    "y",
    "why",
    "y tho",
    "but y",
    "but why",
    "why tho",
    "y though",
    "why though",
    "but y though",
    "but why though"
]

// ============================================================================================== //
var exports = module.exports = {}

// ========================== Standard Embeds Function ========================================== //
exports.embeds = function(msg, args, title, desc, thumbn, bot) {
    let rolrray = msg.channel.guild.members.get(bot.user.id).roles.map(r => msg.channel.guild.roles.get(r).position)
    let toprole = rolrray.indexOf(Math.max.apply(Math, rolrray))
    bot.createMessage(msg.channel.id, {
        content: ' ',
        embed: {
            title: title,
            description: desc,
            thumbnail: {
                url: thumbn
            },
            author: {
                name: msg.author.username,
                url: msg.author.avatarURL,
                icon_url: msg.author.avatarURL
            },
            color: msg.channel.guild.members.get(bot.user.id).roles.map(r => msg.channel.guild.roles.get(r).color)[toprole]
        }
    })
}

// ========================== MessageIs Function ================================================ //
exports.messageIs = function(msg, str) {
    let input = null
    if (msg.content != undefined) {
        input = msg.content.toUpperCase()
    } else {
        input = msg.toUpperCase()
    }

    if (input != null) {
        let comparison = str.toUpperCase()
        return input === comparison
    } else {
        return null
    }
}

// ========================== NotificationChannel Embeds Function =============================== //
exports.notificationEmbeds = function(channel, title, desc, thumbn, bot) {
    let rolrray = channel.guild.members.get(bot.user.id).roles.map(r => channel.guild.roles.get(r).position)
    let toprole = rolrray.indexOf(Math.max.apply(Math, rolrray))
    bot.createMessage(config.notificationChannel, {
        content: ' ',
        embed: {
            title: title,
            description: desc,
            thumbnail: {
                url: thumbn
            },
            author: {
                name: bot.username,
                url: bot.avatarURL,
                icon_url: bot.avatarURL
            },
            color: 16007990
        }
    })

    console.log('test')
    console.log(channel.guild.members.get(bot.user.id).roles.map(r => channel.guild.roles.get(r).color)[toprole])
}

exports.getFormattedTimestamp = function() {
    return moment().tz(config.defaultTimezone).format('HH:mm:ss MM/DD/YYYY')
}

exports.messageIsWhyCmd = function(msg) {
    let content = msg.content
    let found = false

    if (content.includes("?")) {
        content = content.substring(0, content.indexOf("?"))
    }

    whyCmds.forEach(function(cmd) {
        if (exports.messageIs(content, cmd)) {
            found = true
        }
    })

    return found
}

// ========================== Puppet the Bot =================================================== //
// const readline = require('readline')
// const rl = readline.createInterface({
//     input: process.stdin,
//     output: process.stdout
// })
//
// rl.on('line', (input) => {
//     let intake = input.split(' ')
//     switch (intake[0]) {
//         case 'morty':
//             bot.createMessage(mortysRoomId, intake[1])
//             break;
//         case 'secret':
//             bot.createMessage(secretStuffRoomId, intake[1])
//             break;
//     }
// })
