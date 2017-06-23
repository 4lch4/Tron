const Tools = require('../util/Tools');
const tools = new Tools();

class Mute {
    constructor(options) {
        this.options == options || {};
    }

    getMuteStatus(member, roleId) {
        return new Promise((resolve, reject) => {
            if (member.roles.includes(roleId)) {
                resolve(true);
            } else {
                resolve(false);
            }
        });
    }

    updateMute(msg, member, roleId, mute) {
        return new Promise((resolve, reject) => {
            if (mute) {
                msg.channel.guild.removeMemberRole(member.id, roleId).then((err) => {
                    if (err) {
                        Raven.captureException(err);
                    } else {
                        resolve(false);
                    }
                });
            } else {
                msg.channel.guild.addMemberRole(member.id, roleId).then((err) => {
                    if (err) {
                        Raven.captureException(err);
                    } else {
                        resolve(true);
                    }
                });
            }
        });
    }

    muteUser(msg, user, role) {
        return new Promise((resolve, reject) => {
            // Get mute role to make needed changes
            tools.getTronMuteRole(msg).then((role) => {
                // Get member of the user to mute
                tools.getMember(msg, user).then((member) => {
                    // Determine if they've already been muted or not
                    this.getMuteStatus(member, role.id).then((muted) => {
                        // Update the mute status depending on muted variable
                        this.updateMute(msg, member, role.id, muted).then((status) => {
                            resolve(status);
                        });
                    });
                });
            });
        });
    }
}

module.exports = Mute;