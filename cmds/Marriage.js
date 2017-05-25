"use strict"

// ========================== Tool Declarations ================================================= //
const Tools = require('../util/Tools.js');
const tools = new Tools();

const IOTools = require('../util/IOTools.js');
const ioTools = new IOTools();

// ========================== Marriage Class Begins ============================================= //
/**
 * Marriage class that contains the various functions that are vital for the Marriage command to
 * work properly.
 *
 * By default the constructor does not require any arguments be passed to it, however, in the future
 * it may become a possibility so it does accept options.
 */
class Marriage {
    constructor(options) {
        this.options = options || {};
    }

    /**
     * Add the provided proposer and proposee user ID to the PROPOSALS table and if there is any
     * output and a callback was provided, the output will be returned through the callback.
     *
     * @param {string} proposer User object of the person doing the proposing.
     * @param {string} proposee User object of the person being proposed to.
     * @param {*} callback      Callback to receive query results (if any).
     */
    addProposal(proposer, proposee, callback) {
        let currDate = tools.getFormattedTimestamp();
        let sqlQuery = "INSERT INTO PROPOSALS (PROPOSER_ID, PROPOSER_USERNAME, PROPOSEE_ID, PROPOSEE_USERNAME, PROPOSAL_DATE) VALUES (" +
            proposer.id + ", '" + proposer.username + "', " +
            proposee.id + ", '" + proposee.username + "', '" +
            currDate + "');";

        ioTools.executeSql(sqlQuery, (results) => {
            if (callback != null) {
                callback(results);
            } else {
                console.log("No callback was provided for addProposal!");
            }
        });
    }

    /**
     * Remove a proposal from the PROPOSALS table using the provided proposer and proposee user IDs
     * and if there is any output and a callback was provided, the output will be returned through
     * the callback.
     *
     * @param {string} proposerId User ID of the person who did the proposing.
     * @param {string} proposeeId User ID of the person who was proposed to.
     * @param {*} callback        Callback to receive query results (if any) - optional.
     */
    removeProposal(proposerId, proposeeId, callback) {
        let sqlQuery = "DELETE FROM PROPOSALS WHERE PROPOSER_ID = " + proposerId + " && " +
            "PROPOSEE_ID = " + proposeeId + ";";

        ioTools.executeSql(sqlQuery, (results) => {
            if (callback != null) {
                callback(results);
            } else {
                console.log("No callback was provided for removeProposal!");
            }
        });
    }

    /**
     * Gets all proposals from the PROPOSALS table that has the provided user ID as a proposer or
     * proposee and if there are any results, they are returned through the provided callback.
     *
     * @param {string} userId   User ID of the person of interest.
     * @param {*} callback Callback to receive query results (if any) - required.
     */
    getProposals(userId, callback) {
        let sqlQuery = "SELECT * FROM PROPOSALS WHERE PROPOSER_ID = " + userId +
            " || PROPOSEE_ID = " + userId + ";";

        ioTools.executeSql(sqlQuery, (results) => {
            if (callback != null) {
                callback(results);
            } else {
                console.log("No callback was provided for removeProposal!");
            }
        });
    }

    acceptProposal(proposer, proposee, callback) {
        let sqlQuery = "SELECT * FROM PROPOSALS WHERE PROPOSER_ID = " + proposer.id + " && PROPOSEE_ID = " + proposee.id + ";";
        console.log('sqlQuery = ' + sqlQuery);

        ioTools.executeSql(sqlQuery, (results) => {
            if (results != null && results.length == 1) {
                this.removeProposal(proposer.id, proposee.id);

                this.addMarriage(proposer, proposee);

                callback(true);
            }
        });
    }

    /**
     * Adds a marriage to the MARRIAGES table using the provided spouses user IDs and if there is
     * any output and a callback was provided, the output will be returned through the callback.
     *
     * @param {string} spouseA  User ID of the user who proposed to the other user.
     * @param {string} spouseB  User ID of the user who was proposed to.
     * @param {*} callback      Callback to receive query results (if any) - optional.
     */
    addMarriage(spouseA, spouseB, callback) {
        let currDate = tools.getFormattedTimestamp();
        let sqlQuery = "INSERT INTO MARRIAGES (SPOUSE_A_ID, SPOUSE_A_USERNAME, SPOUSE_B_ID, SPOUSE_B_USERNAME, MARRIAGE_DATE) VALUES (" +
            spouseA.id + ", '" + spouseA.username + "', " + spouseB.id + ", '" + spouseB.username + "', '" + currDate + "');";

        ioTools.executeSql(sqlQuery, (results) => {
            if (callback != null) {
                callback(results);
            } else {
                console.log("No callback was provided for addMarriage!");
            }
        });
    }


    /**
     * Removes a marriage to the MARRIAGES table using the provided spouses user IDs and if there is
     * any output and a callback was provided, the output will be returned through the callback.
     *
     * @param {string} spouseA  User ID of the user who initiated the removal.
     * @param {string} spouseB  User ID of the other user involved in the marriage.
     * @param {*} callback      Callback to receive query results (if any) - optional.
     */
    removeMarriage(spouseA, spouseB, callback) {
        let sqlQuery = "DELETE FROM MARRIAGES WHERE SPOUSE_A_ID = " + spouseA +
            " || SPOUSE_B_ID = " + spouseB + ";";

        ioTools.executeSql(sqlQuery, (results) => {
            if (callback != null) {
                callback(results);
            } else {
                console.log("No callback was provided for removeMarriage!");
            }
        });
    }

    /**
     * Gets all marriages from the MARRIAGES table that has the provided user ID as Spouse_A or
     * Spouse_B and if there are any results, they are returned through the provided callback.
     *
     * @param {string} userId   User ID of the person of interest.
     * @param {*} callback      Callback to receive query results (if any) - required.
     */
    getMarriages(userId, callback) {
        let sqlQuery = "SELECT * FROM MARRIAGES WHERE SPOUSE_A_ID = " + userId +
            " || SPOUSE_B_ID = " + userId + ";";

        ioTools.executeSql(sqlQuery, (results) => {
            if (callback != null) {
                callback(results);
            } else {
                console.log("No callback was provided for getMarriages!");
            }
        });
    }

    /**
     * Iterates through all the mentions in the provided msg object and performs an SQL query to
     * determine if the user who proposed has previously proposed to anyone they're currently
     * proposing to.
     *
     * If so, it removes the mention from the msg object and then when all mentions have been
     * checked, the cleaned msg object is returned through the callback.
     *
     * @param {*} msg       Message object from the Discord bot containing the mentions.
     * @param {*} callback  Callback to receive the cleaned Message object.
     */
    verifyProposal(msg, callback) {
        let allVerified = true;
        let cleanUsers = [];
        let processed = 0;

        for (let x = 0; x < msg.mentions.length; x++) {
            let userId1 = msg.author.id;
            let userId2 = msg.mentions[x].id;

            let sqlQuery = "SELECT * FROM MARRIAGES WHERE (SPOUSE_A_ID = " + userId1 + " AND SPOUSE_B_ID = " + userId2 + ") OR (SPOUSE_A_ID = " + userId2 + " AND SPOUSE_B_ID = " + userId1 + ") UNION " +
                "SELECT * FROM PROPOSALS WHERE PROPOSER_ID = " + userId1 + " AND PROPOSEE_ID = " + userId2;

            console.log('sqlQuery = ' + sqlQuery);

            ioTools.executeSql(sqlQuery, (results) => {
                if (results != null && results.length > 0) {
                    allVerified = false;
                } else if (!cleanUsers.includes(msg.mentions[x])) {
                    cleanUsers.push(msg.mentions[x]);
                }

                processed++;

                if (processed == msg.mentions.length) {
                    callback(cleanUsers, allVerified);
                }
            });
        }
    }

    alertUsers(channelId, mentions, bot) {
        this.convertMentions(mentions, (content) => {
            bot.createMessage(channelId, content + "\n\n" +
                "You've received a marriage proposal. Use `+marry accept` to accept the proposal or `+marry deny` to reject it.");
        });
    }

    convertMentions(mentions, callback) {
        let message = '';

        for (let x = 0; x < mentions.length; x++) {
            message += "<@" + mentions[x].id + "> "

            if (x + 1 == mentions.length) {
                callback(message);
            }
        }
    }
}

module.exports = Marriage;