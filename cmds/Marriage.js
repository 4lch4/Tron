'use strict'

// ========================== Tool Declarations ================================================= //
const Tools = require('../util/Tools.js')
const tools = new Tools()

const IOTools = require('../util/IOTools.js')
const ioTools = new IOTools()

// ========================== Marriage Class Begins ============================================= //
/**
 * Marriage class that contains the various functions that are vital for the Marriage command to
 * work properly.
 *
 * By default the constructor does not require any arguments be passed to it, however, in the future
 * it may become a possibility so it does accept options.
 */
class Marriage {
  constructor (options) {
    this.options = options || {}
  }

  /**
   * Add the provided proposer and proposee user ID to the PROPOSALS table and if there is any
   * output and a callback was provided, the output will be returned through the callback.
   *
   * @param {string} proposer User object of the person doing the proposing.
   * @param {string} proposee User object of the person being proposed to.
   * @param {*} callback      Callback to receive query results (if any).
   */
  addProposal (proposer, proposee, callback) {
    let currDate = tools.getFormattedTimestamp()
    let sqlQuery = 'INSERT INTO PROPOSALS (PROPOSER_ID, PROPOSEE_ID, PROPOSAL_DATE) VALUES (' +
      proposer + ', ' + proposee + ", '" + currDate + "');"

    ioTools.executeSql(sqlQuery, (results) => {
      if (callback !== undefined) {
        callback(results)
      }
    })
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
  removeProposal (proposerId, proposeeId, callback) {
    let sqlQuery = 'DELETE FROM PROPOSALS WHERE PROPOSER_ID = ' + proposerId + ' AND ' +
      'PROPOSEE_ID = ' + proposeeId + ';'

    ioTools.executeSql(sqlQuery, (results) => {
      if (callback !== undefined) {
        callback(results)
      }
    })
  }

  /**
   * Gets all proposals from the PROPOSALS table that has the provided user ID as a proposer or
   * proposee and if there are any results, they are returned through the provided callback.
   *
   * @param {string} userId   User ID of the person of interest.
   * @param {*} callback Callback to receive query results (if any) - required.
   */
  getProposals (userId, callback) {
    let sqlQuery = 'SELECT * FROM PROPOSALS WHERE PROPOSER_ID = ' + userId +
      ' || PROPOSEE_ID = ' + userId + ';'

    ioTools.executeSql(sqlQuery, (results) => {
      if (callback !== undefined) {
        callback(results)
      }
    })
  }

  getProposalType (userId, type, callback) {
    let sqlQuery = 'SELECT * FROM PROPOSALS WHERE '
    if (type === 0) {
      sqlQuery += 'PROPOSER_ID = ' + userId + ';'
    } else {
      sqlQuery += 'PROPOSEE_ID = ' + userId + ';'
    }

    ioTools.executeSql(sqlQuery, (results) => {
      if (callback !== undefined) {
        callback(results)
      }
    })
  }

  acceptProposal (proposer, proposee, callback) {
    let sqlQuery = 'SELECT * FROM PROPOSALS WHERE PROPOSER_ID = ' + proposer.id + ' AND PROPOSEE_ID = ' + proposee.id + ';'

    ioTools.executeSql(sqlQuery, (results) => {
      if (results !== null && results.length === 1) {
        this.removeProposal(proposer.id, proposee.id)

        this.addMarriage(proposer, proposee)

        callback(null, true)
      }
    })
  }

  /**
   * Adds a marriage to the MARRIAGES table using the provided spouses user IDs and if there is
   * any output and a callback was provided, the output will be returned through the callback.
   *
   * @param {string} spouseA  User ID of the user who proposed to the other user.
   * @param {string} spouseB  User ID of the user who was proposed to.
   * @param {*} callback      Callback to receive query results (if any) - optional.
   */
  addMarriage (spouseA, spouseB, callback) {
    let currDate = tools.getFormattedTimestamp()
    let spouseAId = 0
    let spouseBId = 0
    if (spouseA.id !== undefined) spouseAId = spouseA.id
    if (spouseB.id !== undefined) spouseBId = spouseB.id

    let sqlQuery = 'INSERT INTO MARRIAGES (SPOUSE_A_ID, SPOUSE_B_ID, MARRIAGE_DATE) VALUES (' +
      spouseAId + ', ' + spouseBId + ", '" + currDate + "');"

    ioTools.executeSql(sqlQuery, (results) => {
      if (callback !== undefined) {
        callback(results)
      }
    })

    this.getDivorce(spouseAId, spouseBId, (divorce) => {
      if (divorce.length > 0) {
        this.removeDivorce(spouseAId, spouseBId)
      }
    })
  }

  /**
   * Removes a marriage to the MARRIAGES table using the provided spouses user IDs and if there is
   * any output and a callback was provided, the output will be returned through the callback.
   *
   * @param {string} spouseAId User ID of the user who initiated the removal.
   * @param {string} spouseBId User ID of the other user involved in the marriage.
   * @param {*} callback       Callback to receive query results (if any) - optional.
   */
  removeMarriage (spouseAId, spouseBId, callback) {
    let sqlQuery = 'DELETE FROM MARRIAGES WHERE ' +
      '(SPOUSE_A_ID = ' + spouseAId + ' AND SPOUSE_B_ID = ' + spouseBId + ') OR ' +
      '(SPOUSE_A_ID = ' + spouseBId + ' AND SPOUSE_B_ID = ' + spouseAId + ');'

    ioTools.executeSql(sqlQuery, (results) => {
      if (callback !== undefined) {
        callback(results)
      }
    })
  }

  /**
   * Gets all marriages from the MARRIAGES table that has the provided user ID as Spouse_A or
   * Spouse_B and if there are any results, they are returned through the provided callback.
   *
   * @param {string} userId   User ID of the person of interest.
   * @param {*} callback      Callback to receive query results (if any) - required.
   */
  getMarriages (userId, callback) {
    let sqlQuery = 'SELECT * FROM MARRIAGES WHERE SPOUSE_A_ID = ' + userId +
      ' || SPOUSE_B_ID = ' + userId + ';'

    ioTools.executeSql(sqlQuery, (results) => {
      if (callback !== undefined) {
        callback(results)
      }
    })
  }

  getMarriage (user1Id, user2Id, callback) {
    let sqlQuery = 'SELECT * FROM MARRIAGES WHERE (SPOUSE_A_ID = ' + user1Id + ' AND SPOUSE_B_ID = ' + user2Id + ') OR ' +
      '(SPOUSE_A_ID = ' + user2Id + ' AND SPOUSE_B_ID = ' + user1Id + ');'

    ioTools.executeSql(sqlQuery, (results) => {
      callback(results)
    })
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
  verifyProposal (msg, callback) {
    let allVerified = true
    let cleanUsers = []
    let processed = 0

    msg.mentions.forEach((mention, index, array) => {
      let userId1 = msg.author.id
      let userId2 = mention.id

      let sqlQuery = 'SELECT * FROM MARRIAGES WHERE (SPOUSE_A_ID = ' + userId1 + ' AND SPOUSE_B_ID = ' + userId2 + ') OR ' +
        '(SPOUSE_A_ID = ' + userId2 + ' AND SPOUSE_B_ID = ' + userId1 + ') UNION ' +
        'SELECT * FROM PROPOSALS WHERE PROPOSER_ID = ' + userId1 + ' AND PROPOSEE_ID = ' + userId2

      ioTools.executeSql(sqlQuery, (results) => {
        if (results !== null && results.length > 0) {
          allVerified = false
        } else {
          cleanUsers.push(mention)
        }

        // Indicate a mention has been processed
        processed++

        // If all mentions have been processed, passback the cleaned user array and
        // the allVerified boolean.
        if (processed === msg.mentions.length) {
          callback(cleanUsers, allVerified)
        }
      })
    })
  }

  /**
   * Format the provided proposals for display to a user. Usually display before the user selects
   * which one to accept/deny.
   *
   * @param {*} proposals
   * @param {*} callback
   */
  formatProposals (proposals, bot, callback) {
    let processed = 0
    let message = '```'

    proposals.forEach((proposal, index, array) => {
      tools.getUsernameFromId(proposal.PROPOSER_ID, bot, username => {
        message += '(' + processed + ') ' + username + '\n'

        processed++

        if (processed === proposals.length) {
          message += '```'
          callback(message)
        }
      })
    })
  }

  addDivorce (divorcer, divorcee, callback) {
    let currDate = tools.getFormattedTimestamp()
    let divorcerId = 0
    let divorceeId = 0
    if (divorcer.id !== undefined) divorcerId = divorcer.id
    if (divorcee.id !== undefined) divorceeId = divorcee.id

    let sqlQuery = 'INSERT INTO DIVORCES (DIVORCER_ID, DIVORCEE_ID, DIVORCE_DATE) VALUES ' +
      '(' + divorcerId + ', ' + divorceeId + ', "' + currDate + '");'

    ioTools.executeSql(sqlQuery, (results) => {
      if (callback !== undefined) {
        callback(results)
      }
    })
  }

  // SELECT * FROM DIVORCES WHERE (DIVORCER_ID = userId1 AND DIVORCEE_ID = userId2) OR
  // (DIVORCER_ID = userId2 AND DIVORCEE_ID = userId1) UNION SELECT * FROM DIVORCE_PROPOSALS(DIVORCER_ID = userId1 AND DIVORCEE_ID = userId2) OR(DIVORCER_ID = userId2 AND DIVORCEE_ID = userId1);
  getDivorce (userId1, userId2, callback) {
    let sqlQuery = 'SELECT DIVORCER_ID FROM DIVORCES WHERE (DIVORCER_ID = ' + userId1 + ' AND DIVORCEE_ID = ' + userId2 + ') OR ' +
      '(DIVORCER_ID = ' + userId2 + ' AND DIVORCEE_ID = ' + userId1 + ') UNION SELECT DIVORCER_ID FROM DIVORCE_PROPOSALS WHERE (DIVORCER_ID = ' + userId1 + ' AND DIVORCEE_ID = ' + userId2 + ') OR (DIVORCER_ID = ' + userId2 + ' AND DIVORCEE_ID = ' + userId1 + ');'

    ioTools.executeSql(sqlQuery, (results) => {
      callback(results)
    })
  }

  getDivorces (userId, callback) {
    let sqlQuery = 'SELECT * FROM DIVORCES WHERE DIVORCER_ID = ' + userId + ' OR DIVORCEE_ID = ' + userId + ';'

    ioTools.executeSql(sqlQuery, (results) => {
      callback(results)
    })
  }

  /**
   * Format the provided divorce proposals for display to a user. Usually display before the user
   * selects which one to accept/deny.
   *
   * @param {*} proposals
   * @param {*} callback
   */
  formatDivorceProposals (proposals, callback) {
    let processed = 0
    let message = '```'

    proposals.forEach((proposal, index, array) => {
      message += '(' + processed + ') ' + proposal.DIVORCER_USERNAME + '\n'

      processed++

      if (processed === proposals.length) {
        message += '```'
        callback(message)
      }
    })
  }

  verifyDivorce (userId1, userId2, callback) {
    this.getMarriage(userId1, userId2, (marriage) => {
      if (marriage !== null) {
        this.getDivorce(userId1, userId2, (divorce) => {
          if (divorce.length === 0) {
            callback(marriage)
          } else {
            callback(null)
          }
        })
      }
    })
  }

  addDivorceProposal (divorcer, divorcee, callback) {
    let divorcerId = 0
    let divorceeId = 0
    if (divorcer.id !== undefined) divorcerId = divorcer.id
    if (divorcee.id !== undefined) divorceeId = divorcee.id

    let sqlQuery = 'INSERT INTO DIVORCE_PROPOSALS (DIVORCER_ID, DIVORCEE_ID) VALUES (' +
    divorcerId + ', ' + divorceeId + ');'

    ioTools.executeSql(sqlQuery, (results) => {
      if (callback !== undefined) {
        callback(results)
      }
    })
  }

  getDivorceProposals (userId, callback) {
    let sqlQuery = 'SELECT * FROM DIVORCE_PROPOSALS WHERE DIVORCER_ID = ' + userId +
      ' || DIVORCEE_ID = ' + userId + ';'

    ioTools.executeSql(sqlQuery, (results) => {
      if (callback !== undefined) {
        callback(results)
      }
    })
  }

  /**
   * Remove a divorce proposal from the DIVORCE_PROPOSALS table using the provided divorcer and
   * divorcee user IDs and if there is any output and a callback was provided, the output will be
   * returned through the callback.
   *
   * @param {string} divorcerId User ID of the person who did the proposing.
   * @param {string} divorceeId User ID of the person who was proposed to.
   * @param {*} callback        Callback to receive query results (if any) - optional.
   */
  removeDivorceProposal (divorcerId, divorceeId, callback) {
    let sqlQuery = 'DELETE FROM DIVORCE_PROPOSALS WHERE DIVORCER_ID = ' + divorcerId + ' AND ' +
      'DIVORCEE_ID = ' + divorceeId + ';'

    ioTools.executeSql(sqlQuery, (results) => {
      if (callback !== undefined) {
        callback(results)
      }
    })
  }

  removeDivorce (divorcerId, divorceeId, callback) {
    let sqlQuery = 'DELETE FROM DIVORCES WHERE ' +
      '(DIVORCER_ID = ' + divorcerId + ' AND DIVORCEE_ID = ' + divorceeId + ') OR ' +
      '(DIVORCER_ID = ' + divorceeId + ' AND DIVORCEE_ID = ' + divorcerId + ');'

    ioTools.executeSql(sqlQuery, (results) => {
      if (callback !== undefined) {
        callback(results)
      }
    })
  }

  acceptDivorceProposal (divorcer, divorcee, callback) {
    let sqlQuery = 'SELECT * FROM DIVORCE_PROPOSALS WHERE DIVORCER_ID = ' + divorcer.id + ' AND DIVORCEE_ID = ' + divorcee.id + ';'

    ioTools.executeSql(sqlQuery, (results) => {
      if (results !== null && results.length === 1) {
        this.removeDivorceProposal(divorcer.id, divorcee.id)

        this.addDivorce(divorcer, divorcee)

        this.removeMarriage(divorcer.id, divorcee.id)

        callback(null, true)
      }
    })
  }

  alertUsersToProposals (channelId, mentions, bot) {
    this.convertMentions(mentions, (content) => {
      bot.createMessage(channelId, content + '\n\n' +
        "You've received a marriage proposal. Use `+marry accept` to accept the proposal or `+marry deny` to reject it.")
    })
  }

  convertMentions (mentions, callback) {
    let message = ''

    for (let x = 0; x < mentions.length; x++) {
      message += '<@' + mentions[x].id + '> '

      if (x + 1 === mentions.length) {
        callback(message)
      }
    }
  }
}

module.exports = Marriage
