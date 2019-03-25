const { Command } = require('discord.js-commando')
const logger = new (require('../util/logger'))()
const standard = require('./util/Strings').enUS.standard

module.exports = class BaseCmd extends Command {
  log (info) {
    return logger.log(info)
  }

  warn (warning) {
    return logger.warn(warning)
  }

  error (err) {
    return logger.error(err)
  }

  getUsernames (userIds) {
    let usernames = []
    userIds.forEach(id => usernames.push(this.client.users.get(id).username))
    return usernames
  }

  getMentionedUsernames (msg) {
    // let usernames = msg.mentions.users.map(user => `**${user.username}**`)
    // return `${usernames.join(', ')}`

    let usernames = []

    msg.mentions.users.forEach(user => usernames.push(user.username))

    return `**${usernames.join('**, **')}**`
  }

  /**
   * Cleans each argument within the array by converting it to lowercase and
   * trimming any whitespace then adding it to a new array of the cleaned values
   * to be returned.
   *
   * @param {string[]} args
   *
   * @returns {string[]}
   */
  cleanArgs (args) {
    let newArgs = []
    args.forEach(val => newArgs.push(val.trim().toLowerCase()))
    return newArgs
  }

  /**
    * Gets a response from the author of the provided CommandMessage object by
    * ensuring their input fits the provided verify function. All input retrieved
    * from the user is passed through the function until a true value is returned.
    * When a true value is obtained, the response is returned via a Promise. If the
    * command times out then undefined is returned via the Promise instead.
    *
    * @param {CommandMessage} msg The message object used to retrieve responses
    * @param {Function} verify The function used to verify the user input is valid
    * @param {String} userId The id of the user you want a response from
    * @param {String} [invalidInput] The optional message to send in the event a user provides invalid input
    *
    * @returns {Promise<String>|Promise<undefined>} The response or undefined via a Promise
    *
    * @example // Obtain a number 0 through 9
    * getResponse(msg, val => { return val >= 0 && val < 10 })
    *  .then(res => console.log(`Number 0 - 9 = ${res}`))
    *
    * @example // See if the user requies help
    * getResponse(msg, val => { return val.toLocaleLowerCase() = 'help' })
    *   .then(res => console.log('User requires help.'))
    */
  static getResponse (msg, verify, userId, invalidInput = undefined) {
    return new Promise((resolve, reject) => {
      if (userId === undefined) {
        var coll = msg.channel.createMessageCollector(m =>
          m.author.id === msg.author.id && m.channel.id === msg.channel.id, { time: 60000 }
        )
      } else {
        coll = msg.channel.createMessageCollector(m =>
          m.member.id === userId && m.channel.id === msg.channel.id, { time: 60000 }
        )
      }

      coll.on('collect', (m, c) => {
        if (verify(m.content)) {
          resolve(m.content)
          coll.stop()
        } else if (invalidInput !== undefined) m.channel.send(invalidInput)
      })

      coll.on('end', (c, r) => {
        if (r === 'time' || r === 'user') resolve(undefined)
        else reject(new Error(r))
      })
    })
  }

  /**
   * Sends the provided content to the provided channel. The author field is
   * required for verifying the author (almost always Tron) has the necessary
   * permissions to send messages in that channel. The options field accepts
   * the options needed to send a MessageEmbed or MessageAttachment. You can
   * get more information from the Discord.js docs.
   *
   * @see https://discord.js.org/#/docs/main/master/class/TextChannel?scrollTo=send
   *
   * @param {TextChannel|DMChannel} channel
   * @param {string} content
   * @param {User} author
   * @param {MessageEmbed|MessageAttachment} [options]
   *
   * @returns {Promise<Message>|Promise<string>}
   */
  static async sendMessage (channel, content, author, options = undefined) {
    try {
      if (!content && !options) return

      if (author !== undefined) {
        if (canSendMessage(channel, author)) return channel.send(content, options)
        else {
          let dmChannel = await author.createDM()
          return dmChannel.send('You are unable to send a message to this channel.')
        }
      } else return channel.send(content, options)
    } catch (err) {
      console.error(`An error has occured while attempting to send a message: ${err.message}`)
    }
  }
}

const canSendMessage = (channel, user) => {
  if (typeof channel.permissionsFor !== 'undefined') {
    return channel.permissionsFor(user).has('SEND_MESSAGES')
  } else {
    console.log(`permissionsFor === undefined and typeof channel = ${typeof channel}`)
    return true
  }
}

// Used for JSDocs
const {
  User,
  DMChannel,
  TextChannel,
  Message,
  MessageEmbed,
  MessageAttachment
} = require('discord.js')
