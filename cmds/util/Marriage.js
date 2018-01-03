const Marriage = require('../../util/db/Marriage')
const colors = require('../../util/colors')

/**
 * Allows a user to propose to another user.
 *
 * @param {*} msg
 * @param {*} user
 */
module.exports.beginProposal = (msg, user) => {
  const marriage = new Marriage(msg.author.id, user.id)
  console.log(`Beginning proposal...`)

  return Promise.resolve(marriage)
}

/**
 * Creates a message collector in the provided channel and waits for a reply from the provided user.
 * If a yes (true) or no (false) answer is received from the user, the collector is stopped, and the
 * response is returned via a Promise as a Boolean.
 *
 * A number can be provided as the timeout parameter if you wish to modify the default limit of 60.
 * After the duration of the timeout period, the collector will stop itself and return an error with
 * the message time.
 *
 * @param {*} channel - The channel where the proposal was made
 * @param {*} user - The mentioned user who is being proposed to
 * @param {number} [timeout=60] - How long to wait for a response in seconds
 *
 * @returns {Promise<boolean>} True or false, was the proposal accepted
 */
module.exports.getProposalResponse = (channel, user, timeout = 60) => {
  const collector = channel.createMessageCollector(m =>
    m.member.id === user.id && m.channel.id === channel.id,
    { time: timeout * 1000 })

  return new Promise((resolve, reject) => {
    // When a message is collected, determine if it is a yes or no
    collector.on('collect', (m, c) => {
      // If the user replies with a yes, stop the collector, and return true
      if (m.content.toLowerCase() === 'yes') {
        collector.stop()
        resolve(true)
      } else if (m.content.toLowerCase() === 'no') {
        // If the user replies with a no, stop the collector, and return false
        collector.stop()
        resolve(false)
      }
    })

    collector.on('end', (c, r) => {
      if (r === 'time') reject(r)
      else if (r === 'user') resolve(true)
      else {
        console.error('The proposal response collector has ended unexpectedly...', r)
        resolve(false)
      }
    })
  })
}

/**
 * Retrieves the current marriages of the provided user (if any exist) as well as the anniversary of
 * the marriage.
 */
module.exports.getMarriedIdList = (userId) => {
  return new Promise((resolve, reject) => {
    (new Marriage(userId)).retrieveMarriedList().then(list => {
      let idList = []

      list.forEach(val => {
        idList.push({
          id: val._id,
          anniversary: val.anniversary
        })
      })

      resolve(idList)
    }).catch(err => reject(err))
  })
}

/**
 * Converts the given list of user ids to their current username/nickname and adds it to an inline
 * field object with the initial date/anniversary of the marriage as the value.
 *
 * @param {string[]} idList - An array containing the user ids and marriage dates
 * @param {*} client - The Discord.js client which is used to convert user ids to usernames
 */
module.exports.convertIdsToFields = (idList, client) => {
  const imgList = ['💕', '❤', '💙', '💛', '💚', '🧡']
  let fieldsOut = []

  return new Promise((resolve, reject) => {
    for (let x = 0; x < 6; x++) {
      if (idList[x] !== undefined) {
        let username = client.users.get(idList[x].id).username

        fieldsOut.push({
          'name': `${imgList[x]} ${username}`,
          'value': `*- ${idList[x].anniversary.substring(0, 10)}*`,
          'inline': true
        })
      }
    }

    resolve(fieldsOut)
  })
}

module.exports.generateListEmbed = (username, fields, client) => {
  return new Promise((resolve, reject) => {
    resolve({
      embed: {
        color: colors.red.P500,
        author: {
          name: client.user.username,
          icon_url: client.user.avatarURL()
        },
        description: `A list of marriages and their anniversary for ${username}.`,
        fields: fields
      }
    })
  })
}
