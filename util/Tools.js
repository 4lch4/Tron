"use strict"

const moment = require('moment-timezone');
const config = require('./config.json');
const roleNames = config.roleNames;
const Chance = require('chance');
const chance = new Chance();
const fs = require('fs');
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
class Tools {
    constructor(options) {
        this.options = options || {};
    }

    getExhentaiCookies() {
        return exhentaiCookies;
    }

    formatTimeString(string) {
        return moment(string).tz(config.defaultTimezone).format("YYYY-MM-DD_HH:mm:ss");
    }

    getFormattedTimestamp() {
        return moment().tz(config.defaultTimezone).format('YYYY-MM-DD_HH:mm:ss')
    }

    upperFirstC(string) {
        let temp = string.toLowerCase();
        return temp.charAt(0).toUpperCase() + temp.slice(1);
    }

    /**
     * Returns a random integer between {min} and {max}, not including the max.
     *
     * @param {*} min
     * @param {*} max
     */
    getRandom(min, max) {
        return chance.integer({
            min: min,
            max: (max - 1)
        });
    }

    messageIs(msg, str) {
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

    messageStartsWith(msg, str) {
        let comparison = str.toUpperCase();
        let input = "";

        if (msg.content != undefined) {
            input = msg.content.toUpperCase();
        } else {
            input = msg.toUpperCase();
        }

        return input.startsWith(comparison);
    }

    allowedRole(comparison) {
        let allowed = false;
        roleNames.forEach((curr, index, arr) => {
            if (curr != null && curr.toLowerCase() == comparison) {
                allowed = true;
            }
        })

        return allowed;
    }

    getRoleId(msg, comparison) {
        let id = "";

        msg.channel.guild.roles.forEach((curr, index, values) => {
            if (curr.name.toLowerCase() == comparison) {
                id = curr.id;
            }
        })

        return id;
    }

    removeAllRoles(userId, msg, bot) {
        for (var x = 0; x < roleNames.length; x++) {
            let roleId = this.getRoleId(msg, roleNames[x].toLowerCase());
            msg.channel.guild.removeMemberRole(userId, roleId);
        }

        bot.createMessage(msg.channel.id, "You've been removed from all the roles available to you.");
        msg.delete();
    }

    addAllRoles(userId, msg, bot) {
        for (var x = 0; x < roleNames.length; x++) {
            let roleId = this.getRoleId(msg, roleNames[x].toLowerCase());
            msg.channel.guild.addMemberRole(userId, roleId);
        }

        bot.createMessage(msg.channel.id, "You've been added to all the roles available to you.");
        msg.delete();
    }

    concatArgs(args) {
        let str = "";

        if (args.length > 1) {
            args.forEach((curr, index, arr) => {
                if (str.length > 1) {
                    str += " " + curr.toLowerCase();
                } else {
                    str += curr.toLowerCase();
                }
            })
        } else {
            str = args[0].toLowerCase();
        }

        return str;
    }

    memberIsMod(msg) {
        let roles = msg.channel.guild.members.get(msg.author.id).roles;
        let found = false;

        roles.forEach((curr, index, arr) => {
            console.log('curr = ' + curr);
            if (curr == '254970225642962949') {
                found = true;
            } else if (curr == '254970606565588992') {
                found = true;
            }
        })

        return found;
    }

    messageIsWhyCmd(msg) {
        let content = msg.content;
        let found = false;

        if (content.includes("?")) {
            content = content.substring(0, content.indexOf("?"));
        }

        whyCmds.forEach((cmd) => {
            if (this.messageIs(content, cmd)) {
                found = true;
            }
        })

        return found;
    }

    readFiles(dirname, onFileContent, onError, onComplete) {
        let processNum = 0;

        fs.readdir(dirname, (err, filenames) => {
            if (err) {
                onError(err);
                return;
            }

            filenames.forEach((filename, index, array) => {
                fs.readFile(dirname + filename, (err, content) => {
                    if (err) {
                        onError(err);
                        return;
                    }

                    onFileContent(filename, content);

                    processNum++;
                    if (processNum == array.length) {
                        onComplete();
                    }
                })
            });
        });
    }

    getImageFromUrl(url, callback) {
        var http = require('http');
        var Canvas = require('canvas');
        http.get(url).on('response', (res) => {
                // http://stackoverflow.com/a/14269536/478603

                var chunks = [];
                res.on('data', (data) => {
                    chunks.push(data);
                })

                res.on('end', () => {
                    var img = new Canvas.Image();
                    img.src = Buffer.concat(chunks);
                    callback(img);
                })

            })
            .on('error', (err) => {
                callback(err);
            });
    }
}

module.exports = Tools;