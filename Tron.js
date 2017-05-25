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

// ========================== Bot Declaration =================================================== //
const bot = new Eris.CommandClient(config.token, {}, {
    description: info.description,
    owner: info.author,
    prefix: config.prefix
});

// ========================== External Cmd Files ================================================ //
const Ship = require('./cmds/Ship.js');
const ship = new Ship();

const Reactions = require('./cmds/Reactions.js');
const reactions = new Reactions();

const Marriage = require('./cmds/Marriage.js');
const marriage = new Marriage();

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
    aliases: ['VN', 'Vn', 'VapeNash', 'VapeNation', 'vape', 'VAPE', 'Vape', 'vapenash', 'vapenation'],
    description: "Vape nation, y'all.",
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
    aliases: ['Cry', 'CRY'],
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
    aliases: ['Love', 'LOVE'],
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
    } else {
        reactions.pickKissImage((img) => {
            let user = msg.mentions[0].username;
            let message = "**" + user + "**, you've been kissed by **" + msg.author.username + "**. :kiss:";

            bot.createMessage(msg.channel.id, message, {
                file: img,
                name: 'Kiss.gif'
            });
        });
    }

    ioTools.incrementCommandUse('kiss');
}, {
    aliases: ['Kiss', 'KISS'],
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
    aliases: [
        'pats', 'Pats', 'PATS',
        'tap', 'Tap', 'TAP',
        'taps', 'Taps', 'TAPS',
        'Pat', 'PAT'
    ]
});

// ========================== Marry Command (requested by Prim) ================================= //
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
                marriage.alertUsers(msg.channel.id, cleanUsers, bot);

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
    aliases: ['Marry', 'MARRY', 'Propose', 'propose', 'PROPOSE']
});

marry.registerSubcommand('list', (msg, args) => {
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
    })
});

function formatProposals(proposals, callback) {
    let processed = 0;
    let message = "```";

    proposals.forEach((proposal, index, array) => {
        message += "(" + processed + ") " + proposal.PROPOSER_USERNAME + "\n";

        processed++;

        if (processed == proposals.length) {
            message += "```";
            callback(message);
        }
    });

}

marry.registerSubcommand('accept', (msg, args) => {
    marriage.getProposals(msg.author.id, (results) => {
        if (results != null && results.length > 1) {
            if (args.length == 0) {
                formatProposals(results, (formattedMsg) => {
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
    aliases: ['Accept', 'ACCEPT']
});

marry.registerSubcommand('deny', (msg, args) => {
    marriage.getProposals(msg.author.id, (results) => {
        if (results != null && results.length > 1) {
            if (args.length == 0) {
                formatProposals(results, (formattedMsg) => {
                    formattedMsg = "You currently have " + results.length + " proposals, please indicate which one you wish to deny (e.g. +marry deny 1):\n\n" + formattedMsg;
                    bot.create(msg.channel.id, formattedMsg);
                });
            } else if (args.length == 1) {
                marriage.removeProposal(results[args[0]].id, msg.author.id, (results) => {
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
    aliases: ['Deny', 'DENY', 'reject', 'Reject', 'REJECT']
});

// ========================== Quote Command ===================================================== //
bot.registerCommand('quote', (msg, args) => {
    ioTools.readFile('Quotes.txt', (content) => {
        let temp = content.split('\n');
        let random = tools.getRandom(0, temp.length);

        bot.createMessage(msg.channel.id, temp[random]);
    });
}, {
    aliases: ['Quote', 'quotes', 'Quotes'],
    description: 'Returns a random quote.'
});

// ========================== Kill Command ====================================================== //
bot.registerCommand('kill', (msg, args) => {
    if (args.length == 2 && !isNaN(parseInt(args[0]))) {
        reactions.pickKillImage((img) => {
            let user = msg.mentions[0].username;
            let message = "**" + user + "**, you've been killed by **" + msg.author.username + "**. :knife:";

            bot.createMessage(msg.channel.id, message, {
                file: img,
                name: 'Kill.gif'
            });
        }, args[0]);
    } else {
        reactions.pickKillImage((img) => {
            let user = msg.mentions[0].username;
            let message = "**" + user + "**, you've been killed by **" + msg.author.username + "**. :knife:";

            bot.createMessage(msg.channel.id, message, {
                file: img,
                name: 'Kill.gif'
            });
        });
    }

    ioTools.incrementCommandUse('kill');
}, {
    aliases: ['Kill', 'KILL'],
    description: 'Displays a random killing gif.',
    fullDescription: 'Displays a random killing reaction gif and the name of the individual mentioned.'
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
    aliases: ['Confused', 'confused', 'CONFUSED']
});

// ========================== Pout Command ====================================================== //
bot.registerCommand('pout', (msg, args) => {
    if (args.length == 1 && !isNaN(parseInt(args[0]))) {
        reactions.pickPoutImage((img) => {
                bot.createMessage(msg.channel.id, '', {
                    file: img,
                    name: 'Pout.gif'
                });
            },
            args[0])
    } else {
        reactions.pickPoutImage((img) => {

            bot.createMessage(msg.channel.id, '', {
                file: img,
                name: 'Pout.gif'
            });

            ioTools.incrementCommandUse('pout');

        });
    };
}, {
    aliases: ['Pout', 'pout', 'POUT']
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
    aliases: ['Wave', 'WAVE']
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
    aliases: ['Spank', 'SPANK']
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
    aliases: ['Killme', 'KILLME', 'KillMe', 'kms']
});

// ========================== Rate Waifu Command (Requested by Bella and Kayla) ================= //
bot.registerCommand('ratewaifu', (msg, args) => {
    if (msg.channel.guild != undefined && msg.mentions.length == 1) {
        if (msg.mentions[0].id == 219270060936527873) {
            // Alcha
            return "**" + msg.mentions[0].username + "**-senpai, I'd rate you 11/10. \n\n_notice me_";
        } else if (msg.mentions[0].id == 142092834260910080) {
            return "**" + msg.mentions[0].username + "**, I'd rate you -69/10 waifu."
        } else if (msg.mentions[0].id == 139474184089632769) {
            return "**" + msg.mentions[0].username + "**, I'd rate you -∞/10 waifu."
        } else {
            let random = tools.getRandom(0, 11);
            let message = "**" + msg.mentions[0].username + "**, I'd rate you " + random + "/10 waifu.";

            return message;
        }
    }
}, {
    aliases: ['rate', 'Rate', 'Ratewaifu', 'ratewaifu'],
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
    aliases: ['hug', 'Hug', 'HUG', 'HUGS', 'Hugs']
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
}, {
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
    aliases: ['POKE', 'Poke', 'Pokes', 'POKES'],
    description: '',
    fullDescription: ''
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
    aliases: ['Kick', 'KICK'],
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
    aliases: ['Bite', 'BITE', 'bites', 'Bites', 'BITES'],
    description: '',
    fullDescription: ''
});

// ========================== Jova Command ====================================================== //
bot.registerCommand('jova', (msg, args) => {
    bot.createMessage(msg.channel.id, 'Who is <@78694002332803072>? Does <@78694002332803072> is gay?');

    ioTools.incrementCommandUse('jova');
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
    aliases: ['Git', 'GIT'],
    description: 'Display link to git repository.',
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
    aliases: ['Blush', 'BLUSH'],
    description: '',
    fullDescription: ''
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
    aliases: ['Rawr', 'RAWR'],
    description: '',
    fullDescription: ''
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
    aliases: ['Rekt', 'REKT'],
    description: '',
    fullDescription: ''
});

// ========================== Trump Commands ==================================================== //
let trumpCmd = bot.registerCommand('trump', (msg, args) => {
    if (args.length === 0) {
        return "Invalid input, arguments required. Try `+trump fake` or `+trump wrong`.";
    }
}, {
    aliases: ['Trump', 'TRUMP']
});

trumpCmd.registerSubcommand('fake', (msg, args) => {
    ioTools.getImage('/trump/fake.gif', (img) => {
        bot.createMessage(msg.channel.id, '', {
            file: img,
            name: 'Fake.gif'
        });
    });

    ioTools.incrementCommandUse('trump-fake');
}, {
    aliases: ['Fake', 'FAKE'],
    description: '',
    fullDescription: ''
});

trumpCmd.registerSubcommand('wrong', (msg, args) => {
    ioTools.getImage('/trump/wrong.gif', (img) => {
        bot.createMessage(msg.channel.id, '', {
            file: img,
            name: 'Wrong.gif'
        });
    });

    ioTools.incrementCommandUse('trump-wrong');
}, {
    aliases: ['Wrong', 'WRONG'],
    description: '',
    fullDescription: ''
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
    let message = "List of currently available roles:\n";

    roleNames.forEach((curr, index, arr) => {
        message += "- **" + curr + "**\n";
    });

    bot.createMessage(msg.channel.id, message);
}, {
    description: 'List roles that are available to join.',
    fullDescription: 'Lists the roles that have been added by an administrator that are available.'
});

// ========================== Avatar Command (requested by Battsie) ============================= //
bot.registerCommand('avatar', (msg, args) => {
    if (msg.mentions.length == 1) {
        let url = msg.mentions[0].dynamicAvatarURL(null, 1024);
        let origFilename = url.substring(url.lastIndexOf("/") + 1, url.lastIndexOf("?"));

        ioTools.downloadFiles([{
            url: url,
            dest: "/root/tron/images/avatar/" + origFilename
        }], (filenames) => {
            filenames.forEach((filename, key, array) => {
                console.log(filename);
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
    aliases: ['Avatar', 'AVATAR', 'Profile', 'profile', 'PROFILE']
});

// ========================== Ship Command ====================================================== //
bot.registerCommand('ship', (msg, args) => {
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
    aliases: ['Ship', 'SHIP'],
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
    aliases: ['Utah', 'UTAH'],
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
    aliases: ['Alex', 'ALEX'],
    description: 'A command to show my love for a good friend.',
    fullDescription: 'A command used to show my love for a good friend. -Alcha'
});

// ========================== onMessageCreate Event Handler ===================================== //
bot.on("messageCreate", (msg) => {
    if (!isNaN(msg.author.id) && msg.channel.guild.id == config.ownerServer) {
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

// ========================== Connect Bot ======================================================= //
bot.connect();