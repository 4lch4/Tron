#!node - Tron.js

// ========================================================================================= //
/**
 *	TODO: Account for leveling up and assigning skill points.
 *  TODO: Properly time the catch command since it's only a 30 second timer, not 300 seconds.
 *  TODO: Add handlers for the following events:
 *  CHANNEL_UPDATE
 *  GUILD_CREATE
 *  GUILD_DELETE
 *  GUILD_MEMBER_ADD
 *  GUILD_MEMBER_REMOVE
 *  GUILD_MEMBER_UPDATE
 *  GUILD_ROLE_CREATE
 *  GUILD_ROLE_DELETE
 *  GUILD_ROLE_UPDATE
 *  GUILD_UPDATE
 *  MESSAGE_CREATE
 *  MESSAGE_DELETE
 *  MESSAGE_DELETE_BULK
 *  MESSAGE_UPDATE
 *  PRESENCE_UPDATE
 *  TYPING_START
 *  USER_UPDATE
 *  VOICE_STATE_UPDATE
 */
// ============================================================================================== //
"use strict"

// ============================================================================================== //
const Eris = require("eris")
const config = require('./config.json')
const info = require('./package.json')
const readline = require('readline')
const _ = require('lodash')
const moment = require('moment-timezone')
const tools = require('./Tools.js')
const roleNames = config.roleNames;

// ========================== Bot Declaration =================================================== //
const bot = new Eris.CommandClient(config.token, {}, {
    description: info.description,
    owner: info.author,
    prefix: config.prefix
})

// ========================== Change Command ==================================================== //
bot.registerCommand('change', (msg, args) => {
    if (config.adminids.indexOf(msg.author.id) > -1) {
        if (args[0] == 'notification') {
            config.notificationChannel = msg.channel.id
            bot.createMessage(msg.channel.id, 'The NotificationChannel has been changed to - ' + msg.channel.name)
        }
    }
}, {
    description: 'Change notification channel.',
    fullDescription: 'Used to change the notification channel.'
})

bot.registerCommand('kick', (msg, args) => {
    var kickImage = tools.pickKickImage()
    var message = ''

    if (msg.content.length > 7) {
        var user = msg.mentions[0].username
        message = "**" + user + "**, you've been kicked by **" + msg.author.username + "**."
    }

    bot.createMessage(msg.channel.id, {
        content: message,
        embed: {
            image: kickImage
        }
    })
}, {
    description: 'Displays random kick gif',
    fullDescription: 'Displays a random kick gif and the name of the person you mention.'
})

bot.registerCommand('mika', (msg, args) => {
    let mikaImage = tools.pickMikaImage()

    bot.createMessage(msg.channel.id, {
        embed: {
            image: mikaImage
        }
    })
})

bot.registerCommand('invite', (msg, args) => {
    if (msg.channel.guild != null) {
        let comparison = args[0].toLowerCase()
        let members = msg.channel.guild.members

        members.forEach(function(value, key, mapObj) {
            if (value.user != undefined) {
                let username = value.user.username.toLowerCase()

                if (value.nick != undefined) {
                    username = value.nick.toLowerCase()
                }

                if (username == comparison) {
                    console.log('Match found = ' + username)
                    msg.channel.editPermission(value.user.id, 1024, null, 'member')
                }
            }
        })
    } else {
        console.log('In isNan else loop.')
    }
}, {
    description: 'Invite a user to your channel.',
    fullDescription: 'Gives a user permission to view messages in the channel the command was received from.'
})

// ========================== Ping Command ====================================================== //
bot.registerCommand('ping', (msg, args) => {
    return 'Pong!'
}, {
    description: 'Pong!',
    fullDescription: 'Used to check if the bot is up.'
})

bot.registerCommand('kms', (msg, args) => {
    bot.createMessage(msg.channel.id, {
        content: '',
        embed: {
            image: {
                url: 'https://i.imgur.com/rC0Yx6S.gif',
                height: 498,
                width: 286
            }
        }
    })
})

bot.registerCommand('killme', (msg, args) => {
    let killMeImage = tools.pickKillImage()

    // Mika's requested killme command
    bot.createMessage(msg.channel.id, {
        embed: {
            image: killMeImage
        }
    })
})

bot.registerCommand('hugs', (msg, args) => {
    let hugImage = tools.pickHugImage();
    var message = ''

    if (msg.content.length > 7) {
        var user = msg.mentions[0].username
        message = "**" + user + "**, has received hugs from **" + msg.author.username + "**."
    }

    bot.createMessage(msg.channel.id, {
        content: message,
        embed: {
            image: hugImage
        }
    })
})

bot.registerCommand('bite', (msg, args) => {
    var biteImage = tools.pickBiteImage()
    var message = ''

    if (msg.content.length > 7) {
        var user = msg.mentions[0].username
        message = "**" + user + "**, you've been bitten by **" + msg.author.username + "**."
    }

    bot.createMessage(msg.channel.id, {
        content: message,
        embed: {
            image: biteImage
        }
    })
})

bot.registerCommand('jova', (msg, args) => {
    bot.createMessage(msg.channel.id, 'Who is <@78694002332803072>? Does <@78694002332803072> is gay?')
})

// ========================== onReady Event Handler ============================================= //
bot.on("ready", () => {
    console.log('Tron is ready!')
    if (!isNaN(config.notificationChannel)) {
        bot.createMessage(config.notificationChannel, config.notificationMessage + ' > ' + tools.getFormattedTimestamp())
    }

    bot.editStatus('busy', {
        name: config.defaultgame,
        type: 1,
        url: ''
    })
})

bot.registerCommand('git', (msg, args) => {
    bot.createMessage(msg.channel.id, 'You can find the git repo for Tron here: https://github.com/Alcha/Tron')
}, {
    description: 'Display link to git repository.',
    fullDescription: 'Displays the link to the git repository on GitHub.'
})

bot.registerCommand('blush', (msg, args) => {
    let blushImage = tools.pickBlushImage()

    bot.createMessage(msg.channel.id, {
        embed: {
            image: blushImage
        }
    })
})

bot.registerCommand('rawr', (msg, args) => {
    bot.createMessage(msg.channel.id, {
        embed: {
            image: {
                url: 'https://cdn.discordapp.com/attachments/254496813552238594/278798600505393152/raw.gif'
            }
        }
    })
})

bot.registerCommand('rekt', (msg, args) => {
    let rektImage = tools.pickRektImage()

    bot.createMessage(msg.channel.id, {
        embed: {
            image: rektImage
        }
    })
})

bot.registerCommand('addr', (msg, args) => {
    if (msg.channel.guild != null) {
        if (tools.memberIsMod(msg)) {
            let comparison = tools.concatArgs(args)

            console.log("comparison = " + comparison);

            let roles = msg.channel.guild.roles

            roles.forEach(function(value, key, mapObj) {
                if (value.name != null) {
                    let name = value.name.toLowerCase();
                    console.log("Name = " + name + "; Comparison = " + comparison + ";");

                    if (name == comparison) {
                        roleNames.push(value.name)
                        bot.createMessage(msg.channel.id, "Added " + value.name + " to list of available roles.");
                    }
                }
            })
        }
    }
})

bot.registerCommand('listr', (msg, args) => {
    let message = "List of currently available roles:\n"

    roleNames.forEach(function(curr, index, arr) {
        message += "- **" + curr + "**\n";
    })

    bot.createMessage(msg.channel.id, message);
}, {
    description: 'List roles that are available to join.',
    fullDescription: 'Lists the roles that have been added by an administrator that are available.'
})

bot.registerCommand('leaver', (msg, args) => {
    let comparison = tools.concatArgs(args);

    if (msg.guild != null) {
        let userId = msg.author.id;

        if (comparison == "all") {
            tools.removeAllRoles(userId, msg, bot);
        } else {
            let roleId = tools.getRoleId(msg, comparison);

            if (roleId.length > 1) {
                if (tools.allowedRole(comparison)) {
                    msg.guild.removeMemberRole(userId, roleId);
                    bot.createMessage(msg.channel.id, "You've successfully been removed from your requested group.");
                    msg.delete();
                }
            }
        }
    }
})

bot.registerCommand('joinr', (msg, args) => {
    let comparison = tools.concatArgs(args);

    if (msg.guild != null) {
        let userId = msg.author.id;

        if (comparison == "all") {
            tools.addAllRoles(userId, msg, bot);
        } else {
            let roleId = tools.getRoleId(msg, comparison);

            if (roleId.length > 1) {
                if (tools.allowedRole(comparison)) {
                    msg.guild.addMemberRole(userId, roleId);
                    bot.createMessage(msg.channel.id, "You've successfully been added to your requested group.");
                    msg.delete();
                }
            }
        }
    }
})

// ========================== onMessageCreate Event Handler ===================================== //
bot.on("messageCreate", (msg) => {
    if (!isNaN(msg.author.id)) {
        if (msg.content.includes('@everyone')) {
            let everyoneMention = ":mega: ``[" + tools.getFormattedTimestamp() + "]``" +
                "<@" + msg.author.id + "> has used the ``@everyone`` mention in the <#" + msg.channel.id + "> channel."

            bot.createMessage(config.notificationChannel, everyoneMention)
        } else if (msg.content.includes('@here')) {
            let hereMention = ":mega: ``[" + tools.getFormattedTimestamp() + "]``" +
                "<@" + msg.author.id + "> has used the ``@here`` mention in the <#" + msg.channel.id + "> channel."

            bot.createMessage(config.notificationChannel, hereMention)
        } else if (tools.messageIsWhyCmd(msg)) {
            bot.createMessage(msg.channel.id, 'Because you touch yourself at night.')
        } else if (tools.messageIs(msg, 'hello')) {
            bot.createMessage(msg.channel.id, 'New fone who dis?')
        } else if (tools.messageIs(msg, 'bye')) {
            bot.createMessage(msg.channel.id, 'https://cdn.discordapp.com/attachments/238466589362487306/258896018354077697/byefelicia.png')
        }
    }
})

// ========================== onChannelCreate Event Handler ===================================== //
bot.on("channelCreate", (channel) => {
    if (channel.guild) {
        let createMessage = ":white_check_mark: ``[" + tools.getFormattedTimestamp() + "]`` " +
            "Channel: **" + channel.name + "** has been created."

        bot.createMessage(config.notificationChannel, createMessage)
    }
}, {
    description: 'Log channel creation.',
    fullDescription: 'If a channel is created, it is logged in the notificationChannel'
})

// ========================== onChannelDelete Event Handler ===================================== //
bot.on("channelDelete", (channel) => {
    if (channel.guild) {
        let deleteMessage = ":x: ``[" + tools.getFormattedTimestamp() + "]`` " +
            "Channel: **" + channel.name + "** has been deleted."

        bot.createMessage(config.notificationChannel, deleteMessage)
    }
}, {
    description: 'Log channel deletion.',
    fullDescription: 'If a channel is deleted, it is logged in the notificationChannel'
})

// ========================== onGuildBanAdd Event Handler ===================================== //
bot.on("guildBanAdd", (guild, user) => {
    bot.createMessage(config.notificationChannel, ":hammer: ``[" + tools.getFormattedTimestamp() + "]`` " +
        "User: <@" + user.id + "> has been banned.")
}, {
    description: 'Log user ban.',
    fullDescription: 'If a user is banned, it is logged in the notificationChannel.'
})

// ========================== onGuildBanRemove Event Handler ===================================== //
bot.on("guildBanRemove", (guild, user) => {
    bot.createMessage(config.notificationChannel, ":x::hammer: ``[" + tools.getFormattedTimestamp() + "]`` " +
        "User: <@" + user.id + "> has been unbanned.")
}, {
    description: 'Log user unban.',
    fullDescription: 'If a user is unbanned, it is logged in the notificationChannel.'
})

// ========================== Connect Bot ======================================================= //
bot.connect()
