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
const config = require('./util/config.json')
const info = require('./package.json')
const readline = require('readline')
const _ = require('lodash')
const moment = require('moment-timezone')
const tools = require('./util/Tools.js')
const roleNames = config.roleNames;

// ========================== Bot Declaration =================================================== //
const bot = new Eris.CommandClient(config.token, {}, {
    description: info.description,
    owner: info.author,
    prefix: config.prefix
})

// ========================== GiveawayBot Code Begins =========================================== //
const Discord = require('discord.js');
let ent = require("entities");
const Helper = require("./util/Helper.js");

let giveawayBot = new Discord.Client({
    autoReconnect: true,
    maxCachedMessages: 1000,
    bot: true
});

const giveawayValues = {
    guild_id: "254496813552238594",         // Guild to post it to
    channel_id: "280527304566898688",       // Channel to post it to
    emoji: "gift",                          // Leave this alone pls
    raw_emoji: ent.decodeHTML("&#x1F381;"), // Leave this alone pls
    new_topic: "Current Giveaway: {GAME}",  // Topic format
    timeout: 300000,                        // Giveaway length in milliseconds
    gtimeout: 120000                        // Claim Prize length in milliseconds
};

// No! don't touch that!
let tempGiveaway = {
    started: false,
    message_id: "",
    game: "",
    host: "",
    current_user: "",
    users: [],
    count: 0,
    timeout: null
};

// HANDLERS
giveawayBot.on('error', (error) => {
    console.log("Err! in discord.js: ", error.stack);
});

giveawayBot.on('reconnecting', () => {
    console.log("Reconnecting to discord servers...");
});

giveawayBot.on('disconnect', () => {
    console.log("Disconnected from Discord.");
});

giveawayBot.on('messageReactionAdd', (emoji, user) => {
    if (tempGiveaway.started && user.id != giveawayBot.user.id && emoji.message.id === tempGiveaway.message_id && emoji.emoji.name === giveawayValues.raw_emoji) {
        if (!tempGiveaway.users.includes(user.id)) {
            tempGiveaway.users.push(user.id);
            tempGiveaway.count = tempGiveaway.users.length;
            user.sendMessage(`You have opted in for the ${tempGiveaway.game} giveaway!`);
        }
    }
});

giveawayBot.on('messageReactionRemove', (emoji, user) => {
    console.log(emoji)
    if (tempGiveaway.started && user.id != giveawayBot.user.id && emoji.message.id === tempGiveaway.message_id && emoji.emoji.name === giveawayValues.raw_emoji) {
        if (tempGiveaway.users.includes(user.id)) {
            tempGiveaway.users.splice(tempGiveaway.users.indexOf(user.id), 1);
            user.sendMessage(`You have opted out for the ${tempGiveaway.game} giveaway!`);
        }
    }
});

giveawayBot.setInterval(() => {
    if (tempGiveaway.started && tempGiveaway.current_user === "") {
        giveawayBot.guilds.get(giveawayValues.guild_id).channels.get(giveawayValues.channel_id).messages.get(tempGiveaway.message_id).edit(`@here\n**New Giveaway:** ${tempGiveaway.game}\n**Host:** <@${tempGiveaway.host}>\n**Entrees:** ${tempGiveaway.count}\n**Chance of winning:** ${100 / tempGiveaway.count}%\n**Giveaway ends in 5 minutes.**\n\nClick the ${giveawayValues.raw_emoji} reaction or PM ${giveawayBot.user} \`join\` to join the giveaway or \`leave\` to leave it.`);
    }
}, 2000)

process.on('SIGINT', () => {
    giveawayBot.destroy();
    process.exit(0);
});

let switchUser = function () {
    if (tempGiveaway.started) {
        giveawayBot.users.get(tempGiveaway.current_user).sendMessage(`You failed to claim the prize.`);
        giveawayBot.guilds.get(giveawayValues.guild_id).channels.get(giveawayValues.channel_id).messages.get(tempGiveaway.message_id).clearReactions();
        tempGiveaway.current_user = tempGiveaway.users[Math.floor(Math.random() * tempGiveaway.users.length)];
        tempGiveaway.users = tempGiveaway.users.filter(f => f !== tempGiveaway.current_user);
        giveawayBot.fetchUser(tempGiveaway.current_user).then(u => {
            giveawayBot.users.get(tempGiveaway.current_user).sendMessage(`To claim the prize ${tempGiveaway.game}, please type \`claim\` in this chat. (Case sensitive!). You have 2 minutes.`);
            giveawayBot.guilds.get(giveawayValues.guild_id).channels.get(giveawayValues.channel_id).messages.get(tempGiveaway.message_id).edit(`@here\n**Giveaway:** ${tempGiveaway.game}\n**Host:** <@${tempGiveaway.host}>\n**Entrees:** ${tempGiveaway.count}\n**Chance of winning:** ${100 / tempGiveaway.count}%\n\n***Giveaway is over.***\n<@${tempGiveaway.current_user}> has 2 minutes to claim the prize.`);
            giveawayBot.setTimeout(switchUser, giveawayValues.gtimeout)
        }).catch(() => {
            giveawayBot.guilds.get(giveawayValues.guild_id).channels.get(giveawayValues.channel_id).messages.get(tempGiveaway.message_id).edit(`@here\n**Giveaway:** ${tempGiveaway.game}\n**Host:** <@${tempGiveaway.host}>\n**Entrees:** ${tempGiveaway.count}\n**Chance of winning:** ${100 / tempGiveaway.count}%\n\nNo one claimed the prize.`);
            tempGiveaway.started = false;
            tempGiveaway.message_id = "";
            tempGiveaway.game = "";
            tempGiveaway.host = "";
            tempGiveaway.current_user = "";
            tempGiveaway.users = [];
            tempGiveaway.count = 0;
            giveawayBot.guilds.get(giveawayValues.guild_id).channels.get(giveawayValues.channel_id).setTopic(giveawayValues.new_topic.replace("{GAME}", "None"));
        });
    }
}

giveawayBot.login(config.token).then(() => {
    console.log("Logged in");
    giveawayBot.user.setStatus('dnd');
    giveawayBot.user.setGame('@here');
}).catch((e) => { throw e; });

giveawayBot.on("ready", function () {
    console.log('Connected to Discord.');
});

giveawayBot.on("message", (message) => {
    if (message.author.giveawayBot) { return; }
    //if(message.channel.type !== "text" && message.content != "claim"  &&message.author.id !== config.owner){message.reply("You can't use commands in Private Messages."); return;}
    if (message.content.startsWith(`dmod.eval`) && message.author.id == config.owner) {
        let evalstring = message.content.substr("dmod.eval ".length);
        try {
            let start = new Date().getTime();
            let msg = "```js\n" + eval(evalstring) + "```";

            let end = new Date().getTime();
            let time = end - start;

            message.channel.sendMessage("Time taken: " + (time / 1000) + " seconds\n" + msg);
        } catch (e) {
            message.channel.sendMessage("```js\n" + e + "```");
        }
    }
    if (message.content.startsWith(`dmod.stopgiveaway`) && tempGiveaway.host === message.author.id) {
        tempGiveaway.started = false;
        giveawayBot.clearTimeout(tempGiveaway.timeout);
        giveawayBot.guilds.get(giveawayValues.guild_id).channels.get(giveawayValues.channel_id).messages.get(tempGiveaway.message_id).clearReactions();
        giveawayBot.guilds.get(giveawayValues.guild_id).channels.get(giveawayValues.channel_id).messages.get(tempGiveaway.message_id).edit(`**Giveaway:** ${tempGiveaway.game}\n**Host:** <@${tempGiveaway.host}>\n**Entrees:** ${tempGiveaway.count}\n**Chance of winning:** ${100 / tempGiveaway.count}%\n\nHost has stopped the giveaway.`);
        tempGiveaway.message_id = "";
        tempGiveaway.game = "";
        tempGiveaway.host = "";
        tempGiveaway.current_user = "";
        tempGiveaway.users = [];
        tempGiveaway.count = 0;
        message.channel.sendMessage('Stopped giveaway.');
    }
    if (message.content.startsWith(`dmod.giveaway`) && Helper.checkPerm(message.author, message.guild)) {
        if (!tempGiveaway.started) {
            let game = message.content.substr("dmod.giveaway ".length);
            message.channel.sendMessage('Setting up giveaway...');
            tempGiveaway.game = game;
            tempGiveaway.host = message.author.id;
            tempGiveaway.count = 0;
            tempGiveaway.users = [];
            giveawayBot.guilds.get(giveawayValues.guild_id).channels.get(giveawayValues.channel_id).setTopic(giveawayValues.new_topic.replace("{GAME}", game))
            message.guild.channels.get(giveawayValues.channel_id).sendMessage(`@here\n**New Giveaway:** ${tempGiveaway.game}\n**Host:** <@${tempGiveaway.host}>\n**Entrees:** 0\n**Chance of winning:** Infinity%\n**Giveaway ends in 5 minutes.**\n\nClick the ${giveawayValues.raw_emoji} reaction or PM ${giveawayBot.user} \`join\` to join the giveaway or \`leave\` to leave it.`).then(m => {
                tempGiveaway.message_id = m.id;
                m.react(giveawayValues.raw_emoji);
                tempGiveaway.started = true;
                tempGiveaway.timeout = giveawayBot.setTimeout(() => {
                    giveawayBot.guilds.get(giveawayValues.guild_id).channels.get(giveawayValues.channel_id).messages.get(tempGiveaway.message_id).clearReactions();
                    tempGiveaway.current_user = tempGiveaway.users[Math.floor(Math.random() * tempGiveaway.users.length)];
                    tempGiveaway.users = tempGiveaway.users.filter(f => f !== tempGiveaway.current_user);
                    giveawayBot.fetchUser(tempGiveaway.current_user).then(u => {
                        u.sendMessage(`To claim the prize ${tempGiveaway.game}, please type \`claim\` in this chat. (Case sensitive!)`);
                        giveawayBot.guilds.get(giveawayValues.guild_id).channels.get(giveawayValues.channel_id).messages.get(tempGiveaway.message_id).edit(`@here\n**Giveaway:** ${tempGiveaway.game}\n**Host:** <@${tempGiveaway.host}>\n**Entrees:** ${tempGiveaway.count}\n**Chance of winning:** ${100 / tempGiveaway.count}%\n\n***Giveaway is over.***\n<@${tempGiveaway.current_user}> has 2 minutes to claim the prize.`);
                        giveawayBot.setTimeout(switchUser, giveawayValues.gtimeout)
                    }).catch(() => {
                        giveawayBot.guilds.get(giveawayValues.guild_id).channels.get(giveawayValues.channel_id).messages.get(tempGiveaway.message_id).edit(`@here\n**Giveaway:** ${tempGiveaway.game}\n**Host:** <@${tempGiveaway.host}>\n**Entrees:** ${tempGiveaway.count}\n**Chance of winning:** ${100 / tempGiveaway.count}%\n\nNo one claimed the prize.`);
                        tempGiveaway.started = false;
                        tempGiveaway.message_id = "";
                        tempGiveaway.game = "";
                        tempGiveaway.host = "";
                        tempGiveaway.current_user = "";
                        tempGiveaway.users = [];
                        tempGiveaway.count = 0;
                        giveawayBot.guilds.get(giveawayValues.guild_id).channels.get(giveawayValues.channel_id).setTopic(giveawayValues.new_topic.replace("{GAME}", "None"));
                    });
                }, giveawayValues.timeout)
            });
        } else {
            message.reply("Giveaway already active.");
            console.log(tempGiveaway.getTime());
        }
    }
    if (tempGiveaway.started && message.content == "claim" && tempGiveaway.current_user === message.author.id) {
        message.reply("You have been successfully claimed for the game " + tempGiveaway.game + ", the host <@" + tempGiveaway.host + "> will be with you shortly.");
        giveawayBot.users.get(tempGiveaway.host).sendMessage(`${message.author} successfully accepted the giveaway prize.`)
        giveawayBot.guilds.get(giveawayValues.guild_id).channels.get(giveawayValues.channel_id).messages.get(tempGiveaway.message_id).edit(`@here\n**Giveaway:** ${tempGiveaway.game}\n**Host:** <@${tempGiveaway.host}>\n**Entrees:** ${tempGiveaway.count}\n**Chance of winning:** ${100 / tempGiveaway.count}%\n\n<@${message.author.id}> has claimed the prize.`);
        tempGiveaway.started = false;
        tempGiveaway.message_id = "";
        tempGiveaway.game = "";
        tempGiveaway.host = "";
        tempGiveaway.current_user = "";
        tempGiveaway.users = [];
        tempGiveaway.count = 0;
        giveawayBot.guilds.get(giveawayValues.guild_id).channels.get(giveawayValues.channel_id).setTopic(giveawayValues.new_topic.replace("{GAME}", "None"));
    }
    if (tempGiveaway.started && message.content == "join") {
        if (!tempGiveaway.users.includes(message.author.id)) {
            tempGiveaway.users.push(message.author.id);
            tempGiveaway.count = tempGiveaway.users.length;
            message.channel.sendMessage(`You have opted in for the ${tempGiveaway.game} giveaway!`);
            console.log("Added " + msg.author.username + " to giveaway via PM.");
        } else {
            message.channel.sendMessage(`You already opted in!`);
        }
    }
    if (tempGiveaway.started && message.content == "leave") {
        if (tempGiveaway.users.includes(message.author.id)) {
            tempGiveaway.users.splice(tempGiveaway.users.indexOf(message.author.id), 1);
            tempGiveaway.count = tempGiveaway.users.length;
            message.author.sendMessage(`You have opted out for the ${tempGiveaway.game} giveaway!`);
        } else {
            message.channel.sendMessage(`You aren't in the giveaway!`);
        }
    }
})
//=========================== GiveawayBot Code Ends ============================================= //

// ========================== Change Command ==================================================== //
bot.registerCommand('change', (msg, args) => {
    if (config.adminids.indexOf(msg.author.id) > -1) {
        if (args[0] == 'notification') {
            config.notificationChannel = msg.channel.id;
            bot.createMessage(msg.channel.id, 'The NotificationChannel has been changed to - ' + msg.channel.name);
        } else if (args[0] == 'timeout') {
            giveawayValues.timeout = args[1];
            bot.createMessage(msg.channel.id, 'The timeout has been updated to - ' + args[1] + '.');
        }
    }
}, {
    description: 'Change notification channel.',
    fullDescription: 'Used to change the notification channel.'
})

// ========================== Kick Command ====================================================== //
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

// ========================== Mika Command ====================================================== //
bot.registerCommand('mika', (msg, args) => {
    let mikaImage = tools.pickMikaImage()

    bot.createMessage(msg.channel.id, {
        embed: {
            image: mikaImage
        }
    })
})

// ========================== Invite Command ==================================================== //
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

// ========================== Kill Myself Command =============================================== //
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

// ========================== Kill Me Command =================================================== //
bot.registerCommand('killme', (msg, args) => {
    let killMeImage = tools.pickKillImage()

    // Mika's requested killme command
    bot.createMessage(msg.channel.id, {
        embed: {
            image: killMeImage
        }
    })
})

// ========================== Hugs Command ====================================================== //
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

// ========================== Bite Command ====================================================== //
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

// ========================== Jova Command ====================================================== //
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

// ========================== Git Command ======================================================= //
bot.registerCommand('git', (msg, args) => {
    bot.createMessage(msg.channel.id, 'You can find the git repo for Tron here: https://github.com/Alcha/Tron')
}, {
    description: 'Display link to git repository.',
    fullDescription: 'Displays the link to the git repository on GitHub.'
})

// ========================== Blush Command ===================================================== //
bot.registerCommand('blush', (msg, args) => {
    let blushImage = tools.pickBlushImage()

    bot.createMessage(msg.channel.id, {
        embed: {
            image: blushImage
        }
    })
})

// ========================== Rawr Command ====================================================== //
bot.registerCommand('rawr', (msg, args) => {
    bot.createMessage(msg.channel.id, {
        embed: {
            image: {
                url: 'https://cdn.discordapp.com/attachments/254496813552238594/278798600505393152/raw.gif'
            }
        }
    })
})

// ========================== Rekt Command ====================================================== //
bot.registerCommand('rekt', (msg, args) => {
    let rektImage = tools.pickRektImage()

    bot.createMessage(msg.channel.id, {
        embed: {
            image: rektImage
        }
    })
})

// ========================== Add Role Command ================================================== //
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

// ========================== List Roles Command ================================================ //
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

// ========================== Leave Role Command ================================================ //
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

// ========================== Join Role Command ================================================= //
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

// ========================== onGuildBanAdd Event Handler ======================================= //
bot.on("guildBanAdd", (guild, user) => {
    bot.createMessage(config.notificationChannel, ":hammer: ``[" + tools.getFormattedTimestamp() + "]`` " +
        "User: <@" + user.id + "> has been banned.")
}, {
    description: 'Log user ban.',
    fullDescription: 'If a user is banned, it is logged in the notificationChannel.'
})

// ========================== onGuildBanRemove Event Handler ==================================== //
bot.on("guildBanRemove", (guild, user) => {
    bot.createMessage(config.notificationChannel, ":x::hammer: ``[" + tools.getFormattedTimestamp() + "]`` " +
        "User: <@" + user.id + "> has been unbanned.")
}, {
    description: 'Log user unban.',
    fullDescription: 'If a user is unbanned, it is logged in the notificationChannel.'
})

// ========================== Connect Bot ======================================================= //
bot.connect()
