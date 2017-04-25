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
const Eris = require("eris");
const config = require('./util/config.json');
const info = require('./util/package.json');
const readline = require('readline');
const _ = require('lodash');
const moment = require('moment-timezone');
const tools = require('./util/Tools.js');
const roleNames = config.roleNames;

const fs = require('fs');
const mysql = require('mysql');
const connection = mysql.createConnection({
    host: config.mysql.host,
    user: config.mysql.user,
    password: config.mysql.password,
    database: config.mysql.database
});

connection.connect();

function incrementCommandUse(commandName) {
    let queryString = "UPDATE commands SET `COMMAND_USE_COUNT` = `COMMAND_USE_COUNT` + 1 WHERE `COMMAND_NAME` = '" + commandName + "'";
    connection.query(queryString, (err, res, fields) => {
        if (err) throw err;
    });
}

// =============================Dmth2m2GGhmypbd@3430zd============================================================ //
const redis = require('redis');
const client = redis.createClient();

client.on('error', err => {
    console.log(err)
});
// ========================== Bot Declaration =================================================== //
const bot = new Eris.CommandClient(config.token, {}, {
    description: info.description,
    owner: info.author,
    prefix: config.prefix
});

// ========================== GiveawayBot Code Begins =========================================== //
let giveawayBot = tools.getGiveawayBot();

giveawayBot.login(config.token).then(() => {
    console.log("Logged in");
}).catch((e) => {
    throw e;
});
//=========================== GiveawayBot Code Ends ============================================= //

// ========================== Change Command ==================================================== //
bot.registerCommand('change', (msg, args) => {
    // Verify user is part of admins
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
});

// ========================== Cry Command ======================================================= //
bot.registerCommand('cry', (msg, args) => {
    tools.pickCryImage((cryImage) => {
        bot.createMessage(msg.channel.id, {
            embed: {
                image: cryImage
            }
        });

        incrementCommandUse('cry');
    });
}, {
    description: 'Displays random cry gif.',
    fullDescription: 'Displays a random cry gif.'
});

// ========================== Love Command ====================================================== //
bot.registerCommand('love', (msg, args) => {
    if (msg.channel.guild != undefined) {
        tools.pickLoveImage((loveImage) => {
            let message = '';

            if (msg.mentions[0] != undefined) {
                let user = msg.mentions[0].username;
                message = "**" + user + "**, you've been loved by **" + msg.author.username + "**.";
            }

            bot.createMessage(msg.channel.id, {
                content: message,
                embed: {
                    image: loveImage
                }
            });
        });

        incrementCommandUse('love');
    }
}, {
    description: 'Displays random love gif.',
    fullDescription: 'Displays a random love gif and the name of the person you mention.'
});

// ========================== Invite Command ==================================================== //
bot.registerCommand('invite', (msg, args) => {
    if (msg.channel.guild != undefined) {
        if (args.length < 1) {
            return "Would you like me to join your server? :smiley: \n" + config.invitelink;
        } else {
            let comparison = args[0].toLowerCase();
            let members = msg.channel.guild.members;

            members.forEach((value, key, mapObj) => {
                if (value.user != undefined) {
                    let username = value.user.username.toLowerCase();

                    if (value.nick != undefined) {
                        username = value.nick.toLowerCase();
                    }

                    if (username == comparison) {
                        console.log('Match found = ' + username);
                        msg.channel.editPermission(value.user.id, 1024, null, 'member');
                    }
                }
            })
        }
    } else {
        console.log('In isNan else loop.');
    }
}, {
    description: 'Generate an invite link or invite a user to your channel.',
    fullDescription: 'If you provide a username, the user will be added to your channel. ' +
        'Otherwise, the invite link for Tron is returned.'
});

// ========================== Ping Command ====================================================== //
bot.registerCommand('ping', (msg, args) => {
    return 'Pong!';
}, {
    description: 'Pong!',
    fullDescription: 'Used to check if the bot is up.'
});

// ========================== Kill Myself Command =============================================== //
bot.registerCommand('kms', (msg, args) => {
    bot.createMessage(msg.channel.id, {
        content: '',
        embed: {
            image: {
                url: 'https://i.imgur.com/rC0Yx6S.gif'
            }
        }
    });

    incrementCommandUse('kms');
});

// ========================== Kill Command ====================================================== //
bot.registerCommand('kill', (msg, args) => {
    tools.pickKillImage((img) => {
        var message = '';
        var user = msg.mentions[0].username;
        message = "**" + user + "**, you've been killed by **" + msg.author.username + "**.";

        bot.createMessage(msg.channel.id, message, {
            file: img,
            name: 'Temp.gif'
        });

        incrementCommandUse('kill');
    });
}, {
    description: 'Displays a random killing gif.',
    fullDescription: 'Displays a random killing reaction gif and the name of the individual mentioned.'
});

bot.registerCommandAlias('Kill', 'kill');
// ========================== Kill Me Command =================================================== //
bot.registerCommand('killme', (msg, args) => {
    tools.pickKillMeImage((killMeImage) => {
        // Mika's requested killme command
        bot.createMessage(msg.channel.id, {
            embed: {
                image: killMeImage
            }
        });
    });

    incrementCommandUse('killme');
});

// ========================== Hugs Command ====================================================== //
bot.registerCommand('hugs', (msg, args) => {
    if (msg.mentions[0] != undefined) {
        tools.pickHugImage((hugImage) => {
            var message = '';
            var user = msg.mentions[0].username;
            message = "**" + user + "**, has received hugs from **" + msg.author.username + "**.";

            bot.createMessage(msg.channel.id, {
                content: message,
                embed: {
                    image: hugImage
                }
            });

            incrementCommandUse('hugs');
        });
    } else {
        return "Invalid input, please make sure to mention a user.";
    }
});

// ========================== Kick Command ====================================================== //
bot.registerCommand('kick', (msg, args) => {
    if (msg.author.id != mikaId && msg.mentions[0] != undefined) {
        tools.pickKickImage((kickImage) => {
            let user = msg.mentions[0].username;
            let message = "**" + user + "**, you've been kicked by **" + msg.author.username + "**.";

            bot.createMessage(msg.channel.id, {
                content: message,
                embed: {
                    image: kickImage
                }
            });

            incrementCommandUse('kick');
        });
    } else {
        return "Invalid input, please make sure to mention a user.";
    }
}, {
    description: 'Displays random kick gif',
    fullDescription: 'Displays a random kick gif and the name of the person you mention.'
});

// ========================== Bite Command ====================================================== //
bot.registerCommand('bite', (msg, args) => {
    tools.pickBiteImage((biteImage) => {
        var message = '';

        if (msg.mentions[0] != undefined) {
            var user = msg.mentions[0].username;
            message = "**" + user + "**, you've been bitten by **" + msg.author.username + "**.";
        }

        bot.createMessage(msg.channel.id, {
            content: message,
            embed: {
                image: biteImage
            }
        });

        incrementCommandUse('bite');
    });
});

// ========================== Jova Command ====================================================== //
bot.registerCommand('jova', (msg, args) => {
    bot.createMessage(msg.channel.id, 'Who is <@78694002332803072>? Does <@78694002332803072> is gay?');

    incrementCommandUse('jova');
});

// ========================== onReady Event Handler ============================================= //
bot.on("ready", () => {
    console.log('Tron is ready!');
    if (!isNaN(config.notificationChannel)) {
        bot.createMessage(config.notificationChannel, config.notificationMessage + ' > ' + tools.getFormattedTimestamp());
    }

    bot.editStatus('busy', {
        name: config.defaultgame,
        type: 1,
        url: ''
    })
})

// ========================== Git Command ======================================================= //
bot.registerCommand('git', (msg, args) => {
    bot.createMessage(msg.channel.id, 'You can find the git repo for Tron here: https://github.com/Alcha/Tron');
    incrementCommandUse('git');
}, {
    description: 'Display link to git repository.',
    fullDescription: 'Displays the link to the git repository on GitHub.'
});

// ========================== Blush Command ===================================================== //
bot.registerCommand('blush', (msg, args) => {
    tools.pickBlushImage((blushImage) => {
        bot.createMessage(msg.channel.id, {
            embed: {
                image: blushImage
            }
        });
        incrementCommandUse('blush');
    });
});

// ========================== Rawr Command ====================================================== //
bot.registerCommand('rawr', (msg, args) => {
    bot.createMessage(msg.channel.id, {
        embed: {
            image: {
                url: 'https://cdn.discordapp.com/attachments/254496813552238594/278798600505393152/raw.gif'
            }
        }
    });
    incrementCommandUse('rawr');
});

// ========================== Rekt Command ====================================================== //
bot.registerCommand('rekt', (msg, args) => {
    tools.pickRektImage((rektImage) => {
        bot.createMessage(msg.channel.id, {
            embed: {
                image: rektImage
            }
        });
    });
    incrementCommandUse('rekt');
});

// ========================== Add Role Command ================================================== //
bot.registerCommand('addr', (msg, args) => {
    if (msg.channel.guild != null) {
        if (tools.memberIsMod(msg)) {
            let comparison = tools.concatArgs(args);

            console.log("comparison = " + comparison);

            let roles = msg.channel.guild.roles;

            roles.forEach((value, key, mapObj) => {
                if (value.name != null) {
                    let name = value.name.toLowerCase();
                    console.log("Name = " + name + "; Comparison = " + comparison + ";");

                    if (name == comparison) {
                        roleNames.push(value.name);
                        bot.createMessage(msg.channel.id, "Added " + value.name + " to list of available roles.");
                    }
                }
            })
        }
    }
});

// ========================== List Roles Command ================================================ //
bot.registerCommand('listr', (msg, args) => {
    let message = "List of currently available roles:\n"

    roleNames.forEach((curr, index, arr) => {
        message += "- **" + curr + "**\n";
    })

    bot.createMessage(msg.channel.id, message);
}, {
    description: 'List roles that are available to join.',
    fullDescription: 'Lists the roles that have been added by an administrator that are available.'
});

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
                    incrementCommandUse('leaver');
                }
            }
        }
    }
});

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
                    incrementCommandUse('joinr');
                }
            }
        }
    }
}, {
    description: 'Places you into the requested server role.',
    fullDescription: 'Server admins are able to add select roles to the bot so that anyone can join the role with this command.'
});

// ========================== List Peeps (Not for public) ======================================= //
bot.registerCommand('listPeeps', (msg, args) => {
    if (msg.author.id == config.owner) {
        if (args[0] != null) {
            client.get(args[0], function (err, reply) {
                console.log("reply = " + reply);
            });
        }
    }
});

// ========================== Exhentai Command ====================================================== //
bot.registerCommand('exhentai', (msg, args) => {
    if (msg.channel.id != undefined) {
        bot.createMessage(msg.channel.id, tools.getExhentaiCookies().toString());
    }
})

// ========================== Utah Command ====================================================== //
bot.registerCommand('utah', (msg, args) => {
    if (msg.channel.guild != undefined) {
        if (msg.channel.guild.id == 254496813552238594) {
            bot.createMessage(msg.channel.id, "<@139474184089632769> <:Tiggered:256668458480041985>");
            incrementCommandUse('utah');
        } else if (msg.channel.guild.id == 197846974408556544) {
            bot.createMessage(msg.channel.id, "<@139474184089632769> <:Tiggered:298313391444066305>");
            incrementCommandUse('utah');
        } else {
            console.log("Guild = " + msg.guild.name);
            console.log("id = " + msg.guild.id);
        }
    }
}, {
    description: 'A command to poke fun at a good friend.',
    fullDescription: 'Used to poke fun at a good friend. -Alcha'
});

bot.registerCommandAlias('Utah', 'utah');

// ========================== Alex Command ====================================================== //
bot.registerCommand('alex', (msg, args) => {
    if (msg.channel.guild != undefined) {
        if (msg.channel.guild.id == 254496813552238594) {
            bot.createMessage(msg.channel.id, "<@!191316261299290112> 🖕")
            incrementCommandUse('alex');
        }
    }
}, {
    description: 'A command for a good friend of the developer.',
    fullDescription: 'Used to show my love for a good friend. -Alcha'
});

bot.registerCommandAlias('Alex', 'alex');

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
        } else if (tools.messageIs(msg, 'hello')) {
            bot.createMessage(msg.channel.id, 'New fone who dis?')
        } else if (tools.messageIs(msg, 'bye')) {
            bot.createMessage(msg.channel.id, 'https://cdn.discordapp.com/attachments/238466589362487306/258896018354077697/byefelicia.png')
        } else if (tools.messageIs(msg, 'god damn')) {
            bot.createMessage(msg.channel.id, "https://i.imgur.com/ULUZMtV.gifv")
        }
    }
});

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
});

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
});

// ========================== onGuildBanAdd Event Handler ======================================= //
bot.on("guildBanAdd", (guild, user) => {
    bot.createMessage(config.notificationChannel, ":hammer: ``[" + tools.getFormattedTimestamp() + "]`` " +
        "User: <@" + user.id + "> has been banned.")
}, {
    description: 'Log user ban.',
    fullDescription: 'If a user is banned, it is logged in the notificationChannel.'
});

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