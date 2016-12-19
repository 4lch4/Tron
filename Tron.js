/**
 *	TODO: Account for leveling up and assigning skill points.
 *  TODO: Properly time the catch command since it's only a 30 second timer, not 300 seconds.
 *  TODO: Add handlers for the following events:
 *  CHANNEL_CREATE
 *  CHANNEL_UPDATE
 *  GUILD_BAN_ADD
 *  GUILD_BAN_REMOVE
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
const tools = require('./utilities/Tools.js')

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
        bot.createMessage(config.notificationChannel, config.notificationMessage + ' > ' + moment().tz(config.defaultTimezone).format('h:mm A'))
    }

    bot.editStatus('busy', {
        name: config.defaultgame,
        type: 1,
        url: ''
    })
})

// ========================== onMessageCreate Event Handler ===================================== //
bot.on("messageCreate", (msg) => {
    if (messageIs(msg, 'why')) {
        embeds(msg, null, 'Witty Remark', 'Because you touch yourself at night.', null)
    } else if (messageIs(msg, 'hello')) {
        embeds(msg, null, 'Witty Remark', 'New fone who dis?', null)
    } else if (messageIs(msg, 'bye')) {
        embeds(msg, null, 'Witty Remark', 'https://cdn.discordapp.com/attachments/238466589362487306/258896018354077697/byefelicia.png', null)
    }
})

// ========================== onChannelDelete Event Handler ===================================== //
bot.on("channelDelete", (channel) => {
    bot.createMessage(config.notificationChannel, 'Channel deleted - ' + channel.name)
}, {
    description: 'Log channel deletion.',
    fullDescription: 'If a channel is deleted, it is logged in the notificationChannel'
})

// ========================== Connect Bot ======================================================= //
bot.connect()
