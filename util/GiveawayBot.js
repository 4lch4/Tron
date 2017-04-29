"use strict"

/**
 * All of this code was given to me by a friend on Discord so I know very little of the choice made
 * when designing the architecture.
 */

var Discord = require('discord.js');
let ent = require("entities");
const Helper = require("./Helper.js");
const config = require('./config.json');

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
    gtimeout: 1500000 // Claim Prize length in milliseconds
};

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

class GiveawayBot {
    constructor() {
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
                    giveawayBot.users.get(tempGiveaway.current_user).sendMessage(`To claim the prize ${tempGiveaway.game}, please type \`claim\` in this chat. (Case sensitive!). You have 25 minutes.`);
                    giveawayBot.guilds.get(giveawayValues.guild_id).channels.get(giveawayValues.channel_id).messages.get(tempGiveaway.message_id).edit(`@here\n**Giveaway:** ${tempGiveaway.game}\n**Host:** <@${tempGiveaway.host}>\n**Entrees:** ${tempGiveaway.count}\n**Chance of winning:** ${100 / tempGiveaway.count}%\n\n***Giveaway is over.***\n<@${tempGiveaway.current_user}> has 25 minutes to claim the prize.`);
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
                                giveawayBot.guilds.get(giveawayValues.guild_id).channels.get(giveawayValues.channel_id).messages.get(tempGiveaway.message_id).edit(`@here\n**Giveaway:** ${tempGiveaway.game}\n**Host:** <@${tempGiveaway.host}>\n**Entrees:** ${tempGiveaway.count}\n**Chance of winning:** ${100 / tempGiveaway.count}%\n\n***Giveaway is over.***\n<@${tempGiveaway.current_user}> has 25 minutes to claim the prize.`);
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
    }

    getGiveawayBot() {
        return giveawayBot;
    }
}

module.exports = GiveawayBot;