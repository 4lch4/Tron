const Tools = require('../util/Tools');
const tools = new Tools();

class Mute {
    constructor(options) {
        this.options == options || {};
    }

    unmuteUser(msg, user) {
        return new Promise((resolve, reject) => {
            tools.getTronMuteRole(msg).then((role) => {
                tools.getMember(msg, user).then((member) => {
                    msg.channel.guild.removeMemberRole(member.id, role.id).then((err) => {
                        if (err) {
                            Raven.captureException(err);
                            reject(err);
                        } else {
                            resolve(true);
                        }
                    });
                });
            });
        });
    }

    muteUser(msg, user) {
        return new Promise((resolve, reject) => {
            // Get mute role to make needed changes
            tools.getTronMuteRole(msg).then((role) => {
                // Get member of the user to mute
                tools.getMember(msg, user).then((member) => {
                    msg.channel.guild.addMemberRole(member.id, role.id).then((err) => {
                        if (err) {
                            Raven.captureException(err);
                            reject(err);
                        } else {
                            resolve(true);
                        }
                    });
                });
            });
        });
    }
}

module.exports = Mute;