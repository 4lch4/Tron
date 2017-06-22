"use strict"

const INVALID_INPUT = "Invalid input, please make sure to mention a user.";
// ============================================================================================== //
const config = require('./util/config.json');
const IOTools = require('./util/IOTools.js');
const Tools = require('./util/Tools.js');
const info = require('./package.json');
const Canvas = require("canvas");

const ioTools = new IOTools();
const tools = new Tools();

const roleNames = config.roleNames;
const Eris = require("eris");

// For crash logging
const Raven = require('raven');
Raven.config('https://48c87e30f01f45a7a112e0b033715f3d:d9b9df5b82914180b48856a41140df34@sentry.io/181885').install();

// ========================== Bot Declaration =================================================== //
const bot = new Eris.CommandClient(config.token, {}, {
    description: info.description,
    owner: info.author,
    prefix: config.prefix
});

// ========================== External Cmd Files ================================================ //
const Ship = require('./cmds/Ship');
const ship = new Ship();

const Reactions = require('./cmds/Reactions');
const reactions = new Reactions(bot);

const Marriage = require('./cmds/Marriage');
const marriage = new Marriage();

const Lewds = require('./cmds/Lewds');
const lewds = new Lewds();

// ========================== RSS Reader ======================================================== //
const RSSReader = require('./util/RSSReader.js');

let xkcdReader;

function setupRssReaders() {
    xkcdReader = new RSSReader({
        url: 'https://xkcd.com/rss.xml',
        feedName: 'xkcd'
    }).parseFeed((comic) => {
        ioTools.storeComic(comic, (success) => {
            if (success) {
                bot.createMessage(config.crComics, "New " + comic.feedName.toUpperCase() + " comic!\n" + comic.url);
            }
        });
    });
}

// ========================== GiveawayBot Code Begins =========================================== //
const GiveawayBot = require('./util/GiveawayBot.js');
const giveawayBot = new GiveawayBot().getGiveawayBot();

giveawayBot.login(config.token).then(() => {
    console.log("Logged in");
}).catch((e) => {
    throw e;
});

// ========================== Admin Commands ==================================================== //
let adminCmd = bot.registerCommand('admin', (msg, args) => {

});

adminCmd.registerSubcommand('list', (msg, args) => {
    if (config.adminids.includes(msg.author.id) && args.length == 1) {
        if (args[0].toLowerCase() == "servers") {
            return 'Server count = ' + bot.guilds.size;
        }
    }
});

function getMember(msg, user) {
    return new Promise((resolve, reject) => {
        msg.channel.guild.members.forEach((member, index, array) => {
            if (member.user.id == user.id) {
                resolve(member);
            }
        })
    });
}

function getTronMuteRole(msg) {
    return new Promise((resolve, reject) => {
        msg.channel.guild.roles.forEach((role, index, array) => {
            if (role.name == "tron-mute") {
                resolve(role);
            }
        });
    });
}

function getMuteStatus(member, roleId) {
    return new Promise((resolve, reject) => {
        if (member.roles.includes(roleId)) {
            resolve(true);
        } else {
            resolve(false);
        }
    });
}

bot.registerCommand('initialize', (msg, args) => {
    getTronMuteRole(msg).then((role) => {
        msg.channel.guild.channels.forEach((channel, index, collection) => {
            if (channel.type == 0) {
                channel.editPermission(role.id, undefined, 2048, "role").then((err) => {
                    if (err) Raven.captureException(err);
                });
            } else {
                channel.editPermission(role.id, undefined, 2097152, "role").then((err) => {
                    if (err) Raven.captureException(err);
                });
            }
        });

        bot.createMessage(msg.channel.id, "Permissions have been initalized.");
    });
}, {
    requirements: {
        roleNames: ["tron-mod"]
    }
});

function muteUser(msg, user, role) {
    return new Promise((resolve, reject) => {
        getMember(msg, user).then((member) => {
            getMuteStatus(member, role.id).then((muted) => {
                if (muted) {
                    msg.channel.guild.removeMemberRole(member.id, role.id).then((err) => {
                        if (err) {
                            Raven.captureException(err);
                        } else {
                            resolve(false);
                        }
                    });
                } else {
                    msg.channel.guild.addMemberRole(member.id, role.id).then((err) => {
                        if (err) {
                            Raven.captureException(err);
                        } else {
                            resolve(true);
                        }
                    });
                }
            });
        });
    });
}

// ========================== Mute Command ====================================================== //
bot.registerCommand('mute', (msg, args) => {
    if (msg.mentions[0] != undefined && msg.channel.guild != undefined) {
        getTronMuteRole(msg).then((role) => {
            msg.mentions.forEach((user, index, array) => {
                muteUser(msg, user, role).then((muted) => {
                    if (muted) {
                        bot.createMessage(msg.channel.id, {
                            embed: {
                                description: "**" + user.username + "** has been muted from text and voice by **" + msg.author.username + "**.",
                                color: 0x008000
                            }
                        });
                    } else {
                        bot.createMessage(msg.channel.id, {
                            embed: {
                                description: "**" + user.username + "** has been unmuted from text and voice by **" + msg.author.username + "**.",
                                color: 0x008000
                            }
                        });
                    }
                });
            });
        });
    } else {
        return "Please mention at least one user to mute.";
    }
}, {
    guildOnly: true,
    requirements: {
        roleNames: ["tron-mod"]
    }
});

// ========================== Cats Command (Requested by Neko) ================================== //
bot.registerCommand('cat', (msg, args) => {
    if (!isNaN(parseInt(args[0]))) {
        reactions.pickCatImage((img, filename) => {
            bot.createMessage(msg.channel.id, '', {
                file: img,
                name: filename
            });
        }, args[0]);
    } else {
        reactions.pickCatImage((img, filename) => {
            bot.createMessage(msg.channel.id, '', {
                file: img,
                name: filename
            });
        });
    }

    ioTools.incrementCommandUse('cat');
}, {
    argsRequired: false,
    caseInsensitive: true,
    description: 'Displays a random cat image or gif.',
    fullDescription: 'Displays a random cat image or gif that was supplied by Neko.',
    guildOnly: true,
});

// ========================== Rose Command (Requested by PrimRose) ============================== //
bot.registerCommand('rose', (msg, args) => {
    if (!isNaN(parseInt(args[0]))) {
        reactions.pickRoseImage((img, filename) => {
            bot.createMessage(msg.channel.id, '', {
                file: img,
                name: filename
            });
        }, args[0]);
    } else {
        reactions.pickRoseImage((img, filename) => {
            bot.createMessage(msg.channel.id, '', {
                file: img,
                name: filename
            });
        });
    }

    ioTools.incrementCommandUse('rose');
}, {
    argsRequired: false,
    caseInsensitive: true,
    description: 'Displays a random Eevee gif.',
    fullDescription: 'Displays a random Eevee gif that was supplied by Prim.',
    guildOnly: true,
});

// ========================== Nobulli Command (Compromise on request from Onyx) ================= //
bot.registerCommand('nobulli', (msg, args) => {
    if (args.length == 2 && !isNaN(parseInt(args[0]))) {
        reactions.pickNobulliImage((img) => {
            tools.getUsernames(args, bot, (usernames) => {
                let message = '';

                if (usernames.length == 2) {
                    message = "**" + usernames[0] + "**, don't you dare bulli **" + usernames[1] + "**!";
                }

                bot.createMessage(msg.channel.id, message, {
                    file: img,
                    name: 'Nobulli.gif'
                });
            });
        }, args[0]);
    } else if (msg.mentions.length > 0) {
        reactions.pickNobulliImage((img) => {
            tools.getUsernames(args, bot, (usernames) => {
                let message = '';

                if (usernames.length == 2) {
                    message = "**" + usernames[0] + "**, don't you dare bulli **" + usernames[1] + "**!";
                }

                bot.createMessage(msg.channel.id, message, {
                    file: img,
                    name: 'Nobulli.gif'
                });
            });
        });
    }
    ioTools.incrementCommandUse('nobulli');
}, {
    aliases: ['bulli', 'bully', 'nobully'],
    argsRequired: true,
    caseInsensitive: true,
    description: 'Displays a random nobulli gif.',
    fullDescription: 'Displays a random nobulli gif and the name of the user you mention.',
    guildOnly: true,
    usage: "@user e.g. `+nobulli @Alcha#2621`"
});

// ========================== Dreamy Command (Requested by Dreamy) ==================================================== //
bot.registerCommand('dreamy', (msg, args) => {
    reactions.pickDreamyImage((dreamyImage) => {
        bot.createMessage(msg.channel.id, '', {
            file: dreamyImage,
            name: 'Dreamy.gif'
        });
    });

    ioTools.incrementCommandUse('dreamy');
}, {
    aliases: ['dreamy'],
    caseInsensitive: true,
    description: 'Displays random dreamy gif.',
    fullDescription: 'Displays a random dreamy gif.'
});

// ========================== Change Command ==================================================== //
bot.registerCommand('change', (msg, args) => {
    //Verify user is part of admins
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

// ========================== Vape Nation Command (Requested by Lagucci Mane) =================== //
bot.registerCommand('vn', (msg, args) => {
    reactions.pickVNImage((img) => {
        bot.createMessage(msg.channel.id, '', {
            file: img,
            name: 'VapeNation.gif'
        });
    });

    ioTools.incrementCommandUse('vapenation');
}, {
    aliases: ['vapenash', 'vape'],
    description: "Vape nation, y'all.",
    caseInsensitive: true,
    fullDescription: 'Displays a random vape nation gif.'
});

// ========================== Cry Command ======================================================= //
bot.registerCommand('cry', (msg, args) => {
    reactions.pickCryImage((cryImage) => {
        bot.createMessage(msg.channel.id, '', {
            file: cryImage,
            name: 'Cry.gif'
        });

        ioTools.incrementCommandUse('cry');
    });
}, {
    aliases: ['crys', 'cried'],
    caseInsensitive: true,
    description: 'Displays random cry gif.',
    fullDescription: 'Displays a random cry gif.'
});

// ========================== Love Command ====================================================== //
bot.registerCommand('love', (msg, args) => {
    if (msg.channel.guild != undefined) {
        reactions.pickLoveImage((loveImage) => {
            let message = '';

            if (msg.mentions[0] != undefined) {
                let user = msg.mentions[0].username;
                message = "**" + user + "**, you've been loved by **" + msg.author.username + "**. :heart:";
            }

            bot.createMessage(msg.channel.id, message, {
                file: loveImage,
                name: 'Love.gif'
            });
        });

        ioTools.incrementCommandUse('love');
    }
}, {
    aliases: ['loves'],
    caseInsensitive: true,
    description: 'Displays random love gif.',
    fullDescription: 'Displays a random love gif and the name of the person you mention.'
});

// ========================== Send Lewd ========================================================= //
bot.registerCommand('newd', (msg, args) => {
    if (msg.channel.guild == undefined) {
        // Private message channel
        // TODO: Added private message support.
    } else {
        // Guild channel
        if (msg.mentions != undefined && msg.mentions.length > 0) {
            lewds.getButt((butt, filename) => {
                msg.mentions.forEach((mention, index, array) => {
                    mention.getDMChannel().then((channel) => {
                        bot.createMessage(channel.id, '', {
                            file: butt,
                            name: filename
                        }).then((message) => {
                            // Process message?
                            console.log("Message sent.");
                        }).catch((err) => {
                            if (err.code == 20009) {
                                bot.createMessage(channel.id, "Unfortunately, it appears you can't receive explicit content. Please add Tron to your friends and try again.");
                            }
                        });
                    });
                });

                if (msg.mentions.length == 1) {
                    bot.createMessage(msg.channel.id, "Your message has most likely been sent. :wink:");
                } else {
                    bot.createMessage(msg.channel.id, "Your messages have most likely been sent. :wink:");
                }

                ioTools.incrementCommandUse('newd');
            });
        }
    }
}, {
    aliases: ['sendnude', 'sendnudes', 'lewd', 'lewds', 'nudes', 'snude', 'sn', 'slideintodms', 'sendnoods', 'sendnoots'],
    caseInsensitive: true,
    deleteCommand: true,
    description: "For those spicy nudes you've been wanting ( . Y . )",
    fullDescription: ':lenny:',
    usage: "[@users] e.g. `+sendnudes @Alcha#2621 @MissBella#6480`"
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
                        msg.channel.editPermission(value.user.id, 1024, null, 'member');
                    }
                }
            })
        }
    } else {
        console.log('In isNan else loop.');
    }
}, {
    caseInsensitive: true,
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

// ========================== Slap Command ====================================================== //
bot.registerCommand('slap', (msg, args) => {
    if (args.length == 2 && !isNaN(parseInt(args[0]))) {
        reactions.pickSlapImage((img) => {
            let message = '';
            if (msg.mentions.length > 0) {
                message = "**" + msg.mentions[0].username + "**, you've been slapped by **" + msg.author.username + "**.";
            }

            bot.createMessage(msg.channel.id, message, {
                file: img,
                name: 'Slap.gif'
            });
        }, args[0]);
    } else if (msg.mentions.length > 0) {
        reactions.pickSlapImage((img) => {
            let message = '';
            if (msg.mentions.length > 0) {
                message = "**" + msg.mentions[0].username + "**, you've been slapped by **" + msg.author.username + "**.";
            }

            bot.createMessage(msg.channel.id, message, {
                file: img,
                name: 'Slap.gif'
            });
        });
    }
}, {
    aliases: ['slaps'],
    argsRequired: true,
    caseInsensitive: true,
    description: 'Displays a random slap gif.',
    fullDescription: 'Displays a random slap gif and the name of the user you mention.',
    guildOnly: true,
    usage: "@user e.g. `+slap @Alcha#2621`"
});

// ========================= Suggestion Command ================================================= //
bot.registerCommand('suggestion', (msg, args) => {
    let sqlQuery = "INSERT INTO SUGGESTIONS (AUTHOR_ID, AUTHOR_USERNAME, SUGGESTION_TEXT) VALUES " +
        "(\"" + msg.author.id + "\", \"" + msg.author.username + "\", \"" + args.join(' ') + "\");";

    ioTools.executeSql(sqlQuery);

    return "Thank you for your suggestion!";
}, {
    argsRequired: true,
    caseInsensitive: true,
    description: 'Provide a suggestion to the bot authors.',
    fullDescription: 'Provide a suggestion for a command or new feature you would like to see in Tron.',
    guildOnly: false,
    usage: "`+suggestion Give me all your money.`"
});

// ========================== Kiss Command ====================================================== //
bot.registerCommand('kiss', (msg, args) => {
    /**
     * First, we verify the args.length is equal to (==) 2, this means we've been given two
     * arguments. We make sure the first one is an actual number by using isNaN, which stands for
     * isNotANumber. To do this, we have to parse the number with parseInt. So what this does is
     * parse the value in args[0] (which should be a number), and then pass it to isNaN. If it
     * returns false, we know that it's a number. If it returns true, it's not a number, so just
     * return a random image, which is the else statement.
     */
    if (args.length == 2 && !isNaN(parseInt(args[0]))) {
        reactions.pickKissImage((img) => {
            let user = msg.mentions[0].username;
            let message = "**" + user + "**, you've been kissed by **" + msg.author.username + "**. :kiss:";

            bot.createMessage(msg.channel.id, message, {
                file: img,
                name: 'Kiss.gif'
            });
        }, args[0]);
    } else if (msg.mentions.length > 0) {
        reactions.pickKissImage((img) => {
            let user = msg.mentions[0].username;
            let message = "**" + user + "**, you've been kissed by **" + msg.author.username + "**. :kiss:";

            bot.createMessage(msg.channel.id, message, {
                file: img,
                name: 'Kiss.gif'
            });
        });
    } else {
        bot.createMessage(msg.channel.id, "Please make sure to mention one or more users in order to use this command.");
    }

    ioTools.incrementCommandUse('kiss');
}, {
    aliases: ['kisses'],
    caseInsensitive: true,
    description: 'Displays a random kiss gif.',
    fullDescription: 'Displays a random kissing reaction gif and the name of the individual mentioned.'
});

// ========================== Pat Command ======================================================= //
bot.registerCommand('pat', (msg, args) => {
    if (args.length == 2 && !isNaN(parseInt(args[0]))) {
        reactions.pickPatImage((img) => {
            let user = msg.mentions[0].username;
            let message = "**" + user + "**, you got a pat from **" + msg.author.username + "**.";

            bot.createMessage(msg.channel.id, message, {
                file: img,
                name: 'Pat.gif'
            });
        }, args[0]);
    } else {
        reactions.pickPatImage((img) => {
            let user = msg.mentions[0].username;
            let message = "**" + user + "**, you got a pat from **" + msg.author.username + "**.";

            bot.createMessage(msg.channel.id, message, {
                file: img,
                name: 'Pat.gif'
            });
        });
    }

    ioTools.incrementCommandUse('pat');
}, {
    aliases: ['pats', 'tap', 'taps'],
    caseInsensitive: true
});

// ========================== Marriage Commands (requested by Prim) ============================= //
let marry = bot.registerCommand('marry', (msg, args) => {
    // Verify at least one user was mentioned
    if (msg.mentions.length > 0) {
        // Verify the first mentioned user wasn't the author to avoid trying to marry just yourself
        if (msg.mentions[0].id == msg.author.id) {
            bot.createMessage(msg.channel.id, "You can't marry yourself! What kind of a backwards country you think this is?");
        } else {
            // Pass mentioned users to verifyProposal to determine if a proposal is valid
            marriage.verifyProposal(msg, (cleanUsers, allVerified) => {
                // Let the validated users know they've been proposed to
                marriage.alertUsersToProposals(msg.channel.id, cleanUsers, bot);

                // Add a proposal to the database for each validated user
                cleanUsers.forEach((mention, index, mentions) => {
                    marriage.addProposal({
                        id: msg.author.id,
                        username: msg.author.username
                    }, {
                        id: mention.id,
                        username: mention.username
                    }, (results) => {
                        if (results.message.length > 0) {
                            bot.createMessage(msg.channel.id, results.message + " - _If this was an error, please contact the developer._")
                        }
                    });
                });

                // If one of the users weren't verified for some reason, let the proposer know
                // TODO: Provide more information on which user wasn't verified and possibly why
                if (allVerified == false) {
                    bot.createMessage(msg.channel.id, "Unfortunately, one or more of the users you proposed to is already married to you or you have a pending proposal.");
                }
            });
        }
    } else {
        bot.createMessage(msg.channel.id, "Please make sure to mention one or more users in order to use this command.");
    }
}, {
    aliases: ['propose'],
    caseInsensitive: true,
    description: "Proposes to the given users.",
    fullDescription: "Proposes to all of the users that are mentioned so long as you don't already " +
        "have a pending proposal or exiting marriage to the user.",
    usage: "[@users] e.g. `+marry @Alcha#2621 @Bugs#2413`"
});

marry.registerSubcommand('list', (msg, args) => {
    if (msg.mentions.length == 0) {
        marriage.getMarriages(msg.author.id, (marriages) => {
            let message = "";
            if (marriages.length > 0) {
                message = "You are currently married to:\n\n";
                for (let x = 0; x < marriages.length; x++) {
                    if (marriages[x].SPOUSE_A_ID != msg.author.id) {
                        message += "- **" + marriages[x].SPOUSE_A_USERNAME + "** since " + marriages[x].MARRIAGE_DATE + "\n"
                    } else if (marriages[x].SPOUSE_B_ID != msg.author.id) {
                        message += "- **" + marriages[x].SPOUSE_B_USERNAME + "** since " + marriages[x].MARRIAGE_DATE + "\n"
                    }
                }
            } else {
                message = "Unfortunately, you're not currently married to anyone. :cry:"
            }

            bot.createMessage(msg.channel.id, message);
        });
    } else if (msg.mentions.length == 1) {
        let userId = msg.mentions[0].id;
        marriage.getMarriages(userId, (marriages) => {
            let message = "";
            if (marriages.length > 0) {
                message = msg.mentions[0].username + " is currently married to:\n\n";
                for (let x = 0; x < marriages.length; x++) {
                    if (marriages[x].SPOUSE_A_ID != userId) {
                        message += "- **" + marriages[x].SPOUSE_A_USERNAME + "** since " + marriages[x].MARRIAGE_DATE + "\n"
                    } else if (marriages[x].SPOUSE_B_ID != userId) {
                        message += "- **" + marriages[x].SPOUSE_B_USERNAME + "** since " + marriages[x].MARRIAGE_DATE + "\n"
                    }
                }
            } else {
                message = "Unfortunately, you're not currently married to anyone. :cry:"
            }

            bot.createMessage(msg.channel.id, message);
        });
    }
}, {
    aliases: ['lists', 'fuckbook', 'history'],
    caseInsensitive: true,
    description: 'List all current marriages.',
    fullDescription: 'Lists all current marriages of the author or mentioned user if one is given.',
    usage: "[@user] e.g. `+marry list @Alcha#2621`"
});

marry.registerSubcommand('accept', (msg, args) => {
    marriage.getProposals(msg.author.id, (results) => {
        if (results != null && results.length > 1) {
            if (args.length == 0) {
                marriage.formatProposals(results, (formattedMsg) => {
                    formattedMsg = "You currently have " + results.length + " proposals, please indicate which one you wish to accept (e.g. +marry accept 1):\n\n" + formattedMsg;

                    bot.createMessage(msg.channel.id, formattedMsg);
                });
            } else if (args.length == 1) {
                if (!isNaN(args[0])) {
                    marriage.acceptProposal({
                        id: results[args[0]].PROPOSER_ID,
                        username: results[args[0]].PROPOSER_USERNAME
                    }, {
                        id: msg.author.id,
                        username: msg.author.username
                    }, (success) => {
                        if (success) {
                            bot.createMessage(msg.channel.id, "Congratulations, you're now married to <@" + results[args[0]].PROPOSER_ID + ">");
                        }
                    });
                }
            }
        } else if (results.length == 1) {
            marriage.acceptProposal({
                id: results[0].PROPOSER_ID,
                username: results[0].PROPOSER_USERNAME
            }, {
                id: msg.author.id,
                username: msg.author.username
            }, (success) => {
                if (success) {
                    bot.createMessage(msg.channel.id, "Congratulations, you're now married to <@" + results[0].PROPOSER_ID + ">");
                }
            });
        } else {
            bot.createMessage(msg.channel.id, "Unfortunately, it appears you don't have any pending proposals. :slight_frown:");
        }
    });
}, {
    caseInsensitive: true
});

marry.registerSubcommand('deny', (msg, args) => {
    marriage.getProposals(msg.author.id, (results) => {
        if (results != null && results.length > 1) {
            if (args.length == 0) {
                marriage.formatProposals(results, (formattedMsg) => {
                    formattedMsg = "You currently have " + results.length + " proposals, please indicate which one you wish to deny (e.g. +marry deny 1):\n\n" + formattedMsg;
                    bot.createMessage(msg.channel.id, formattedMsg);
                });
            } else if (args.length == 1) {
                marriage.removeProposal(results[args[0]].PROPOSER_ID, msg.author.id, (results) => {
                    if (results.message.length == 0) {
                        bot.createMessage(msg.channel.id, "Aww, you've successfully denied the proposal.");
                    }
                });
            }
        } else if (results.length == 1) {
            marriage.removeProposal(results[0].PROPOSER_ID, msg.author.id, (results) => {
                if (results.message.length == 0) {
                    bot.createMessage(msg.channel.id, "Aww, you've successfully denied the proposal.");
                }
            });
        } else {
            bot.createMessage(msg.channel.id, "It appears you don't have any pending proposals, please try again later.");
        }
    });
}, {
    aliases: ['reject', 'rejected', 'refuse'],
    caseInsensitive: true
});

let divorce = bot.registerCommand('divorce', (msg, args) => {
    if (msg.mentions.length > 0) {
        let userId1 = msg.author.id;
        let userId2 = msg.mentions[0].id;

        marriage.verifyDivorce(userId1, userId2, (marriageIn) => {
            if (marriageIn != null) {
                marriage.addDivorceProposal({
                    id: userId1,
                    username: msg.author.username
                }, {
                    id: userId2,
                    username: msg.mentions[0].username
                }, (success) => {
                    if (success) {
                        bot.createMessage(msg.channel.id, "I'm sorry <@" + userId2 + ">, it appears " + msg.author.username + " wants a divorce. :slight_frown:\n\n" +
                            "Please use `+divorce accept` or `+divorce deny` to accept or deny the divorce request. Keep in mind, denying a divorce for too long without good reason _may_ have some side effects...");
                    }
                });
            } else {
                bot.createMessage(msg.channel.id, "Unfortunately, the divorce could not be verified. This could happen for a number of reasons:\n\n" +
                    "- You already have a pending divorce with this user.\n" +
                    "- You aren't actually married to this user.\n" +
                    "- The bot is down and nothing is really working, so you most likely won't see this... :sweat_smile:");
            }
        });
    }
}, {
    aliases: ['divorces', 'alienate', 'separate'],
    caseInsensitive: true
});

divorce.registerSubcommand('accept', (msg, args) => {
    marriage.getDivorceProposals(msg.author.id, (results) => {
        if (results != null && results.length > 1) {
            if (args.length == 0) {
                marriage.formatDivorceProposals(results, (formattedMsg) => {
                    formattedMsg = "You currently have " + results.length + " divorce proposals, please indicate which one you wish to accept (e.g. +divorce accept 1):\n\n" + formattedMsg;

                    bot.createMessage(msg.channel.id, formattedMsg);
                });
            } else if (args.length == 1) {
                if (!isNaN(args[0])) {
                    marriage.acceptDivorceProposal({
                        id: results[args[0]].DIVORCER_ID,
                        username: results[args[0]].DIVORCER_USERNAME
                    }, {
                        id: msg.author.id,
                        username: msg.author.username
                    }, (success) => {
                        if (success) {
                            bot.createMessage(msg.channel.id, "You've successfuly divorced <@" + results[args[0]].DIVORCER_ID + ">");
                        }
                    });
                }
            }
        } else if (results.length == 1) {
            marriage.acceptDivorceProposal({
                id: results[0].DIVORCER_ID,
                username: results[0].DIVORCER_USERNAME
            }, {
                id: msg.author.id,
                username: msg.author.username
            }, (success) => {
                if (success) {
                    bot.createMessage(msg.channel.id, "You've successfuly divorced <@" + results[0].DIVORCER_ID + ">");
                }
            });
        } else {
            bot.createMessage(msg.channel.id, "It appears as though you do not have any pending divorces! :tada:");
        }
    });
}, {
    caseInsensitive: true,
    argsRequired: false,
    description: 'Accepts a pending divorce proposal.',
    guildOnly: true
});

divorce.registerSubcommand('deny', (msg, args) => {
    marriage.getDivorceProposals(msg.author.id, (results) => {
        if (results != null && results.length > 1) {
            if (args.length == 0) {
                marriage.formatDivorceProposals(results, (formattedMsg) => {
                    formattedMsg = "You currently have " + results.length + " divorce proposals, please indicate which one you wish to deny (e.g. +divorce deny 1):\n\n" + formattedMsg;
                    bot.create(msg.channel.id, formattedMsg);
                });
            } else if (args.length == 1) {
                marriage.removeDivorceProposal(results[args[0]].id, msg.author.id, (results) => {
                    if (results.message.length == 0) {
                        bot.createMessage(msg.channel.id, "You've successfully denied the proposal.");
                    }
                });
            }
        } else if (results.length == 1) {
            marriage.removeDivorceProposal(results[0].DIVORCER_ID, msg.author.id, (results) => {
                if (results.message.length == 0) {
                    bot.createMessage(msg.channel.id, "You've successfully denied the proposal.");
                }
            });
        } else {
            bot.createMessage(msg.channel.id, "It appears you don't have any pending divorce proposals, please try again later.");
        }
    });
}, {
    aliases: ['reject', 'rejected'],
    caseInsensitive: true,
    description: 'Rejects a pending divorce proposal.',
    guildOnly: true
});

/**
 * mysql> SELECT * FROM DIVORCES WHERE (DIVORCER_ID = 219270060936527873 AND DIVORCEE_ID = 265102393308479488) OR (DIVORCER_ID = 265102393308479488 AND DIVORCEE_ID = 219270060936527873) UNION SELECT * FROM DIVORCE_PROPOSALS WHERE (DIVORCER_ID = 219270060936527873 AND DIVORCEE_ID = 265102393308479488) OR (DIVORCER_ID = 265102393308479488 AND DIVORCEE_ID = 219270060936527873);
 */

divorce.registerSubcommand('list', (msg, args) => {
    // List current divorces of author or provided mention
    marriage.getDivorces(msg.author.id, (divorces) => {
        if (divorces.length == 0) {
            bot.createMessage(msg.channel.id, "It appears as though you do not have any divorces! :tada:");
        } else {
            let message = 'Here is a list of your current divorces:\n\n';

            for (let x = 0; x < divorces.length; x++) {
                if (divorces[x].DIVORCER_ID != msg.author.id) {
                    message += "- **" + divorces[x].DIVORCER_USERNAME + "** since " + divorces[x].DIVORCE_DATE + "\n"
                } else if (divorces[x].DIVORCEE_ID != msg.author.id) {
                    message += "- **" + divorces[x].DIVORCEE_USERNAME + "** since " + divorces[x].DIVORCE_DATE + "\n"
                }
            }

            bot.createMessage(msg.channel.id, message);
        }
    })
}, {
    caseInsensitive: true
});

// ========================== Quote Command ===================================================== //
bot.registerCommand('quote', (msg, args) => {
    ioTools.readFile('Quotes.txt', (content) => {
        let temp = content.split('\n');
        let random = tools.getRandom(0, temp.length);

        bot.createMessage(msg.channel.id, temp[random]);
    });
}, {
    aliases: ['quotes'],
    caseInsensitive: true,
    description: 'Returns a random quote.'
});

// ========================== Kill Command ====================================================== //
bot.registerCommand('kill', (msg, args) => {
    if (args.length == 2 && !isNaN(parseInt(args[0]))) {
        reactions.pickKillImage((img) => {
            let message = '';
            if (msg.mentions.length > 0) {
                let user = msg.mentions[0].username;
                message = "**" + user + "**, you've been killed by **" + msg.author.username + "**. :knife:";
            }

            bot.createMessage(msg.channel.id, message, {
                file: img,
                name: 'Kill.gif'
            });
        }, args[0]);
    } else {
        reactions.pickKillImage((img) => {
            let message = '';
            if (msg.mentions.length > 0) {
                let user = msg.mentions[0].username;
                message = "**" + user + "**, you've been killed by **" + msg.author.username + "**. :knife:";
            }

            bot.createMessage(msg.channel.id, message, {
                file: img,
                name: 'Kill.gif'
            });
        });
    }

    ioTools.incrementCommandUse('kill');
}, {
    aliases: ['kills'],
    caseInsensitive: true,
    description: 'Displays a random killing gif.',
    fullDescription: 'Displays a random killing reaction gif and the name of the individual mentioned.'
});

// ========================== Punch Command ===================================================== //
bot.registerCommand('punch', (msg, args) => {
    if (args.length == 2 && !isNaN(parseInt(args[0]))) {
        reactions.pickPunchImage((img) => {
            let user = msg.mentions[0].username;
            let message = "**" + user + "**, you've been punched by **" + msg.author.username + "**. :punch:";

            bot.createMessage(msg.channel.id, message, {
                file: img,
                name: 'Punch.gif'
            });
        }, args[0]);
    } else {
        reactions.pickPunchImage((img) => {
            let user = msg.mentions[0].username;
            let message = "**" + user + "**, you've been punched by **" + msg.author.username + "**. :punch:"

            bot.createMessage(msg.channel.id, message, {
                file: img,
                name: 'Punch.gif'
            });
        });
    }

    ioTools.incrementCommandUse('punch');
}, {
    aliases: ['punches'],
    caseInsensitive: true,
    description: 'Displays a random punching gif.',
    fullDescription: 'Displays a random punching reaction gif and the name of the individual mentioned.'
});

// ========================== Confused Command ================================================== //
bot.registerCommand('confused', (msg, args) => {
    reactions.pickConfusedImage((img) => {
        bot.createMessage(msg.channel.id, '', {
            file: img,
            name: 'Confused.gif'
        });

        ioTools.incrementCommandUse('confused');
    });
}, {
    caseInsensitive: true
});

// ========================== Dance Command ===================================================== //
bot.registerCommand('dance', (msg, args) => {
    reactions.pickDanceImage((img) => {
        bot.createMessage(msg.channel.id, '', {
            file: img,
            name: 'Dance.gif'
        });

        ioTools.incrementCommandUse('dance');
    });
}, {
    caseInsensitive: true
});

// ========================== Pout Command ====================================================== //
bot.registerCommand('pout', (msg, args) => {
    if (args.length == 1 && !isNaN(parseInt(args[0]))) {
        reactions.pickPoutImage(args[0]).then((img) => {
            bot.createMessage(msg.channel.id, '', {
                file: img,
                name: 'Pout.gif'
            });
        });
    } else {
        reactions.pickPoutImage().then((img) => {
            bot.createMessage(msg.channel.id, '', {
                file: img,
                name: 'Pout.gif'
            });
        });
    }

    ioTools.incrementCommandUse('pout');
}, {
    aliases: ['pouts'],
    caseInsensitive: true
});

// ========================== Wave Command ====================================================== //
bot.registerCommand('wave', (msg, args) => {
    reactions.pickWaveImage((img) => {
        bot.createMessage(msg.channel.id, '', {
            file: img,
            name: 'Wave.gif'
        });

        ioTools.incrementCommandUse('wave');

    });
}, {
    aliases: ['waves'],
    caseInsensitive: true
});

// ========================== Spank Command ===================================================== //
bot.registerCommand('spank', (msg, args) => {
    reactions.pickSpankImage((img) => {
        let user = msg.mentions[0].username;
        let message = "**" + user + "**, you've been spanked by **" + msg.author.username + "**. :wave:";

        bot.createMessage(msg.channel.id, message, {
            file: img,
            name: 'Spank.gif'
        });

        ioTools.incrementCommandUse('spank');
    })
}, {
    aliases: ['spanks'],
    caseInsensitive: true
});

// ========================== Kill Me Command =================================================== //
bot.registerCommand('killme', (msg, args) => {
    reactions.pickKillMeImage((killMeImage) => {
        // Mika's requested killme command
        bot.createMessage(msg.channel.id, '', {
            file: killMeImage,
            name: 'KillMe.gif'
        });
    });

    ioTools.incrementCommandUse('killme');
}, {
    aliases: ['kms'],
    caseInsensitive: true
});

// ========================== Rate Waifu Command (Requested by Bella and Kayla) ================= //
bot.registerCommand('ratewaifu', (msg, args) => {
    if (msg.channel.guild != undefined && msg.mentions.length == 1) {
        ioTools.incrementCommandUse('rate');

        if (msg.mentions[0].id == 219270060936527873) {
            // Alcha
            return "**" + msg.mentions[0].username + "**-senpai, I'd rate you 11/10. \n\n_notice me_";
        } else if (msg.mentions[0].id == 142092834260910080) {
            // Snow/Daddy Yoana
            return "**" + msg.mentions[0].username + "**, I'd rate you -69/10 waifu."
        } else if (msg.mentions[0].id == 139474184089632769) {
            // Utah
            return "**" + msg.mentions[0].username + "**, I'd rate you -∞/10 waifu."
        } else {
            let random = tools.getRandom(0, 11);
            let message = "**" + msg.mentions[0].username + "**, I'd rate you " + random + "/10 waifu.";

            return message;
        }
    }
}, {
    aliases: ['rate'],
    caseInsensitive: true,
    description: 'Randomly rates a mentioned user 0 - 10.',
    fullDescription: 'Generates a random number to rate the mentioned user on a scale of 0 to 10.'
});

// ========================== Hugs Command ====================================================== //
bot.registerCommand('hugs', (msg, args) => {
    if (msg.mentions[0] != undefined) {
        reactions.pickHugImage((hugImage) => {
            let user = msg.mentions[0].username;
            let message = "**" + user + "**, has received hugs from **" + msg.author.username + "**. :hugging:";

            bot.createMessage(msg.channel.id, message, {
                file: hugImage,
                name: 'Hugs.gif'
            });

            ioTools.incrementCommandUse('hugs');
        });
    } else {
        return "Invalid input, please make sure to mention a user.";
    }
}, {
    aliases: ['hug'],
    caseInsensitive: true
});

// ========================== Stats Commands ==================================================== //
bot.registerCommand('stats', (msg, args) => {
    if (args.length == 0) {
        ioTools.getAllCommandUsage((results) => {
            let fields = [];

            for (let i = 0; i < results.length; i++) {
                fields[i] = {
                    name: results[i].COMMAND_NAME,
                    value: results[i].COMMAND_USE_COUNT,
                    inline: true
                }
            }

            bot.createMessage(msg.channel.id, {
                embed: {
                    title: "Command Stats", // Title of the embed
                    description: "Here's a list of the commands available and how many times they've been used.",
                    color: 0x008000, // Color, either in hex (show), or a base-10 integer
                    fields: fields
                }
            });
        });
    } else {
        ioTools.getCommandUsage(args[0], (results) => {
            if (results[0] != undefined) {
                bot.createMessage(msg.channel.id, {
                    embed: {
                        color: 0x008000,
                        fields: [{
                            name: results[0].COMMAND_NAME,
                            value: results[0].COMMAND_USE_COUNT
                        }]
                    }
                });
            } else {
                bot.createMessage(msg.channel.id, "Please use a valid command, this does not exist in the database.");
            }

        });
    }

    ioTools.incrementCommandUse('stats');
}, {
    aliases: ['stat'],
    caseInsensitive: true,
    description: 'Display commands and how much list of use count',
    fullDescription: "Displays a list of available commands and how many times they've been used."
});

// ========================== Poke Command ====================================================== //
bot.registerCommand('poke', (msg, args) => {
    if (msg.mentions.length == 1) {
        reactions.pickPokeImage((img) => {
            let message = "**" + msg.mentions[0].username + "**, you've been poked by **" + msg.author.username + "**.";

            bot.createMessage(msg.channel.id, message, {
                file: img,
                name: 'Poke.gif'
            });

            ioTools.incrementCommandUse('poke');
        });
    } else {
        return INVALID_INPUT;
    }
}, {
    aliases: ['pokes'],
    caseInsensitive: true,
    description: 'Poke a user.',
    fullDescription: 'Displays a random poke gif for the mentioned user.'
});

// ========================== Kick Command ====================================================== //
bot.registerCommand('kick', (msg, args) => {
    if (msg.author.id != config.mika && msg.mentions[0] != undefined) {
        reactions.pickKickImage((img) => {
            let user = msg.mentions[0].username;
            let message = "**" + user + "**, you've been kicked by **" + msg.author.username + "**.";

            bot.createMessage(msg.channel.id, message, {
                file: img,
                name: 'Kick.gif'
            });

            ioTools.incrementCommandUse('kick');
        });
    } else {
        return INVALID_INPUT;
    }
}, {
    aliases: ['kicks'],
    caseInsensitive: true,
    description: 'Displays random kick gif',
    fullDescription: 'Displays a random kick gif and the name of the person you mention.'
});

// ========================== Bite Command ====================================================== //
bot.registerCommand('bite', (msg, args) => {
    reactions.pickBiteImage((biteImage) => {
        var message = '';

        if (msg.mentions[0] != undefined) {
            var user = msg.mentions[0].username;
            message = "**" + user + "**, you've been bitten by **" + msg.author.username + "**.";
        }

        bot.createMessage(msg.channel.id, message, {
            file: biteImage,
            name: 'Bite.gif'
        });

        ioTools.incrementCommandUse('bite');
    });
}, {
    aliases: ['bites'],
    caseInsensitive: true,
    description: 'Displays a random bite gif.',
    fullDescription: 'Displays a random bite gif and the name of the user you mention.'
});

// ========================== Jova Command ====================================================== //
bot.registerCommand('jova', (msg, args) => {
    bot.createMessage(msg.channel.id, 'Who is <@78694002332803072>? Does <@78694002332803072> is gay?');

    ioTools.incrementCommandUse('jova');
});

// ========================== Boo Command ======================================================= //
bot.registerCommand('boo', (msg, args) => {
    bot.createMessage(msg.channel.id, '<@160372598734061568> is <@219270060936527873>\'s boo. :heart:');

    ioTools.incrementCommandUse('boo');
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
    });

    setupRssReaders();
});

// ========================== Git Command ======================================================= //
bot.registerCommand('git', (msg, args) => {
    bot.createMessage(msg.channel.id, 'You can find the git repo for Tron here: https://github.com/Alcha/Tron');

    ioTools.incrementCommandUse('git');
}, {
    aliases: ['repo', 'github', 'codebase'],
    caseInsensitive: true,
    description: 'Display link to online git repository.',
    fullDescription: 'Displays the link to the git repository on GitHub.'
});

// ========================== Blush Command ===================================================== //
bot.registerCommand('blush', (msg, args) => {
    reactions.pickBlushImage((blushImage) => {
        bot.createMessage(msg.channel.id, '', {
            file: blushImage,
            name: 'Blush.gif'
        });

        ioTools.incrementCommandUse('blush');
    });
}, {
    caseInsensitive: true,
    description: 'Displays a random blush gif.'
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

    ioTools.incrementCommandUse('rawr');
}, {
    caseInsensitive: true,
    description: 'Displays a random rawr gif.'
});

// ========================== Rekt Command ====================================================== //
bot.registerCommand('rekt', (msg, args) => {
    reactions.pickRektImage((rektImage) => {
        bot.createMessage(msg.channel.id, '', {
            file: rektImage,
            name: 'Rekt.gif'
        });
    });

    ioTools.incrementCommandUse('rekt');
}, {
    caseInsensitive: true,
    description: 'Displays a random rekt gif.'
});

// ========================== Trump Commands ==================================================== //
let trumpFake = null;
let trumpWrong = null;

let trumpCmd = bot.registerCommand('trump', (msg, args) => {
    if (args.length === 0) {
        return "Invalid input, arguments required. Try `+trump fake` or `+trump wrong`.";
    }
}, {
    caseInsensitive: true
});

trumpCmd.registerSubcommand('fake', (msg, args) => {
    if (trumpWrong == null) {
        ioTools.getImage('trump/fake.gif', (img) => {
            trumpFake = img;
            bot.createMessage(msg.channel.id, '', {
                file: img,
                name: 'Fake.gif'
            });
        });
    } else {
        bot.createMessage(msg.channel.id, '', {
            file: trumpFake,
            name: 'Fake.gif'
        });
    }

    ioTools.incrementCommandUse('trump-fake');
}, {
    aliases: ['cnn'],
    caseInsensitive: true
});

trumpCmd.registerSubcommand('wrong', (msg, args) => {
    if (trumpWrong == null) {
        ioTools.getImage('trump/wrong.gif', (img) => {
            trumpWrong = img;
            bot.createMessage(msg.channel.id, '', {
                file: img,
                name: 'Wrong.gif'
            });
        });
    } else {
        bot.createMessage(msg.channel.id, '', {
            file: trumpWrong,
            name: 'Wrong.gif'
        });
    }

    ioTools.incrementCommandUse('trump-wrong');
}, {
    caseInsensitive: true
});

// ========================== Add Role Command ================================================== //
bot.registerCommand('addr', (msg, args) => {
    if (msg.channel.guild != null) {
        if (tools.memberIsMod(msg)) {
            let comparison = tools.concatArgs(args);

            let roles = msg.channel.guild.roles;

            roles.forEach((value, key, mapObj) => {
                if (value.name != null) {
                    let name = value.name.toLowerCase();

                    if (name == comparison) {
                        roleNames.push(value.name);
                        bot.createMessage(msg.channel.id, "Added " + value.name + " to list of available roles.");
                    }
                }
            })
        }
    }
}, {
    aliases: ['addrole', 'plusrole'],
    caseInsensitive: true,
    description: 'Add a role for users to gain access to a role.'
});

// ========================== List Roles Command ================================================ //
bot.registerCommand('listr', (msg, args) => {
    let message = "List of currently available roles:\n";

    roleNames.forEach((curr, index, arr) => {
        message += "- **" + curr + "**\n";
    });

    bot.createMessage(msg.channel.id, message);
}, {
    caseInsensitive: true,
    description: 'List roles that are available to join.',
    fullDescription: 'Lists the roles that have been added by an administrator that are available.'
});

// ========================== Avatar Command (requested by Battsie) ============================= //
bot.registerCommand('Avatar', (msg, args) => {
    if (msg.mentions.length == 1) {
        let url = msg.mentions[0].dynamicAvatarURL(null, 1024);
        let origFilename = url.substring(url.lastIndexOf("/") + 1, url.lastIndexOf("?"));

        ioTools.downloadFiles([{
            url: url,
            dest: "/root/tron/images/avatar/" + origFilename
        }], (filenames) => {
            filenames.forEach((filename, key, array) => {
                ioTools.getImage(filename, (image) => {
                    bot.createMessage(msg.channel.id, "", {
                        file: image,
                        name: origFilename
                    });
                });
            });
        });
    } else {
        return "Please only mention one user at a time.";
    }
}, {
    aliases: ['profile'],
    caseInsensitive: true
});

// ========================== Ship Command ====================================================== //
bot.registerCommand('Ship', (msg, args) => {
    if (msg.channel.guild != undefined && msg.mentions.length == 2) {
        const urls = [msg.mentions[0].avatarURL, msg.mentions[1].avatarURL];

        ship.getShipImages(urls, (images) => {
            let avatarCanvas = new Canvas(384, 128);
            let ctx = avatarCanvas.getContext('2d');

            for (let i = 0; i < 3; i++) {
                ctx.drawImage(images[i], (i * 128), 0, 128, 128);

                if (i == 2) {
                    ship.getShipName(msg, (shipName) => {
                        let shipMsg = 'Lovely shipping!\n' +
                            'Ship name: **' + shipName + '**';

                        bot.createMessage(msg.channel.id, shipMsg, {
                            file: avatarCanvas.toBuffer(),
                            name: shipName + '.png'
                        });
                    });
                }
            }
        });

        ioTools.incrementCommandUse('ship');
    }
}, {
    caseInsensitive: true,
    description: 'Ship two users.',
    fullDescription: 'Takes the two mentioned users and mashes their names into a lovely mess.'
});

// ========================== Leave Role Command ================================================ //
bot.registerCommand('leaver', (msg, args) => {
    let comparison = tools.concatArgs(args);

    if (msg.channel.guild != null) {
        let userId = msg.author.id;

        if (comparison == "all") {
            tools.removeAllRoles(userId, msg, bot);
        } else {
            let roleId = tools.getRoleId(msg, comparison);

            if (roleId.length > 1) {
                if (tools.allowedRole(comparison)) {
                    msg.channel.guild.removeMemberRole(userId, roleId);
                    bot.createMessage(msg.channel.id, ":outbox_tray: You've successfully been removed from your requested group.");
                    msg.delete();
                    ioTools.incrementCommandUse('leaver');
                }
            }
        }
    }
}, {
    caseInsensitive: true,
    description: 'Leave a role.',
    fullDescription: 'Used to leave a specific role, usually to also leave an associated channel.'
});

// ========================== Join Role Command ================================================= //
bot.registerCommand('joinr', (msg, args) => {
    let comparison = tools.concatArgs(args);

    if (msg.channel.guild != undefined) {
        let userId = msg.author.id;

        if (comparison == "all") {
            tools.addAllRoles(userId, msg, bot);
        } else {
            let roleId = tools.getRoleId(msg, comparison);

            if (roleId.length > 1) {
                if (tools.allowedRole(comparison)) {
                    msg.channel.guild.addMemberRole(userId, roleId);
                    bot.createMessage(msg.channel.id, ":inbox_tray: You've successfully been added to your requested group.");
                    msg.delete();
                    ioTools.incrementCommandUse('joinr');
                }
            }
        }
    }
}, {
    caseInsensitive: true,
    description: 'Places you into the requested server role.',
    fullDescription: 'Server admins are able to add select roles to the bot so that anyone can join the role with this command.'
});

// ========================== List Peeps (Not for public) ======================================= //
bot.registerCommand('listPeeps', (msg, args) => {
    if (msg.author.id == config.owner) {
        if (args[0] != null) {}
    }
});

// ========================== Exhentai Command ====================================================== //
bot.registerCommand('exhentai', (msg, args) => {
    if (msg.channel.id != undefined) {
        bot.createMessage(msg.channel.id, tools.getExhentaiCookies().toString());
    }
});

// ========================== Utah Command ====================================================== //
bot.registerCommand('utah', (msg, args) => {
    if (msg.channel.guild != undefined) {
        if (msg.channel.guild.id == 254496813552238594) {
            bot.createMessage(msg.channel.id, "<@139474184089632769> <:Tiggered:256668458480041985>");
            ioTools.incrementCommandUse('utah');
        } else if (msg.channel.guild.id == 197846974408556544) {
            bot.createMessage(msg.channel.id, "<@139474184089632769> <:Tiggered:298313391444066305>");
            ioTools.incrementCommandUse('utah');
        } else {
            console.log("Guild = " + msg.channel.guild.name);
            console.log("id = " + msg.channel.guild.id);
        }
    }
}, {
    caseInsensitive: true,
    description: 'A command to poke fun at a good friend.',
    fullDescription: 'A command used to poke fun at a good friend. -Alcha'
});

// ========================== Alex Command ====================================================== //
bot.registerCommand('alex', (msg, args) => {
    if (msg.channel.guild != undefined) {
        if (msg.channel.guild.id == 254496813552238594) {
            bot.createMessage(msg.channel.id, "<@!191316261299290112> 🖕")
            ioTools.incrementCommandUse('alex');
        }
    }
}, {
    caseInsensitive: true,
    description: 'A command to show my love for a good friend.',
    fullDescription: 'A command used to show my love for a good friend. -Alcha'
});

// ========================== onMessageCreate Event Handler ===================================== //
bot.on("messageCreate", (msg) => {
    if (!isNaN(msg.author.id) && msg.channel.guild != undefined && msg.channel.guild.id == config.ownerServer) {
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
            ioTools.getImage('bye.png', (img) => {
                bot.createMessage(msg.channel.id, '', {
                    file: img,
                    name: 'Bye.png'
                });
            });
        } else if (tools.messageIs(msg, 'god damn')) {
            bot.createMessage(msg.channel.id, "https://i.imgur.com/ULUZMtV.gifv")
        }
    }
});

// ========================== Help Commands ===================================================== //
let helpText = require('./util/HelpText.json');

bot.unregisterCommand('help');

let helpCmd = bot.registerCommand('help', (msg, args) => {
    return helpText.base.join('');
}, {
    aliases: ['halp', 'helps', 'halps'],
    argsRequired: false,
    caseInsensitive: true,
    guildOnly: false
});

// ========================== Features Help Commands ============================================ //
helpCmd.registerSubcommand('change', (msg, args) => {
    return helpText.features.change.base.join('');
}, {
    argsRequired: false,
    caseInsensitive: true,
    guildOnly: false
});

helpCmd.registerSubcommand('features', (msg, args) => {
    return helpText.features.base.join('');
}, {
    argsRequired: false,
    caseInsensitive: true,
    guildOnly: false
});

helpCmd.registerSubcommand('quote', (msg, args) => {
    return helpText.features.quote.join('');
}, {
    argsRequired: false,
    caseInsensitive: true,
    guildOnly: false
});

helpCmd.registerSubcommand('ping', (msg, args) => {
    return helpText.features.ping.join('');
}, {
    argsRequired: false,
    caseInsensitive: true,
    guildOnly: false
});

helpCmd.registerSubcommand('invite', (msg, args) => {
    return helpText.features.invite.join('');
}, {
    argsRequired: false,
    caseInsensitive: true,
    guildOnly: false
});

helpCmd.registerSubcommand('stats', (msg, args) => {
    return helpText.features.stats.join('');
}, {
    argsRequired: false,
    caseInsensitive: true,
    guildOnly: false
});

helpCmd.registerSubcommand('ratewaifu', (msg, args) => {
    return helpText.features.ratewaifu.join('');
}, {
    aliases: ['rate'],
    argsRequired: false,
    caseInsensitive: true,
    guildOnly: false
});

helpCmd.registerSubcommand('git', (msg, args) => {
    return helpText.features.git.join('');
}, {
    argsRequired: false,
    caseInsensitive: true,
    guildOnly: false
});

helpCmd.registerSubcommand('addr', (msg, args) => {
    return helpText.features.addr.join('');
}, {
    argsRequired: false,
    caseInsensitive: true,
    guildOnly: false
});

helpCmd.registerSubcommand('listr', (msg, args) => {
    return helpText.features.listr.join('');
}, {
    argsRequired: false,
    caseInsensitive: true,
    guildOnly: false
});

helpCmd.registerSubcommand('leaver', (msg, args) => {
    return helpText.features.leaver.join('');
}, {
    argsRequired: false,
    caseInsensitive: true,
    guildOnly: false
});

helpCmd.registerSubcommand('joinr', (msg, args) => {
    return helpText.features.joinr.join('');
}, {
    argsRequired: false,
    caseInsensitive: true,
    guildOnly: false
});

helpCmd.registerSubcommand('avatar', (msg, args) => {
    return helpText.features.avatar.join('');
}, {
    argsRequired: false,
    caseInsensitive: true,
    guildOnly: false
});

helpCmd.registerSubcommand('ship', (msg, args) => {
    return helpText.features.ship.join('');
}, {
    argsRequired: false,
    caseInsensitive: true,
    guildOnly: false
});

helpCmd.registerSubcommand('exhentai', (msg, args) => {
    return helpText.features.exhentai.join('');
}, {
    argsRequired: false,
    caseInsensitive: true,
    guildOnly: false
});

helpCmd.registerSubcommand('actions', (msg, args) => {
    return helpText.actions.base.join('');
}, {
    argsRequired: false,
    caseInsensitive: true,
    guildOnly: false
});

helpCmd.registerSubcommand('users', (msg, args) => {
    return helpText.users.base.join('');
}, {
    argsRequired: false,
    caseInsensitive: true,
    guildOnly: false
});

helpCmd.registerSubcommand('reactions', (msg, args) => {
    return helpText.reactions.base.join('');
}, {
    argsRequired: false,
    caseInsensitive: true,
    guildOnly: false
});

helpCmd.registerSubcommand('love', (msg, args) => {
    return helpText.actions.love.join('');
}, {
    argsRequired: false,
    caseInsensitive: true,
    guildOnly: false
});

helpCmd.registerSubcommand('newd', (msg, args) => {
    return helpText.actions.newd.join('');
}, {
    argsRequired: false,
    caseInsensitive: true,
    guildOnly: false
});

helpCmd.registerSubcommand('poke', (msg, args) => {
    return helpText.actions.poke.join('');
}, {
    argsRequired: false,
    caseInsensitive: true,
    guildOnly: false
});

helpCmd.registerSubcommand('slap', (msg, args) => {
    return helpText.actions.slap.join('');
}, {
    argsRequired: false,
    caseInsensitive: true,
    guildOnly: false
});

helpCmd.registerSubcommand('kiss', (msg, args) => {
    return helpText.actions.kiss.join('');
}, {
    argsRequired: false,
    caseInsensitive: true,
    guildOnly: false
});

helpCmd.registerSubcommand('pat', (msg, args) => {
    return helpText.actions.pat.join('');
}, {
    argsRequired: false,
    caseInsensitive: true,
    guildOnly: false
});

helpCmd.registerSubcommand('kill', (msg, args) => {
    return helpText.actions.kill.join('');
}, {
    argsRequired: false,
    caseInsensitive: true,
    guildOnly: false
});

helpCmd.registerSubcommand('hugs', (msg, args) => {
    return helpText.actions.hugs.join('');
}, {
    argsRequired: false,
    caseInsensitive: true,
    guildOnly: false
});

helpCmd.registerSubcommand('punch', (msg, args) => {
    return helpText.actions.punch.join('');
}, {
    argsRequired: false,
    caseInsensitive: true,
    guildOnly: false
});

helpCmd.registerSubcommand('wave', (msg, args) => {
    return helpText.actions.wave.join('');
}, {
    argsRequired: false,
    caseInsensitive: true,
    guildOnly: false
});

helpCmd.registerSubcommand('spank', (msg, args) => {
    return helpText.actions.spank.join('');
}, {
    argsRequired: false,
    caseInsensitive: true,
    guildOnly: false
});

helpCmd.registerSubcommand('hug', (msg, args) => {
    return helpText.actions.hug.join('');
}, {
    argsRequired: false,
    caseInsensitive: true,
    guildOnly: false
});

helpCmd.registerSubcommand('kick', (msg, args) => {
    return helpText.actions.kick.join('');
}, {
    argsRequired: false,
    caseInsensitive: true,
    guildOnly: false
});

helpCmd.registerSubcommand('bite', (msg, args) => {
    return helpText.actions.bite.join('');
}, {
    argsRequired: false,
    caseInsensitive: true,
    guildOnly: false
});

helpCmd.registerSubcommand('dreamy', (msg, args) => {
    return helpText.users.dreamy.join('');
}, {
    argsRequired: false,
    caseInsensitive: true,
    guildOnly: false
});

helpCmd.registerSubcommand('alex', (msg, args) => {
    return helpText.users.alex.join('');
}, {
    argsRequired: false,
    caseInsensitive: true,
    guildOnly: false
});

helpCmd.registerSubcommand('utah', (msg, args) => {
    return helpText.users.utah.join('');
}, {
    argsRequired: false,
    caseInsensitive: true,
    guildOnly: false
});

helpCmd.registerSubcommand('jova', (msg, args) => {
    return helpText.users.jova.join('');
}, {
    argsRequired: false,
    caseInsensitive: true,
    guildOnly: false
});

// ========================== Reactions Help Command ============================================ //
helpCmd.registerSubcommand('cry', (msg, args) => {
    return helpText.reactions.cry.join('');
}, {
    argsRequired: false,
    caseInsensitive: true,
    guildOnly: false
});

helpCmd.registerSubcommand('confused', (msg, args) => {
    return helpText.reactions.confused.join('');
}, {
    argsRequired: false,
    caseInsensitive: true,
    guildOnly: false
});

helpCmd.registerSubcommand('killme', (msg, args) => {
    return helpText.reactions.killme.join('');
}, {
    argsRequired: false,
    caseInsensitive: true,
    guildOnly: false
});

helpCmd.registerSubcommand('pout', (msg, args) => {
    return helpText.reactions.pout.join('');
}, {
    argsRequired: false,
    caseInsensitive: true,
    guildOnly: false
});

helpCmd.registerSubcommand('dance', (msg, args) => {
    return helpText.reactions.dance.join('');
}, {
    argsRequired: false,
    caseInsensitive: true,
    guildOnly: false
});

helpCmd.registerSubcommand('blush', (msg, args) => {
    return helpText.reactions.blush.join('');
}, {
    argsRequired: false,
    caseInsensitive: true,
    guildOnly: false
});

helpCmd.registerSubcommand('rawr', (msg, args) => {
    return helpText.reactions.rawr.join('');
}, {
    argsRequired: false,
    caseInsensitive: true,
    guildOnly: false
});

helpCmd.registerSubcommand('rekt', (msg, args) => {
    return helpText.reactions.rekt.join('');
}, {
    argsRequired: false,
    caseInsensitive: true,
    guildOnly: false
});

// ========================== Marriage Help ===================================================== //
let marryHelpCmd = helpCmd.registerSubcommand('marry', (msg, args) => {
    return helpText.actions.marry.base.join('');
}, {
    argsRequired: false,
    caseInsensitive: true,
    guildOnly: false
});

marryHelpCmd.registerSubcommand('list', (msg, args) => {
    return helpText.actions.marry.list.join('');
}, {
    argsRequired: false,
    caseInsensitive: true,
    guildOnly: false
});

marryHelpCmd.registerSubcommand('accept', (msg, args) => {
    return helpText.actions.marry.accept.join('');
}, {
    argsRequired: false,
    caseInsensitive: true,
    guildOnly: false
});

marryHelpCmd.registerSubcommand('deny', (msg, args) => {
    return helpText.actions.marry.deny.join('');
}, {
    argsRequired: false,
    caseInsensitive: true,
    guildOnly: false
});

let divorceHelpCmd = helpCmd.registerSubcommand('divorce', (msg, args) => {
    return helpText.actions.divorce.base.join('');
}, {
    argsRequired: false,
    caseInsensitive: true,
    guildOnly: false
});

divorceHelpCmd.registerSubcommand('list', (msg, args) => {
    return helpText.actions.divorce.list.join('');
}, {
    argsRequired: false,
    caseInsensitive: true,
    guildOnly: false
});

divorceHelpCmd.registerSubcommand('accept', (msg, args) => {
    return helpText.actions.divorce.accept.join('');
}, {
    argsRequired: false,
    caseInsensitive: true,
    guildOnly: false
});

divorceHelpCmd.registerSubcommand('deny', (msg, args) => {
    return helpText.actions.divorce.deny.join('');
}, {
    argsRequired: false,
    caseInsensitive: true,
    guildOnly: false
});

let trumpHelp = helpCmd.registerSubcommand('trump', (msg, args) => {
    return helpText.reactions.trump.base.join('');
}, {
    argsRequired: false,
    caseInsensitive: true,
    guildOnly: false
});

trumpHelp.registerSubcommand('wrong', (msg, args) => {
    return helpText.reactions.trump.wrong.join('');
}, {
    argsRequired: false,
    caseInsensitive: true,
    guildOnly: false
});

trumpHelp.registerSubcommand('fake', (msg, args) => {
    return helpText.reactions.trump.fake.join('');
}, {
    argsRequired: false,
    caseInsensitive: true,
    guildOnly: false
});

// ========================== Connect Bot ======================================================= //
bot.connect();