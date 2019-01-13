const { Client, MessageEmbed } = require('discord.js') // Used for JSDoc/intellisense purposes

const moment = require('moment-timezone')
const GphApiClient = require('giphy-js-sdk-core')
const giphy = GphApiClient(process.env.GIPHY_KEY)
const DISCORD_EPOCH = 1420070400000
const Chance = require('chance')
const chance = new Chance()
const UTC = 'UTC'

const config = require('./config.json')
const { sendMessage } = require('../cmds/BaseCmd')

const { getImage } = require('./IOTools')

const colors = require('./colors')

const DEFAULT_DATE_FORMAT = 'MM.DD.Y @ HH:mm:ss'
const PRETTY_DATE_FORMAT = 'MM/DD/Y HH:mm:ss'

module.exports = class Tools {
  formatTime (format) {
    return moment.tz(UTC).format(format)
  }

  timestampFromSnowflake (snowflake) {
    return (snowflake / 4194304) + DISCORD_EPOCH
  }

  prettierUnixInput (input) {
    return moment(input).tz(UTC).format('MMMM Do, Y @ HH:mm:ss')
  }

  customFormatUnixInput (input, format) {
    return moment(input).tz(UTC).format(format)
  }

  formatUnixInput (input) {
    return moment(input).tz(UTC).format(PRETTY_DATE_FORMAT)
  }

  formatUTCTime (format) {
    return moment.tz(UTC).format(format)
  }

  pickImage (images) {
    if (this.containsData(images)) {
      let random = this.getRandom(0, images.length)
      if (images[random] === undefined) return this.pickImage(images)
    }
  }

  containsData (object) {
    return object !== null &&
          object !== undefined &&
          object.length !== 0
  }

  async queryGiphy (query, username, avatarUrl) {
    const queryStr = require('querystring')
    try {
      var results = await giphy.search('gifs', { 'q': queryStr.escape(query) })
      var random = this.getRandom(0, results.data.length)
      if (results.data[random] === undefined) return Promise.resolve(null)
      else var embedUrl = results.data[random].images.original.url

      return Promise.resolve(new MessageEmbed()
        .setAuthor(username, avatarUrl, 'http://tronbot.info')
        .setColor(colors.Decimal.deepPurple.P500)
        .setFooter('Powered by Giphy.', 'https://s3.amazonaws.com/ionic-marketplace/ionic-giphy/icon.png')
        .setImage(embedUrl)
      )
    } catch (err) { return Promise.reject(err) }
  }

  get shortLogDate () {
    return moment.tz(UTC).format('Y-MM-DD')
  }

  get shortUTCTime () {
    return moment.tz(UTC).format('HH:mm:ss.SS')
  }

  get formattedTime () {
    return moment.tz(UTC).format(DEFAULT_DATE_FORMAT)
  }

  get utcTime () {
    return moment.tz(UTC).format()
  }

  get formattedUTCTime () {
    return moment.tz(UTC).format(DEFAULT_DATE_FORMAT)
  }

  get safeFormattedTime () {
    return moment.tz(UTC).format('MM.DD.Y_HH:mm:ss')
  }

  upperFirstC (string) {
    let temp = string.toLowerCase()
    return temp.charAt(0).toUpperCase() + temp.slice(1)
  }

  numberWithCommas (num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }

  /**
   * Returns a random integer between the min (inclusive) and max (exclusive).
   *
   * @param {*} min
   * @param {*} max
   */
  getRandom (min, max) {
    if (min < max) {
      return chance.integer({
        min: min,
        max: (max - 1)
      })
    } else {
      return 0
    }
  }

  /**
   *
   * @param {string} message
   * @param {Client} client
   */
  sendOwnerMessage (message, client) {
    return client.users.get('219270060936527873').send(message)
  }

  /**
   * Sends the messages that should be sent to inform users/developers that Tron
   * is back online. As of writing this (2019/1/13), there are two messages sent.
   * One to my testing channel on the HassleFree Solutions Discord server, and
   * one to the info log.
   *
   * @param {client}
   */
  sendStartupMessages (client) {
    let readyTime = this.formattedUTCTime

    sendMessage(client.channels.get(config.notificationChannel), `<@219270060936527873>, Tron has come online > **${readyTime}**`, client.user)
    console.log(`Tron ${process.env.NODE_ENV.toUpperCase()} has come online > ${readyTime}`)
  }

  /**
   * Rotates the activity setting on Tron every 2 minutes (120,000ms) to a
   * random value  in config.activities. Ideally, I'd like to add information
   * such as  current number of guilds/users we support and add it to the list
   * of "activities" as well.
   *
   * When an update occurs, it is logged in the info log.
   *
   * @param {Number} interval Time between updates in minutes.
   * @param {client}
   */
  initRotatingActivity (interval, client) {
    const SECONDS_PER_MINUTE = 60000

    setInterval(function () {
      let activities = config.activities
      let random = this.getRandom(0, activities.length)
      let activity = activities[random]

      console.log(`Updating activity to ${activity}`, false)

      client.user.setActivity(activity)
    }, interval * SECONDS_PER_MINUTE)
  }

  /**
   * Searches the provided Message object for the string "alot". If it exists,
   * the 'alot.png' image is returned, to make a proper joke of it 😅
   *
   * @param {msg} msg The message object to search for the alot string.
   * @param {client} client The bot client.
   */
  searchForAlot (msg, client) {
    if (msg.content.toLowerCase().split(' ').includes('alot')) {
      getImage('alot.png').then(image => {
        sendMessage(msg.channel, '', client.user, { files: [image] })
      }).catch(console.error)
    }
  }
}
