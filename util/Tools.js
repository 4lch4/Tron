"use strict"

const config = require('./config.json')
const roleNames = config.roleNames;
const moment = require('moment-timezone')
const exhentaiCookies = `\`\`\`
{
    "domain": ".exhentai.org",
    "expirationDate": 1513272210.164014,
    "hostOnly": false,
    "httpOnly": false,
    "name": "igneous",
    "path": "/",
    "sameSite": "no_restriction",
    "secure": false,
    "session": false,
    "storeId": "0",
    "value": "a6e7d2f5a",
    "id": 1
},
{
    "domain": ".exhentai.org",
    "expirationDate": 1513272210.013624,
    "hostOnly": false,
    "httpOnly": false,
    "name": "ipb_member_id",
    "path": "/",
    "sameSite": "no_restriction",
    "secure": false,
    "session": false,
    "storeId": "0",
    "value": "2769344",
    "id": 2
},
{
    "domain": ".exhentai.org",
    "expirationDate": 1513272210.013661,
    "hostOnly": false,
    "httpOnly": false,
    "name": "ipb_pass_hash",
    "path": "/",
    "sameSite": "no_restriction",
    "secure": false,
    "session": false,
    "storeId": "0",
    "value": "76b3c7545dc4e7a7419e6cdcf66c0258",
    "id": 3
},
{
    "domain": ".exhentai.org",
    "expirationDate": 1513460376.567466,
    "hostOnly": false,
    "httpOnly": false,
    "name": "s",
    "path": "/",
    "sameSite": "no_restriction",
    "secure": false,
    "session": false,
    "storeId": "0",
    "value": "59dccef4b",
    "id": 4
},
{
    "domain": ".exhentai.org",
    "expirationDate": 1513272213.181294,
    "hostOnly": false,
    "httpOnly": false,
    "name": "uconfig",
    "path": "/",
    "sameSite": "no_restriction",
    "secure": false,
    "session": false,
    "storeId": "0",
    "value": "dm_t",
    "id": 5
},
{
    "domain": "exhentai.org",
    "expirationDate": 1518929873.965958,
    "hostOnly": true,
    "httpOnly": false,
    "name": "lv",
    "path": "/",
    "sameSite": "no_restriction",
    "secure": false,
    "session": false,
    "storeId": "0",
    "value": "1487307036-1487393875",
    "id": 6
}\`\`\``;

// ============================================================================================== //
var exports = module.exports = {}

exports.getExhentaiCookies = function () {
    return exhentaiCookies;
};

exports.getGiveawayBot = function () {
    const Discord = require('discord.js');
    let ent = require("entities");
    const Helper = require("./Helper.js");

    let giveawayBot = new Discord.Client({
        autoReconnect: true,
        maxCachedMessages: 1000,
        bot: true
    });

    const giveawayValues = {
        guild_id: "254496813552238594", // Guild to post it to
        channel_id: "280527304566898688", // Channel to post it to
        emoji: "gift", // Leave this alone pls
        raw_emoji: ent.decodeHTML("&#x1F381;"), // Leave this alone pls
        new_topic: "Current Giveaway: {GAME}", // Topic format
        timeout: 300000, // Giveaway length in milliseconds
        gtimeout: 120000 // Claim Prize length in milliseconds
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

    giveawayBot.on("ready", function () {
        console.log('GiveawayBot ready.');
    });

    giveawayBot.on("message", (message) => {
        if (message.author.giveawayBot) {
            return;
        }
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
    });

    return giveawayBot;
};

// ========================== Standard Embeds Function ========================================== //
exports.embeds = function (msg, args, title, desc, thumbn, bot) {
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
exports.messageIs = function (msg, str) {
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

exports.messageStartsWith = function (msg, str) {
    let input = ""

    if (msg.content != undefined) {
        input = msg.content.toUpperCase()
    } else {
        input = msg.toUpperCase()
    }
    let comparison = str.toUpperCase()
    return input.startsWith(comparison)
}

exports.allowedRole = function (comparison) {
    let allowed = false;
    roleNames.forEach(function (curr, index, arr) {
        if (curr != null && curr.toLowerCase() == comparison) {
            allowed = true;
        }
    })

    return allowed;
}

function getRoleId(msg, comparison) {
    let id = "";

    msg.guild.roles.forEach(function (curr, index, values) {
        if (curr.name.toLowerCase() == comparison) {
            id = curr.id;
        }
    })

    return id;
}

exports.removeAllRoles = function (userId, msg, bot) {
    for (var x = 0; x < roleNames.length; x++) {
        let roleId = getRoleId(msg, roleNames[x].toLowerCase());
        msg.guild.removeMemberRole(userId, roleId);
    }

    bot.createMessage(msg.channel.id, "You've been removed from all the roles available to you.");
    msg.delete();
}

exports.addAllRoles = function (userId, msg, bot) {
    for (var x = 0; x < roleNames.length; x++) {
        let roleId = getRoleId(msg, roleNames[x].toLowerCase());
        msg.guild.addMemberRole(userId, roleId);
    }

    bot.createMessage(msg.channel.id, "You've been added to all the roles available to you.");
    msg.delete();
}
exports.getRoleId = function (msg, comparison) {
    let id = "";

    msg.guild.roles.forEach(function (curr, index, values) {
        if (curr.name.toLowerCase() == comparison) {
            id = curr.id;
        }
    })

    return id;
}

exports.concatArgs = function (args) {
    let str = "";

    if (args.length > 1) {
        args.forEach(function (curr, index, arr) {
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

exports.memberIsMod = function (msg) {
    let roles = msg.channel.guild.members.get(msg.author.id).roles;
    let found = false;

    roles.forEach(function (curr, index, arr) {
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
exports.notificationEmbeds = function (channel, title, desc, thumbn, bot) {
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

exports.getFormattedTimestamp = function () {
    return moment().tz(config.defaultTimezone).format('HH:mm:ss MM/DD/YYYY')
}

exports.messageIsWhyCmd = function (msg) {
    let content = msg.content
    let found = false

    if (content.includes("?")) {
        content = content.substring(0, content.indexOf("?"))
    }

    whyCmds.forEach(function (cmd) {
        if (exports.messageIs(content, cmd)) {
            found = true
        }
    })

    return found
}

exports.pickKillImage = function () {
    let images = [
        "https://i.imgur.com/Db0ghmE.gif", "https://i.imgur.com/rBYOkZq.gif",
        "https://i.imgur.com/gMylE3v.gif", "https://i.imgur.com/NeD9pVR.gif"
    ];

    let random = getRandom(0, 4);

    return {
        url: images[random]
    }
};

exports.pickBiteImage = function () {
    let images = [
        "https://i.imgur.com/2t4yRJL.gif", "https://i.imgur.com/pCRB4bm.gif",
        "https://i.imgur.com/A1UWYE0.gif", "https://i.imgur.com/TmUUJzF.gif",
        "https://i.imgur.com/T88sRvd.gif", "https://i.imgur.com/GV4mBag.gif",
        "https://i.imgur.com/wpQmQag.gif", "https://i.imgur.com/Yr6uo41.gif",
        "https://i.imgur.com/66aDTjt.gif", "https://i.imgur.com/DtMIIRp.gif",
        "https://i.imgur.com/CJ1kNDg.gif"
    ];

    let random = getRandom(0, 11);

    return {
        url: images[random]
    }
};

exports.pickMikaImage = function () {
    let images = ["https://i.imgur.com/WtdWRrt.png"];

    let random = getRandom(0, images.length);

    return {
        url: images[random]
    }
}

exports.pickKickImage = function () {
    let images = [
        "https://i.imgur.com/B0EvFzc.gif", "https://i.imgur.com/5oZkxax.gif",
        "https://i.imgur.com/5oZkxax.gif", "https://i.imgur.com/5oZkxax.gif",
        "https://i.imgur.com/955TDwD.gif", "https://i.imgur.com/8X13K1z.gif",
        "https://i.imgur.com/lP0kfb7.gif", "https://i.imgur.com/4vcwdhp.gif"
    ];

    let random = getRandom(0, images.length);

    return {
        url: images[random]
    }
}

exports.pickRektImage = function () {
    let images = ["https://media.giphy.com/media/vSR0fhtT5A9by/giphy.gif"]

    let random = getRandom(0, images.length);

    return {
        url: images[random]
    }
}

exports.pickHugImage = function () {
    let images = [
        "http://i.imgur.com/Lz2E3KQ.gif", "http://i.imgur.com/EjZ3EZF.gif",
        "http://i.imgur.com/9JkgObE.gif", "http://i.imgur.com/znBb48H.gif",
        "http://i.imgur.com/1DrVOy9.gif", "http://i.imgur.com/WisHWD1.gif",
        "http://i.imgur.com/cJ2UgeJ.gif", "http://i.imgur.com/Uv61Pc1.gif",
        "http://i.imgur.com/MdqyZwH.gif", "http://i.imgur.com/Zg7JRkI.gif",
        "http://i.imgur.com/MdqyZwH.gif", "http://i.imgur.com/PeGeJHx.gif",
        "http://i.imgur.com/UZKKA1p.gif", "http://i.imgur.com/3P9iz7F.gif",
        "http://i.imgur.com/zn43njB.gif", "http://i.imgur.com/RcE4Q39.gif",
        "http://i.imgur.com/gU4GyQW.gif", "http://i.imgur.com/1eijPRd.gif",
        "http://i.imgur.com/1eijPRd.gif", "http://i.imgur.com/qe9rhLw.gif",
        "http://i.imgur.com/VJrLyEK.gif", "http://i.imgur.com/SFfDubn.gif",
        "http://i.imgur.com/bwap4d8.gif", "http://i.imgur.com/C9ta1Sa.gif",
        "http://i.imgur.com/uJFvpy8.gif", "http://i.imgur.com/LE9wpHg.gif",
        "http://i.imgur.com/HN7xy34.gif", "http://i.imgur.com/Wlzh53b.gif",
        "http://i.imgur.com/0tFzfoS.gif", "http://i.imgur.com/toGIV2F.gif",
        "http://i.imgur.com/Hc4a4qy.gif", "http://i.imgur.com/t7jkk6Z.gif",
        "http://i.imgur.com/NTomm7O.gif", "http://i.imgur.com/qIRjVY5.gif",
        "http://i.imgur.com/Y2kcaZT.gif", "http://i.imgur.com/m8Dogv7.gif",
        "http://i.imgur.com/GaLRCro.gif", "http://i.imgur.com/hjLZk23.gif",
        "http://i.imgur.com/b9eQ6ZN.gif", "http://i.imgur.com/F34uEVD.gif",
        "http://i.imgur.com/QEvMlAf.gif", "http://i.imgur.com/fkDph6U.gif",
        "http://i.imgur.com/LQj1kvn.gif", "http://i.imgur.com/tcjdQI8.gif",
        "http://i.imgur.com/EnmebIW.gif", "http://i.imgur.com/RaCDnpI.gif",
        "http://i.imgur.com/5OWXPFe.gif", "https://i.imgur.com/ZGGijVt.gif"
    ];

    let random = getRandom(0, images.length);

    return {
        url: images[random]
    }
}

exports.pickBlushImage = function () {
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

    let random = getRandom(0, images.length)
    return {
        url: images[random]
    }
}

// ========================== Puppet the Bot =================================================== //
const readline = require('readline')
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

rl.on('line', (input) => {
    let intake = input.split(' ')
    switch (intake[0]) {
        case 'morty':
            bot.createMessage(mortysRoomId, intake[1])
            break;
        case 'secret':
            bot.createMessage(secretStuffRoomId, intake[1])
            break;
    }
})