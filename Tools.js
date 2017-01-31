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

function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min) + min)
}
// ========================== MessageIs Function ================================================ //
exports.messageIs = function(msg, str) {
    let input = ""
    
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

exports.messageStartsWith = function(msg, str) {
    let input = ""

    if (msg.content != undefined) {
        input = msg.content.toUpperCase()
    } else {
        input = msg.toUpperCase()
    }
    let comparison = str.toUpperCase()
    return input.startsWith(comparison)
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

exports.pickKillImage = function() {
    let random = getRandom(0, 4);

    switch (random) {
        case 0:
            return {
                url: 'https://i.imgur.com/Db0ghmE.gif',
                height: 500,
                width: 250
            }
        case 1:
            return {
                url: 'https://i.imgur.com/rBYOkZq.gif',
                height: 500,
                width: 281
            }
        case 2:
            return {
                url: 'https://i.imgur.com/gMylE3v.gif',
                height: 500,
                width: 273
            }
        case 3:
            return {
                url: 'https://i.imgur.com/NeD9pVR.gif',
                height: 500,
                width: 297
            }
    }
};

exports.pickBiteImage = function() {
    let random = getRandom(0, 11)

    switch (random) {
        case 0:
            return {
                url: 'https://i.imgur.com/2t4yRJL.gif',
                height: 500,
                width: 301
            }
        case 1:
            return {
                url: 'https://i.imgur.com/pCRB4bm.gif',
                height: 500,
                width: 248
            }
        case 2:
            return {
                url: 'https://i.imgur.com/A1UWYE0.gif',
                height: 500,
                width: 281
            }
        case 3:
            return {
                url: 'https://i.imgur.com/TmUUJzF.gif',
                height: 500,
                width: 281
            }
        case 4:
            return {
                url: 'https://i.imgur.com/T88sRvd.gif',
                height: 427,
                width: 240
            }
        case 5:
            return {
                url: 'https://i.imgur.com/GV4mBag.gif',
                height: 540,
                width: 304
            }
        case 6:
            return {
                url: 'https://i.imgur.com/66aDTjt.gif',
                height: 500,
                width: 281
            }
        case 7:
            return {
                url: 'https://i.imgur.com/CJ1kNDg.gif',
                height: 500,
                width: 281
            }
        case 8:
            return {
                url: 'https://i.imgur.com/DtMIIRp.gif',
                height: 444,
                width: 250
            }
        case 9:
            return {
                url: 'https://i.imgur.com/Yr6uo41.gif',
                height: 500,
                width: 378
            }
        case 10:
            return {
                url: 'https://i.imgur.com/wpQmQag.gif',
                height: 397,
                width: 223
            }
    }
};

exports.pickMikaImage = function() {
    let random = getRandom(0, 1);

    switch (random) {
        case 0:
            return {
                url: 'https://i.imgur.com/WtdWRrt.png',
                height: 585,
                width: 585
            }
    }
}

exports.pickKickImage = function() {
    let random = getRandom(0, 6)

    switch (random) {
        case 0:
            return {
                url: 'https://i.imgur.com/B0EvFzc.gif',
                height: 500,
                width: 280
            }
        case 1:
            return {
                url: 'https://i.imgur.com/5oZkxax.gif',
                height: 500,
                width: 240
            }
        case 2:
            return {
                url: 'https://i.imgur.com/955TDwD.gif',
                height: 500,
                width: 257
            }
        case 3:
            return {
                url: 'https://i.imgur.com/8X13K1z.gif',
                height: 460,
                width: 260
            }
        case 4:
            return {
                url: 'https://i.imgur.com/lP0kfb7.gif',
                height: 768,
                width: 432
            }
        case 5:
            return {
                url: 'https://i.imgur.com/4vcwdhp.gif',
                height: 498,
                width: 280
            }
    }
}

exports.pickBlushImage = function() {
    /*let random = getRandom(0, 5)

    switch (random) {
        case 0:
            return {
                url: '',
                height: ,
                width:
            }
        case 1:
            return {
                url: '',
                height: ,
                width:
            }
    }*/
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
