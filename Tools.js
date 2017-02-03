"use strict"

const config = require('./config.json')
const roleNames = config.roleNames;
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

exports.allowedRole = function(comparison) {
    let allowed = false;
    roleNames.forEach(function(curr, index, arr) {
        if (curr != null && curr.toLowerCase() == comparison) {
            allowed = true;
        }
    })

    return allowed;
}

function getRoleId(msg, comparison) {
    let id = "";

    msg.guild.roles.forEach(function(curr, index, values) {
        if (curr.name.toLowerCase() == comparison) {
            id = curr.id;
        }
    })

    return id;
}

exports.addAllRoles = function(userId, msg, bot) {
    let roleIds = [""]
    console.log(msg.content);
    for(var x = 0; x < roleNames.length; x++) {
        let roleId = getRoleId(msg, roleNames[x].toLowerCase());
        msg.guild.addMemberRole(userId, roleId);
    }

    bot.createMessage(msg.channel.id, "You've been added to all the roles available to you.");
    msg.delete();
}
exports.getRoleId = function(msg, comparison) {
    let id = "";

    msg.guild.roles.forEach(function(curr, index, values) {
        if (curr.name.toLowerCase() == comparison) {
            id = curr.id;
        }
    })

    return id;
}

exports.concatArgs = function(args) {
    let str = "";

    if (args.length > 1) {
        args.forEach(function(curr, index, arr) {
            if (str.length > 1) {
                str += " " + curr.toLowerCase();
            } else {
                str += curr.toLowerCase();
            }
        })
    } else {
        str = args[0].toLowerCase()
    }

    return str;
}

exports.memberIsMod = function(msg) {
    let roles = msg.channel.guild.members.get(msg.author.id).roles;
    let found = false;

    roles.forEach(function(curr, index, arr) {
        console.log('curr = ' + curr);
        if (curr == '254970225642962949') {
            found = true;
        } else if (curr == '254970606565588992') {
            found = true;
        }
    })

    return found;
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
    let random = getRandom(0, 47)

    let images = [
        'https://i.imgur.com/TeK0xVr.gif', 'https://i.imgur.com/O85hPMc.gif', 'https://i.imgur.com/bLMZFxX.gif',
        'https://i.imgur.com/Bi2NBuI.gif', 'https://i.imgur.com/ns6jCfe.gif', 'https://i.imgur.com/ryThkzW.gif',
        'https://i.imgur.com/oy4objp.gif', 'https://i.imgur.com/1qdEuZd.gif', 'https://i.imgur.com/YV0C1p7.gif',
        'https://i.imgur.com/PWcQafM.gif', 'https://i.imgur.com/Yf6bxXP.gif', 'https://i.imgur.com/govlkd2.gif',
        'https://i.imgur.com/Y3qEgA9.gif', 'https://i.imgur.com/wXA6eEC.gif', 'https://i.imgur.com/3LrpXdI.gif',
        'https://i.imgur.com/oBtfUgJ.gif', 'https://i.imgur.com/jejjR3r.gif', 'https://i.imgur.com/jMJEBmu.gif',
        'https://i.imgur.com/QyfxIPl.gif', 'https://i.imgur.com/0JR3i83.gif', 'https://i.imgur.com/auT3qyB.gif',
        'https://i.imgur.com/tNgjyaU.gif', 'https://i.imgur.com/hbrF22m.gif', 'https://i.imgur.com/MawaNKI.gif',
        'https://i.imgur.com/cpz1EJz.gif', 'https://i.imgur.com/httCGTV.gif', 'https://i.imgur.com/IDFinuB.gif',
        'https://i.imgur.com/Ip7vqHc.gif', 'https://i.imgur.com/Sd33j3T.gif', 'https://i.imgur.com/5uswmLW.gif',
        'https://i.imgur.com/XlKMOtG.gif', 'https://i.imgur.com/sd7GS3C.gif', 'https://i.imgur.com/0ENFxMs.gif',
        'https://i.imgur.com/LMM959w.gif', 'https://i.imgur.com/AYKjFJn.gif', 'https://i.imgur.com/9rIYmT1.gif',
        'https://i.imgur.com/CYQyDnP.gif', 'https://i.imgur.com/TDcflKr.gif', 'https://i.imgur.com/rAj1g3h.gif',
        'https://i.imgur.com/HUYn6IX.gif', 'https://i.imgur.com/XqQviel.gif', 'https://i.imgur.com/ob9W3gT.gif',
        'https://i.imgur.com/mlBpkZK.gif', 'https://i.imgur.com/jKluGnJ.gif', 'https://i.imgur.com/xQaAA6G.gif',
        'https://i.imgur.com/yZi3E90.gif', 'https://i.imgur.com/3DYcQfC.gif'
    ]

    return {
        url: images[random]
    }
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
