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

const reddit = require('redwrap');

const roleNames = config.roleNames;
const Eris = require("eris");

// For crash logging
const Raven = require('raven');
Raven.config('https://48c87e30f01f45a7a112e0b033715f3d:d9b9df5b82914180b48856a41140df34@sentry.io/181885').install();

const CleverbotClient = require('node-rest-client').Client;
const Cleverbot = new CleverbotClient();

const urlencode = require('urlencode');

let PowerWashingLinks = [];

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

const Mute = require('./cmds/Mute');
const muteCmd = new Mute();

const Yaoi = require('./cmds/Yaoi');
const yaoiCmd = new Yaoi();

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

adminCmd.registerSubcommand('ban', (msg, args) => {
  if (args.length > 1 && msg.mentions.length > 0) {
    let reason = args.slice(msg.mentions.length).join(' ');

    if (reason.length > 0) {
      msg.mentions.forEach((mention, index, mapObj) => {
        tools.getMember(msg, mention).then((member) => {
          msg.channel.guild.banMember(member.id, 0, reason);

          bot.createMessage(msg.channel.id, member.username + " has been banned from the server.");
        });
      });
    } else {
      msg.mentions.forEach((mention, index, mapObj) => {
        tools.getMember(msg, mention).then((member) => {
          msg.channel.guild.banMember(member.id);

          bot.createMessage(msg.channel.id, member.username + " has been banned from the server.");
        });
      });
    }
  } else if (msg.mentions.length > 0) {
    msg.mentions.forEach((mention, index, mapObj) => {
      tools.getMember(msg, mention).then((member) => {
        msg.channel.guild.banMember(member.id);

        bot.createMessage(msg.channel.id, member.username + " has been banned from the server.");
      });
    });
  } else {
    return "Please mention at least one user to ban and an optional reason after the mentioned user(s).";
  }
}, {
  requirements: {
    roleNames: ['tron-mod']
  }
});

adminCmd.registerSubcommand('kick', (msg, args) => {
  if (args.length > 1 && msg.mentions.length > 0) {
    let reason = args.slice(msg.mentions.length).join(' ');

    if (reason.length > 0) {
      msg.mentions.forEach((mention, index, mapObj) => {
        tools.getMember(msg, mention).then((member) => {
          msg.channel.guild.kickMember(member.id, reason);

          bot.createMessage(msg.channel.id, member.username + " has been kicked from the server.");
        });
      });
    } else {
      msg.mentions.forEach((mention, index, mapObj) => {
        tools.getMember(msg, mention).then((member) => {
          msg.channel.guild.kickMember(member.id);

          bot.createMessage(msg.channel.id, member.username + " has been kicked from the server.");
        });
      });
    }
  } else if (msg.mentions.length > 0) {
    msg.mentions.forEach((mention, index, mapObj) => {
      tools.getMember(msg, mention).then((member) => {
        msg.channel.guild.kickMember(member.id);

        bot.createMessage(msg.channel.id, member.username + " has been kicked from the server.");
      });
    });
  } else {
    return "Please mention at least one user to kick and an optional reason after the mentioned user(s).";
  }
}, {
  requirements: {
    roleNames: ['tron-mod']
  }
});

bot.registerCommand('initialize', (msg, args) => {
  msg.channel.guild.createRole({
    name: "tron-mod"
  });
  msg.channel.guild.createRole({
    name: "tron-mute"
  }).then((role) => {
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

// ========================== Mute Command ====================================================== //
bot.registerCommand('mute', (msg, args) => {
  if (msg.mentions[0] != undefined && msg.channel.guild != undefined) {
    msg.mentions.forEach((user, index, array) => {
      muteCmd.muteUser(msg, user).then((muted) => {
        if (muted) {
          bot.createMessage(msg.channel.id, {
            embed: {
              description: "**" + user.username + "** has been muted from text and voice by **" + msg.author.username + "**.",
              color: 0x008000
            }
          });
        }
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

bot.registerCommand('jay', (msg, args) => {
  ioTools.getImage('/root/tron/images/Jay.png', (img) => {
    bot.createMessage(msg.channel.id, '', {
      file: img,
      name: 'Jay.png'
    });
  });
}, {
  caseInsensitive: true
});

bot.registerCommand('key', (msg, args) => {
  ioTools.getImage('/root/tron/images/Key.jpg', (img) => {
    bot.createMessage(msg.channel.id, '<@140183864076140544>', {
      file: img,
      name: 'Key.jpg'
    });
  });
}, {
  caseInsensitive: true
});

bot.registerCommand('ami', (msg, args) => {
  return "𝓽𝓱𝓮 𝓲𝓶𝓹𝓾𝓻𝓮 𝓱𝓮𝓷𝓽𝓪𝓲 𝓺𝓾𝓮𝓮𝓷";
}, {
  caseInsensitive: true
});

// ========================== Unmute Command ==================================================== //
bot.registerCommand('unmute', (msg, args) => {
  if (msg.mentions[0] != undefined && msg.channel.guild != undefined) {
    msg.mentions.forEach((user, index, array) => {
      muteCmd.unmuteUser(msg, user).then((muted) => {
        if (muted) {
          bot.createMessage(msg.channel.id, {
            embed: {
              description: "**" + user.username + "** has been unmuted from text and voice by **" + msg.author.username + "**.",
              color: 0x008000
            }
          });
        }
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

bot.registerCommand('powerwashingporn', (msg, args) => {
  if (PowerWashingLinks.length == 0) {
    reddit.r('powerwashingporn').top().from('all').all((res) => {
      res.on('data', (data, res) => {
        data.data.children.forEach((child, index, mapObj) => {
          if (child.data.url != undefined) {
            PowerWashingLinks.push(child.data.url);
          }
        });
      });

      res.on('error', (err) => {
        console.log('Error while parsing powerwashingporn:');
        console.log(err);
      });

      res.on('end', () => {
        let randomUrl = tools.getRandom(0, PowerWashingLinks.length);

        bot.createMessage(msg.channel.id, PowerWashingLinks[randomUrl]);
      });

      ioTools.incrementCommandUse('powerwashing');
    });
  } else {
    let randomUrl = tools.getRandom(0, PowerWashingLinks.length);

    bot.createMessage(msg.channel.id, PowerWashingLinks[randomUrl]);

    ioTools.incrementCommandUse('powerwashing');
  }
});

bot.registerCommand('reddit', (msg, args) => {
  let subreddit = args.join('');

  reddit.r(subreddit, (err, data, res) => {
    let randomPost = tools.getRandom(0, data.data.children.length);

    if (data.data.children[randomPost] != undefined) {
      if (data.data.children[randomPost].data.over_18 && !msg.channel.nsfw) {
        bot.createMessage(msg.channel.id, "It appears the result of this search is NSFW and this channel is not flagged for NSFW content. Please try in another channel.")
      } else {
        bot.createMessage(msg.channel.id, data.data.children[randomPost].data.url);
      }
    } else {
      console.log('data.data.children[randomPost].data == undefined');
      console.log('subreddit = ' + subreddit);
      console.log('randomPost = ' + randomPost);
      console.log(data.data.children);
      bot.createMessage(msg.channel.id, "Unfortunately, something went wrong and the developers have been alerted. Please try again.");
    }

    ioTools.incrementCommandUse('reddit');
  });
}, {
  aliases: ['r']
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

bot.registerCommand('meh', (msg, args) => {
  ioTools.getImage('/root/tron/images/meh.gif', (img) => {
    bot.createMessage(msg.channel.id, '', {
      file: img,
      name: 'meh.gif'
    });
  });
}, {
  caseInsensitive: true
});

bot.registerCommand('lewd', (msg, args) => {
  if (!isNaN(parseInt(args[0]))) {
    reactions.pickLewdImage(args[0]).then(imgObject => {
      bot.createMessage(msg.channel.id, '', {
        file: imgObject.image,
        name: imgObject.filename
      });
    });
  } else {
    reactions.pickLewdImage().then(imgObject => {
      bot.createMessage(msg.channel.id, '', {
        file: imgObject.image,
        name: imgObject.filename
      });
    });
  }
});

bot.registerCommand('squirtle', (msg, args) => {
  if (!isNaN(parseInt(args[0]))) {
    reactions.pickSquirtleImage(args[0]).then(imgObject => {
      bot.createMessage(msg.channel.id, '', {
        file: imgObject.image,
        name: imgObject.filename
      });
    });
  } else {
    reactions.pickSquirtleImage().then(imgObject => {
      bot.createMessage(msg.channel.id, '', {
        file: imgObject.image,
        name: imgObject.filename
      });
    });
  }
}, {
  caseInsensitive: true
});

// ========================== Nobulli Command (Compromise on request from Onyx) ================= //
bot.registerCommand('nobulli', (msg, args) => {
  tools.doesMsgContainShu(msg).then((shuFlag) => {
    if (shuFlag) {
      bot.createMessage(msg.channel.id, 'You have mentioned a user who does not wish to be mentioned. Please refrain from doing this in the future.');
    } else {
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
      } else {
        return 'Please mention 2 users to include in the message.';
      }
    }
  });

  ioTools.incrementCommandUse('nobulli');
}, {
  aliases: ['bulli', 'bully', 'nobully'],
  argsRequired: true,
  caseInsensitive: true,
  description: 'Displays a random nobulli gif.',
  fullDescription: 'Displays a random nobulli gif and the name of the user you mention.',
  guildOnly: true
});

// ========================== Dodge Command (Requested by Rose) ================================= //
bot.registerCommand('dodge', (msg, args) => {
  if (args.length == 1 && !isNaN(parseInt(args[0]))) {
    reactions.pickDodgeImage(args[0]).then((img) => {
      bot.createMessage(msg.channel.id, '', {
        file: img,
        name: 'Dodge.gif'
      });
    });
  } else {
    reactions.pickDodgeImage().then((img) => {
      bot.createMessage(msg.channel.id, '', {
        file: img,
        name: 'Dodge.gif'
      });
    });
  }

  ioTools.incrementCommandUse('dodge');
}, {
  aliases: ['dodges'],
  caseInsensitive: true
});

// ========================== Dreamy Command (Requested by Dreamy) ============================== //
bot.registerCommand('dreamy', (msg, args) => {
  reactions.pickDreamyImage((dreamyImage) => {
    bot.createMessage(msg.channel.id, '', {
      file: dreamyImage,
      name: 'Dreamy.gif'
    });
  });

  ioTools.incrementCommandUse('dreamy');
}, {
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
  tools.doesMsgContainShu(msg).then((shuFlag) => {
    if (shuFlag) {
      bot.createMessage(msg.channel.id, 'You have mentioned a user who does not wish to be mentioned. Please refrain from doing this in the future.');
    } else {
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
      }
    }

    ioTools.incrementCommandUse('love');
  });
}, {
  aliases: ['loves'],
  caseInsensitive: true,
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
  tools.doesMsgContainShu(msg).then((shuFlag) => {
    if (shuFlag) {
      bot.createMessage(msg.channel.id, 'You have mentioned a user who does not wish to be mentioned. Please refrain from doing this in the future.');
    } else {
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
    }
  });

  ioTools.incrementCommandUse('slap');
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
  let sqlQuery = "INSERT INTO SUGGESTIONS (AUTHOR_ID, SUGGESTION_TEXT) VALUES " +
    "(\"" + msg.author.id + "\", " + " \"" + args.join(' ') + "\");";

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
  tools.doesMsgContainShu(msg).then((shuFlag) => {
    if (shuFlag) {
      bot.createMessage(msg.channel.id, 'You have mentioned a user who does not wish to be mentioned. Please refrain from doing this in the future.');
    } else {
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
    }
  });

  ioTools.incrementCommandUse('kiss');
}, {
  aliases: ['kisses'],
  caseInsensitive: true,
  description: 'Displays a random kiss gif.',
  fullDescription: 'Displays a random kissing reaction gif and the name of the individual mentioned.'
});

// ========================== Lick Command ====================================================== // 
bot.registerCommand('lick', (msg, args) => {
  tools.doesMsgContainShu(msg).then((shuFlag) => {
    if (shuFlag) {
      bot.createMessage(msg.channel.id, "You have mentioned a user who does not wish to be mentioned. Please refrain from doing this in the future.");
    } else {
      if (args.length == 2 && !isNaN(parseInt(args[0]))) {
        reactions.pickLickImage(args[0]).then((img) => {
          let user = msg.mentions[0].username;
          let message = "**" + user + "**, you've been licked by **" + msg.author.username + "**. :tongue:";

          bot.createMessage(msg.channel.id, message, {
            file: img,
            name: 'Lick.gif'
          });
        }, args[0]);
      } else if (msg.mentions.length > 0) {
        reactions.pickLickImage().then((img) => {
          let user = msg.mentions[0].username;
          let message = "**" + user + "**, you've been licked by **" + msg.author.username + "**. :tongue:";

          bot.createMessage(msg.channel.id, message, {
            file: img,
            name: 'Lick.gif'
          });
        });
      } else {
        bot.createMessage(msg.channel.id, "Please make sure to mention one or more users in order to use this command");
      }
    };
  });

  ioTools.incrementCommandUse('lick');
}, {
  aliases: ['licks'],
  caseInsensitive: true,
  description: 'Displays a random lick gif.',
  fullDescription: 'Displays a random licking gif and the name of the individual mentioned.'
});

// ========================== Pat Command ======================================================= //
bot.registerCommand('pat', (msg, args) => {
  tools.doesMsgContainShu(msg).then((shuFlag) => {
    if (shuFlag) {
      bot.createMessage(msg.channel.id, 'You have mentioned a user who does not wish to be mentioned. Please refrain from doing this in the future.');
    } else {
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
    }
  });

  ioTools.incrementCommandUse('pat');
}, {
  aliases: ['pats', 'tap', 'taps'],
  caseInsensitive: true
});

// ========================== Marriage Commands (requested by Prim) ============================= //
let marry = bot.registerCommand('marry', (msg, args) => {
  tools.doesMsgContainShu(msg).then((shuFlag) => {
    if (shuFlag) {
      bot.createMessage(msg.channel.id, 'You have mentioned a user who does not wish to be mentioned. Please refrain from doing this in the future.');
    } else {
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
              marriage.addProposal(msg.author.id, mention.id,
                (results) => {
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
    }
  });
}, {
  aliases: ['propose'],
  caseInsensitive: true,
  description: "Proposes to the given users.",
  fullDescription: "Proposes to all of the users that are mentioned so long as you don't already " +
    "have a pending proposal or exiting marriage to the user.",
  usage: "[@users] e.g. `+marry @Alcha#2621 @Bugs#2413`"
});

marry.registerSubcommand('list', (msg, args) => {
  if (msg.mentions.length != 0) {
    tools.doesMsgContainShu(msg).then((shuFlag) => {
      if (shuFlag) {
        bot.createMessage(msg.channel.id, 'You have mentioned a user who does not wish to be mentioned. Please refrain from doing this in the future.');
      } else {
        let userId = msg.mentions[0].id;
        marriage.getMarriages(userId, (marriages) => {
          let message = "";
          if (marriages.length > 0) {
            message = msg.mentions[0].username + " is currently married to:\n```\n";
            for (let x = 0; x < marriages.length; x++) {
              if (marriages[x].SPOUSE_A_ID != userId) {
                let username = tools.getUsernameFromId(marriages[x].SPOUSE_A_ID, bot);
                if (username.length > 0)
                  message += "- " + username + " since " + marriages[x].MARRIAGE_DATE + "\n";
              } else if (marriages[x].SPOUSE_B_ID != userId) {
                let username = tools.getUsernameFromId(marriages[x].SPOUSE_B_ID, bot);
                if (username.length > 0)
                  message += "- " + username + " since " + marriages[x].MARRIAGE_DATE + "\n";
              }
            }

            message += "```";
          } else {
            message = "Unfortunately, you're not currently married to anyone. :cry:";
          }

          bot.createMessage(msg.channel.id, message);
        });
      }
    });
  } else {
    marriage.getMarriages(msg.author.id, (marriages) => {
      let message = "";
      if (marriages.length > 0) {
        message = "You are currently married to:\n```\n";
        for (let x = 0; x < marriages.length; x++) {
          if (marriages[x].SPOUSE_A_ID != msg.author.id) {
            message += "- **" + tools.getUsernameFromId(marriages[x].SPOUSE_A_ID, bot) + "** since " + marriages[x].MARRIAGE_DATE + "\n"
          } else if (marriages[x].SPOUSE_B_ID != msg.author.id) {
            message += "- **" + tools.getUsernameFromId(marriages[x].SPOUSE_B_ID, bot) + "** since " + marriages[x].MARRIAGE_DATE + "\n"
          }
        }
        message += "```";
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
  marriage.getProposalType(msg.author.id, 1, (results) => {
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
  tools.doesMsgContainShu(msg).then((shuFlag) => {
    if (shuFlag) {
      bot.createMessage(msg.channel.id, 'You have mentioned a user who does not wish to be mentioned. Please refrain from doing this in the future.');
    } else {
      if (msg.mentions.length > 0) {
        let userId1 = msg.author.id;
        let userId2 = msg.mentions[0].id;

        marriage.verifyDivorce(userId1, userId2, (marriageIn) => {
          if (marriageIn != null) {
            marriage.addDivorceProposal(userId1, userId2, (success) => {
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
    }
  });
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
          marriage.acceptDivorceProposal(results[args[0]].DIVORCER_ID, msg.author.id, (success) => {
            if (success) {
              bot.createMessage(msg.channel.id, "You've successfuly divorced <@" + results[args[0]].DIVORCER_ID + ">");
            }
          });
        }
      }
    } else if (results.length == 1) {
      marriage.acceptDivorceProposal(results[0].DIVORCER_ID, msg.author.id, (success) => {
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
  tools.doesMsgContainShu(msg).then((shuFlag) => {
    if (shuFlag) {
      bot.createMessage(msg.channel.id, 'You have mentioned a user who does not wish to be mentioned. Please refrain from doing this in the future.');
    } else {
      // List current divorces of author or provided mention
      marriage.getDivorces(msg.author.id, (divorces) => {
        if (divorces.length == 0) {
          bot.createMessage(msg.channel.id, "It appears as though you do not have any divorces! :tada:");
        } else {
          let message = 'Here is a list of your current divorces:\n```\n';

          for (let x = 0; x < divorces.length; x++) {
            if (divorces[x].DIVORCER_ID != msg.author.id) {
              let username = tools.getUsernameFromId(divorces[x].DIVORCER_ID);
              if (username.length > 0)
                message += "- **" + username + "** since " + divorces[x].DIVORCE_DATE + "\n"
            } else if (divorces[x].DIVORCEE_ID != msg.author.id) {
              let username = tools.getUsernameFromId(divorces[x].DIVORCEE_ID);
              if (username.length > 0)
                message += "- **" + username + "** since " + divorces[x].DIVORCE_DATE + "\n"
            }
          }

          message += "```";

          bot.createMessage(msg.channel.id, message);
        }
      });
    }
  });
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
  tools.doesMsgContainShu(msg).then((shuFlag) => {
    if (shuFlag) {
      bot.createMessage(msg.channel.id, 'You have mentioned a user who does not wish to be mentioned. Please refrain from doing this in the future.');
    } else {
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
    }
  });

  ioTools.incrementCommandUse('kill');
}, {
  aliases: ['kills'],
  caseInsensitive: true,
  description: 'Displays a random killing gif.',
  fullDescription: 'Displays a random killing reaction gif and the name of the individual mentioned.'
});

// ========================== Punch Command ===================================================== //
bot.registerCommand('punch', (msg, args) => {
  tools.doesMsgContainShu(msg).then((shuFlag) => {
    if (shuFlag) {
      bot.createMessage(msg.channel.id, 'You have mentioned a user who does not wish to be mentioned. Please refrain from doing this in the future.');
    } else {
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
    }
  });

  ioTools.incrementCommandUse('punch');
}, {
  aliases: ['punches'],
  caseInsensitive: true,
  description: 'Displays a random punching gif.',
  fullDescription: 'Displays a random punching reaction gif and the name of the individual mentioned.'
});

// ========================== Kayla Command (Requested by Snow) ================================= //
bot.registerCommand('kayla', (msg, args) => {
  if (msg.author.id == 142092834260910080 || msg.author.id == 217870035090276374 || msg.author.id == config.owner) {
    reactions.pickKaylaImage().then(img => {
      bot.createMessage(msg.channel.id, '', {
        file: img,
        name: 'Kayla.gif'
      });
    });
  } else {
    return 'This command is unavailable to you.';
  }
}, {
  aliases: ['yoana']
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
  tools.doesMsgContainShu(msg).then((shuFlag) => {
    if (shuFlag) {
      bot.createMessage(msg.channel.id, 'You have mentioned a user who does not wish to be mentioned. Please refrain from doing this in the future.');
    } else {
      reactions.pickSpankImage((img) => {
        let user = msg.mentions[0].username;
        let message = "**" + user + "**, you've been spanked by **" + msg.author.username + "**. :wave:";

        bot.createMessage(msg.channel.id, message, {
          file: img,
          name: 'Spank.gif'
        });

        ioTools.incrementCommandUse('spank');
      });
    }
  });
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

// ========================== NSFW Commands ===================================================== //
let nsfwCmd = bot.registerCommand('nsfw', (msg, args) => {
  if (!msg.channel.nsfw) {
    bot.createMessage(msg.channel.id, "NSFW commands can only be executed in a channel flagged NSFW.");
  }
}, {
  defaultSubcommandOptions: {
    caseInsensitive: true,
    cooldown: 5000,
    cooldownMessage: 'Please wait 5 seconds between uses of this command.',
    guildOnly: false
  }
});

nsfwCmd.registerSubcommand('tattoo', (msg, args) => {
  if (!msg.channel.nsfw) {
    bot.createMessage(msg.channel.id, "NSFW commands can only be executed in a channel flagged NSFW.");
  } else {
    let tatSubs = [
      'HotChicksWithTattoos',
      'SuicideGirls',
      'SceneGirls',
      'PrettyAltGirls'
    ];

    let random = tools.getRandom(0, tatSubs.length);

    reddit.r('HotChicksWithTattoos', (err, data, res) => {
      let randomPost = tools.getRandom(0, data.data.children.length);

      if (data.data.children[randomPost] != undefined) {
        bot.createMessage(msg.channel.id, data.data.children[randomPost].data.url);
      } else {
        console.log('data.data.children[randomPost].data == undefined');
        console.log('subreddit = ' + tatSubs[random]);
        console.log(data.data.children);
        bot.createMessage(msg.channel.id, "Unfortunately, something went wrong and the developers have been alerted. Please try again.");
      }
    });
  }
});

nsfwCmd.registerSubcommand('newd', (msg, args) => {
  if (!msg.channel.nsfw) {
    bot.createMessage(msg.channel.id, "NSFW commands can only be executed in a channel flagged NSFW.");
  } else {
    tools.doesMsgContainShu(msg).then((shuFlag) => {
      if (shuFlag) {
        bot.createMessage(msg.channel.id, 'You have mentioned a user who does not wish to be mentioned. Please refrain from doing this in the future.');
      } else {
        if (msg.channel.guild == undefined) {
          // Private message channel
          // TODO: Added private message support.
        } else {
          // Guild channel
          if (msg.mentions != undefined && msg.mentions.length > 0) {
            lewds.getButt((butt, filename) => {
              msg.mentions.forEach((mention, index, array) => {
                mention.getDMChannel().then((channel) => {
                  if (mention.bot) {
                    bot.createMessage(msg.channel.id, "You can't send private messages to a bot.");
                  } else {
                    bot.createMessage(channel.id, '', {
                      file: butt,
                      name: filename
                    }).then((message) => {
                      // Process message?
                      console.log(msg.author.username + ' sent a lewd message to ' + mention.username + '.');
                    }).catch((err) => {
                      if (err.code == 20009) {
                        bot.createMessage(channel.id, "Unfortunately, it appears you can't receive explicit content. Please add Tron to your friends and try again.");
                      }
                    });
                  }
                });
              });

              if (msg.mentions.length == 1) {
                bot.createMessage(msg.channel.id, "Your message has most likely been sent. :wink:");
              } else {
                bot.createMessage(msg.channel.id, "Your messages have most likely been sent. :wink:");
              }
            });
          }
        }
      }
    });
  }

  ioTools.incrementCommandUse('newd');
}, {
  aliases: ['sendnude', 'sendnudes', 'nudes', 'snude', 'sn', 'slideintodms', 'sendnoods', 'sendnoots'],
  caseInsensitive: true,
  deleteCommand: true,
  description: "For those spicy nudes you've been wanting ( . Y . )",
  fullDescription: ':lenny:',
  usage: "[@users] e.g. `+sendnudes @Alcha#2621 @MissBella#6480`"
});

// ========================== Hentai Command ==================================================== //
nsfwCmd.registerSubcommand('boobs', (msg, args) => {
  if (!msg.channel.nsfw) {
    bot.createMessage(msg.channel.id, "NSFW commands can only be executed in a channel flagged NSFW.");
  } else {
    let boobSubs = [
      'boobs',
      'Boobies',
      'Stacked',
      'BustyPetite',
      'Cleavage',
      'bustyasians',
      'boltedontits',
      'burstingout'
    ];

    let randomSub = tools.getRandom(0, boobSubs.length);

    reddit.r(boobSubs[randomSub], (err, data, res) => {
      if (err) {
        Raven.captureException(err);
        bot.createMessage(msg.channel.id, err);
      } else {
        let randomPost = tools.getRandom(0, data.data.children.length);

        bot.createMessage(msg.channel.id, data.data.children[randomPost].data.url);

        ioTools.incrementCommandUse('boobs');
      }
    });
  }
}, {
  aliases: ['boob', 'breasts', 'tits']
});

// ========================== Hentai Command ==================================================== //
nsfwCmd.registerSubcommand('hentai', (msg, args) => {
  if (!msg.channel.nsfw) {
    bot.createMessage(msg.channel.id, "NSFW commands can only be executed in a channel flagged NSFW.");
  } else {
    let hentaiSubs = [
      'hentai',
      'rule34',
      'rule34feet'
    ];

    let randomSub = tools.getRandom(0, hentaiSubs.length);

    reddit.r(hentaiSubs[randomSub], (err, data, res) => {
      if (err) {
        Raven.captureException(err);
        bot.createMessage(msg.channel.id, err);
      } else {
        let randomPost = tools.getRandom(0, data.data.children.length);

        bot.createMessage(msg.channel.id, data.data.children[randomPost].data.url);

        ioTools.incrementCommandUse('hentai');
      }
    });
  }
}, {
  aliases: ['boob', 'breasts', 'tits']
});

// ========================== Butt Command ====================================================== //
nsfwCmd.registerSubcommand('butt', (msg, args) => {
  if (!msg.channel.nsfw) {
    bot.createMessage(msg.channel.id, "NSFW commands can only be executed in a channel flagged NSFW.");
  } else {
    let buttSubs = [
      'asstastic',
      'pawg',
      'facedownassup',
      'ass',
      'brunetteass',
      'CheekyBottoms',
      'datgap',
      'underbun',
      'rearpussy',
      'pawgtastic',
      'BestBooties',
      'CuteLittleButts'
    ];

    let randomSub = tools.getRandom(0, buttSubs.length);

    reddit.r(buttSubs[randomSub], (err, data, res) => {
      if (err) {
        Raven.captureException(err);
        bot.createMessage(msg.channel.id, err);
      } else {
        let randomPost = tools.getRandom(0, data.data.children.length);

        bot.createMessage(msg.channel.id, data.data.children[randomPost].data.url);

        ioTools.incrementCommandUse('butt');
      }
    });
  }
}, {
  aliases: ['butts', 'booty', 'ass']
});

// ========================== Feet Command (Requested by Rosa) ================================== //
nsfwCmd.registerSubcommand('feet', (msg, args) => {
  if (!msg.channel.nsfw) {
    bot.createMessage(msg.channel.id, "NSFW commands can only be executed in a channel flagged NSFW.");
  } else {
    let feetSubs = [
      'CelebrityFeet',
      'FFSocks',
      'Feet_NSFW',
      'FootFetish',
      'FFNBPS',
      'feetish',
      'scent_of_women_feet',
      'AsianFeet',
      'gayfootfetish',
      'HighHeels',
      'Soles',
      'CosplayFeet',
      'dirtyfeet',
      'DesiFeet',
      'ebonyfeet',
      'rule34feet',
      'girlsinanklesocks',
      'Porn_Star_Feet',
      'FeetVideos',
      'Soles_And_Holes',
      'Footjobs'
    ];

    let randomSub = tools.getRandom(0, feetSubs.length);

    reddit.r(feetSubs[randomSub], (err, data, res) => {
      if (err) {
        Raven.captureException(err);
        bot.createMessage(msg.channel.id, err);
      } else {
        let randomPost = tools.getRandom(0, data.data.children.length);

        bot.createMessage(msg.channel.id, data.data.children[randomPost].data.url);

        ioTools.incrementCommandUse('feet');
      }
    });
  }
}, {
  aliases: ['feets', 'foot']
});

// ========================== Gay Command (Requested by Mimiru) ================================= //
nsfwCmd.registerSubcommand('gay', (msg, args) => {
  if (!msg.channel.nsfw) {
    bot.createMessage(msg.channel.id, "NSFW commands can only be executed in a channel flagged NSFW.");
  } else {
    let gaySubs = [
      'cockrating',
      'BonersInPublic',
      'curved_cock',
      'MassiveCock',
      'ratemycock',
      'RedditorCum',
      'NSFW_DICK_and_Cock',
      'TotallyStraight',
      'CockOutline',
      'lovegaymale'
    ];

    let randomSub = tools.getRandom(0, gaySubs.length);

    reddit.r(gaySubs[randomSub], (err, data, res) => {
      if (err) {
        Raven.captureException(err);
        bot.createMessage(msg.channel.id, err);
      } else {
        let randomPost = tools.getRandom(0, data.data.children.length);

        bot.createMessage(msg.channel.id, data.data.children[randomPost].data.url);

        ioTools.incrementCommandUse('gay');
      }
    });
  }
}, {
  aliases: ['dick', 'dicks', 'cock', 'penis']
});

// ========================== Yaoi Command (Requested by Mimiru) ================================ //
nsfwCmd.registerSubcommand('yaoi', (msg, args) => {
  if (!msg.channel.nsfw) {
    bot.createMessage(msg.channel.id, "NSFW commands can only be executed in a channel flagged NSFW.");
  } else {
    yaoiCmd.getYaoiPhoto().then((photoUrl) => {
      bot.createMessage(msg.channel.id, photoUrl);

      ioTools.incrementCommandUse('yaoi');
    });
  }
});

// ========================== Rate Waifu Command (Requested by Bella and Kayla) ================= //
bot.registerCommand('ratewaifu', (msg, args) => {
  tools.doesMsgContainShu(msg).then((shuFlag) => {
    if (shuFlag) {
      bot.createMessage(msg.channel.id, 'You have mentioned a user who does not wish to be mentioned. Please refrain from doing this in the future.');
    } else {
      if (msg.channel.guild != undefined && msg.mentions.length == 1) {
        if (msg.mentions[0].id == 219270060936527873) {
          // Alcha
          bot.createMessage(msg.channel.id, "**" + msg.mentions[0].username + "**-senpai, I'd rate you 11/10. \n\n_notice me_");
        } else if (msg.mentions[0].id == 158740486352273409) {
          // Micaww
          bot.createMessage(msg.channel.id, "**" + msg.mentions[0].username + "**, I'd rate you 0/10 waifu.");
        } else if (msg.mentions[0].id == 142092834260910080) {
          // Snow/Daddy Yoana
          bot.createMessage(msg.channel.id, "**" + msg.mentions[0].username + "**, I'd rate you -69/10 waifu.");
        } else if (msg.mentions[0].id == 120797492865400832) {
          // Bella
          bot.createMessage(msg.channel.id, "**" + msg.mentions[0].username + "**, I'd rate you 12/10 waifu. :fire: :fire:");
        } else if (msg.mentions[0].id == 139474184089632769) {
          // Utah
          bot.createMessage(msg.channel.id, "**" + msg.mentions[0].username + "**, I'd rate you -∞/10 waifu.");
        } else if (msg.mentions[0].id == 167546638758445056) {
          bot.createMessage(msg.channel.id, "**" + msg.mentions[0].username + "**, I'd rate you ∞/10 waifu. The best of the best.");
        } else {
          let random = tools.getRandom(0, 11);
          let message = "**" + msg.mentions[0].username + "**, I'd rate you " + random + "/10 waifu.";

          bot.createMessage(msg.channel.id, message);
        }
      }
    }

    ioTools.incrementCommandUse('rate');
  });
}, {
  aliases: ['rate'],
  caseInsensitive: true,
  description: 'Randomly rates a mentioned user 0 - 10.',
  fullDescription: 'Generates a random number to rate the mentioned user on a scale of 0 to 10.'
});

bot.registerCommand('derp', (msg, args) => {
  return "Is loved by <@219270060936527873> more than anyone.";
});

const Batts = require('./cmds/Batts');
const batts = new Batts();

bot.registerCommand('batts', (msg, args) => {
  batts.getRandomEquation().then(equation => {
    bot.createMessage(msg.channel.id, equation);
  });
}, {
  aliases: ['battsie'],
  caseInsensitive: true
});

bot.registerCommand('potato', (msg, args) => {
  ioTools.getImage('/root/tron/images/potato.png', (img) => {
    bot.createMessage(msg.channel.id, '', {
      file: img,
      name: 'Potato.png'
    });
  });
}, {
  caseInsensitive: true
});

// ========================== Hugs Command ====================================================== //
bot.registerCommand('hug', (msg, args) => {
  tools.doesMsgContainShu(msg).then((shuFlag) => {
    if (shuFlag) {
      bot.createMessage(msg.channel.id, 'You have mentioned a user who does not wish to be mentioned. Please refrain from doing this in the future.');
    } else {
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
    }
  });
}, {
  aliases: ['hugs', 'cuddles'],
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
  tools.doesMsgContainShu(msg).then((shuFlag) => {
    if (shuFlag) {
      bot.createMessage(msg.channel.id, 'You have mentioned a user who does not wish to be mentioned. Please refrain from doing this in the future.');
    } else {
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
    }
  });
}, {
  aliases: ['pokes'],
  caseInsensitive: true,
  description: 'Poke a user.',
  fullDescription: 'Displays a random poke gif for the mentioned user.'
});

// ========================== Kick Command ====================================================== //
bot.registerCommand('kick', (msg, args) => {
  tools.doesMsgContainShu(msg).then((shuFlag) => {
    if (shuFlag) {
      bot.createMessage(msg.channel.id, 'You have mentioned a user who does not wish to be mentioned. Please refrain from doing this in the future.');
    } else {
      if (msg.author.id != config.mika && msg.mentions[0] != undefined) {
        reactions.pickKickImage((img) => {
          let user = msg.mentions[0].username;
          let message = "**" + user + "**, you've been kicked by **" + msg.author.username + "**.";

          bot.createMessage(msg.channel.id, message, {
            file: img,
            name: 'Kick.gif'
          });
        });
      } else {
        return INVALID_INPUT;
      }
    }

    ioTools.incrementCommandUse('kick');
  });
}, {
  aliases: ['kicks'],
  caseInsensitive: true,
  description: 'Displays random kick gif',
  fullDescription: 'Displays a random kick gif and the name of the person you mention.'
});

// ========================== Bite Command ====================================================== //
bot.registerCommand('bite', (msg, args) => {
  tools.doesMsgContainShu(msg).then((shuFlag) => {
    if (shuFlag) {
      bot.createMessage(msg.channel.id, 'You have mentioned a user who does not wish to be mentioned. Please refrain from doing this in the future.');
    } else {
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
      });
    }

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
  tools.doesMsgContainShu(msg).then((shuFlag) => {
    if (shuFlag) {
      bot.createMessage(msg.channel.id, 'You have mentioned a user who does not wish to be mentioned. Please refrain from doing this in the future.');
    } else {
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
      }
    }

    ioTools.incrementCommandUse('ship');
  });
}, {
  caseInsensitive: true,
  description: 'Ship two users.',
  fullDescription: 'Takes the two mentioned users and mashes their names into a lovely mess.'
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

// ========================== Exhentai Command ================================================== //
bot.registerCommand('exhentai', (msg, args) => {
  if (msg.channel.id != undefined) {
    return tools.getExhentaiCookies().toString();
  }
});

// ========================== Alcha Command (Requested by Utah) ================================= //
bot.registerCommand('alcha', (msg, args) => {
  if (!isNaN(parseInt(args[0]))) {
    reactions.pickJerryImage(args[0]).then((data) => {
      bot.createMessage(msg.channel.id, '', data);
    });
  } else {
    reactions.pickJerryImage().then((data) => {
      bot.createMessage(msg.channel.id, '', data);
    });
  }

  ioTools.incrementCommandUse('alcha');
}, {
  aliases: ['morty', 'jerry'],
  argsRequired: false,
  caseInsensitive: true,
  guildOnly: true,

});

// ========================== Utah Command ====================================================== //
bot.registerCommand('utah', (msg, args) => {
  if (msg.channel.guild != undefined) {
    if (msg.channel.guild.id == 254496813552238594) {
      bot.createMessage(msg.channel.id, "<@139474184089632769> <:Tiggered:256668458480041985>");
    } else if (msg.channel.guild.id == 197846974408556544) {
      bot.createMessage(msg.channel.id, "<@139474184089632769> <:Tiggered:298313391444066305>");
    } else if (msg.channel.guild.id == 325420023705370625) {
      bot.createMessage(msg.channel.id, "<@139474184089632769> <:Tiggered:327634830483259393>");
    } else {
      console.log("Guild = " + msg.channel.guild.name);
      console.log("id = " + msg.channel.guild.id);
    }

    ioTools.incrementCommandUse('utah');
  }
}, {
  caseInsensitive: true,
  description: 'A command to poke fun at a good friend.',
  fullDescription: 'A command used to poke fun at a good friend. -Alcha'
});

// ========================== MyAnimeList Commands ============================================== //
const popura = require('popura');
const malClient = popura(config.malUsername, config.malPassword);

let malCmd = bot.registerCommand('mal', (msg, args) => {});

let malSearchCmd = malCmd.registerSubcommand('search', (msg, args) => {});

malSearchCmd.registerSubcommand('anime', (msg, args) => {
  if (args.length == 0) {

  } else {
    let name = tools.concatArgs(args);

    malClient.searchAnimes(name).then(animes => {
      animes.forEach((anime, index, map) => {
        let animeUrl = "https://myanimelist.net/anime/" + anime.id + "/" + anime.title.replace(/ /g, "_");

        bot.createMessage(msg.channel.id, {
          embed: {
            title: anime.title,
            description: 'Score: **' + anime.score.toString() + '**',
            color: 0x336699,
            url: animeUrl,
            fields: [ // Array of field objects
              {
                name: "Type",
                value: anime.type,
                inline: true
              },
              {
                name: "Episodes",
                value: anime.episodes,
                inline: true
              },
              {
                name: "Status",
                value: anime.status,
                inline: true
              },
              {
                name: "Synopsis",
                value: anime.synopsis,
                inline: false
              }
            ],
            footer: {
              text: "Data retrieved from MyAnimeList.net.",
              icon_url: "https://myanimelist.cdn-dena.com/images/faviconv5.ico"
            }
          }
        })
      })
    }).catch(err => console.log(err));
  }
})

malSearchCmd.registerSubcommand('manga', (msg, args) => {
  if (args.length == 0) {

  } else {
    let name = tools.concatArgs(args);

    malClient.searchMangas(name).then(mangas => {
      mangas.forEach((manga, index, map) => {
        if (index + 1 != mangas.length) {
          let synopsis;
          let type;
          let volumes;
          let status;
          let score;
          let title;
          let image;

          if (manga.synopsis == null || manga.synopsis == undefined || manga.synopsis.length < 2) {
            synopsis = "N/A";
          } else {
            synopsis = manga.synopsis.replace(/\[\/?i]/g, '_')
              .replace(/\[\/?b]/g, '**')
              .replace(/(\[url=)/g, '(')
              .replace(/]\b/g, ') ')
              .replace(/(\[\/url\])/g, ' ');
          }

          if (manga.type == null) type = "N/A";
          else type = manga.type;

          if (manga.volumes == null) volumes = "N/A";
          else volumes = manga.volumes;

          if (manga.status == null) status = "N/A";
          else status = manga.status;

          if (manga.score == undefined || manga.score == null || manga.score.length == 0) score = "N/A";
          else score = manga.score;

          if (manga.title == undefined || manga.title == null || manga.title.length < 2) title = "N/A";
          else title = manga.title;

          if (manga.image == undefined || manga.image == null || manga.image.length < 2) image = "N/A";
          else image = manga.image;

          let mangaUrl = "https://myanimelist.net/manga/" + manga.id + "/" + title.replace(/ /g, "_");

          bot.createMessage(msg.channel.id, {
            embed: {
              title: title,
              thumbnail: {
                url: image
              },
              description: 'Score: **' + score.toString() + '**',
              color: 0x336699,
              url: mangaUrl,
              fields: [ // Array of field objects
                {
                  name: "Type",
                  value: type,
                  inline: true
                },
                {
                  name: "Volumes",
                  value: volumes,
                  inline: true
                },
                {
                  name: "Status",
                  value: status,
                  inline: true
                },
                {
                  name: "Synopsis",
                  value: synopsis,
                  inline: false
                }
              ],
              footer: {
                text: "Data retrieved from MyAnimeList.net.",
                icon_url: "https://myanimelist.cdn-dena.com/images/faviconv5.ico"
              }
            }
          }).catch((err) => {
            console.log('Error occured searching for manga.');
          })
        }
      })
    }).catch(err => console.log(err));
  }
})

let malUserCmd = malCmd.registerSubcommand('user', (msg, args) => {
  if (args.length == 0) {
    bot.createMessage(msg.channel.id, 'You must include the username of an account on MAL.');
  } else {
    let username = args[0];
    if (args[1] != undefined && args[1].toLowerCase() == 'anime') {
      malClient.getAnimeList(username).then((res) => {
        let fields = [];
        res.list.sort((a, b) => {
          if (a.my_score > b.my_score) return 1;
          else if (a.my_score < b.my_score) return -1;
          else return 0;
        });

        for (let i = res.list.length; fields.length < 30; i--) {
          if (res.list[i] != undefined && res.list[i].my_score != 0) {
            fields.push({
              name: res.list[i].series_title,
              value: res.list[i].my_score,
              inline: true
            });
          }
        }

        bot.createMessage(msg.channel.id, {
          embed: {
            title: 'Currently watching ' + res.myinfo.user_watching + ' anime.', // Title of the embed
            description: 'Has spent ' + res.myinfo.user_days_spent_watching + ' days watching anime.',
            author: { // Author property
              name: res.myinfo.user_name,
              url: "https://myanimelist.net/profile/" + res.myinfo.user_name,
              icon_url: "https://myanimelist.cdn-dena.com/images/userimages/" + res.myinfo.user_id + ".jpg"
            },
            color: 0x336699,
            fields: fields,
            footer: {
              text: "Data retrieved from MyAnimeList.net.",
              icon_url: "https://myanimelist.cdn-dena.com/images/faviconv5.ico"
            }
          }
        }).catch(err => console.log(err));
      }).catch(err => {
        bot.createMessage(msg.channel.id, "Unfortunately, it appears this username does not exist. Please verify and try again.");
      });
    } else if (args[1] != undefined && args[1].toLowerCase() == 'manga') {
      malClient.getMangaList(username).then((res) => {
        let fields = [];

        res.list.sort((a, b) => {
          if (a.my_score < b.my_score) return 1
          else if (a.my_score > b.my_score) return -1
          else return 0;
        });

        res.list.forEach((manga, index, map) => {
          if (manga.my_score == 0 && manga.my_status == 2) {
            fields.push({
              name: manga.series_title,
              value: manga.my_score,
              inline: true
            });
          } else if (manga.my_score != 0) {
            fields.push({
              name: manga.series_title,
              value: manga.my_score,
              inline: true
            });
          }
        });

        bot.createMessage(msg.channel.id, {
          embed: {
            title: 'Currently reading ' + res.myinfo.user_reading + ' manga', // Title of the embed
            description: 'Has spent ' + res.myinfo.user_days_spent_watching + ' days reading manga.',
            url: "https://myanimelist.net/animelist/" + res.myinfo.user_name + "?status=1",
            author: { // Author property
              name: res.myinfo.user_name,
              url: "https://myanimelist.net/profile/" + res.myinfo.user_name,
              icon_url: "https://myanimelist.cdn-dena.com/images/userimages/" + res.myinfo.user_id + ".jpg"
            },
            color: 0x336699, // Color, either in hex (show), or a base-10 integer
            fields: fields,
            footer: {
              text: "Data retrieved from MyAnimeList.net.",
              icon_url: "https://myanimelist.cdn-dena.com/images/faviconv5.ico"
            }
          }
        }).catch(err => {
          console.log(err);
        });
      }).catch((err) => {
        console.log(err)
        bot.createMessage(msg.channel.id, "Unfortunately, it appears this username does not exist. Please verify and try again.");
      });
    } else if (args[1] == undefined) {
      malClient.getAnimeList(username).then((res) => {
        bot.createMessage(msg.channel.id, {
          embed: {
            title: 'Currently watching ' + res.myinfo.user_watching + ' anime', // Title of the embed
            description: 'Has spent ' + res.myinfo.user_days_spent_watching + ' days watching anime.',
            url: "https://myanimelist.net/animelist/" + res.myinfo.user_name + "?status=1",
            author: { // Author property
              name: res.myinfo.user_name,
              url: "https://myanimelist.net/profile/" + res.myinfo.user_name,
              icon_url: "https://myanimelist.cdn-dena.com/images/userimages/" + res.myinfo.user_id + ".jpg"
            },
            color: 0x336699, // Color, either in hex (show), or a base-10 integer
            thumbnail: {},
            fields: [ // Array of field objects
              {
                name: "Completed",
                value: res.myinfo.user_completed,
                inline: true
              },
              {
                name: "On Hold",
                value: res.myinfo.user_onhold,
                inline: true
              },
              {
                name: "Dropped",
                value: res.myinfo.user_dropped,
                inline: true
              }
            ],
            footer: {
              text: "Data retrieved from MyAnimeList.net.",
              icon_url: "https://myanimelist.cdn-dena.com/images/faviconv5.ico"
            }
          }
        }).catch(err => {
          console.log(err);
        });
      }).catch((err) => {
        console.log(err)
        bot.createMessage(msg.channel.id, "Unfortunately, it appears this username does not exist. Please verify and try again.");
      });
    }
  }
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
  if (msg.mentions.length == 1 && msg.mentions[0].id == 258162570622533635) {
    let url = "https://www.cleverbot.com/getreply?key=" + config.cleverbot;
    let input = urlencode(msg.cleanContent);
    url += "&input=" + input;

    console.log('input = ' + input);

    Cleverbot.get(url, (data, response) => {
      bot.createMessage(msg.channel.id, data.clever_output);
    });
  }

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
    } else if (tools.messageIs(msg, 'o/') && msg.author.id != 258162570622533635) {
      bot.createMessage(msg.channel.id, '\\o');
    } else if (tools.messageIs(msg, '\\o') && msg.author.id != 258162570622533635) {
      bot.createMessage(msg.channel.id, 'o/');
    } else if (tools.messageIs(msg, 'ayy') && msg.author.id != 258162570622533635) {
      bot.createMessage(msg.channel.id, 'lmao');
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