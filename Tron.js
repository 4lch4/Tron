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

// ========================== Ping Command ====================================================== //
bot.registerCommand('ping', (msg, args) => {
    return 'Pong!'
}, {
    description: 'Pong!',
    fullDescription: 'Used to check if the bot is up.'
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
