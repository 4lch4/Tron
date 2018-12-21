const Command = require('../BaseCmd')
const Strings = require('./Strings').enUS

/**
 * Contains the possible actions that can be performed by the Poll(s) command.
 */
const actions = {
  /** Indicates a user wishes to create a poll. */
  create: 'create',

  /** Indicates a user wishes to vote in an existing poll. */
  vote: 'vote',

  /** Indicates a user wishes to see the polls on their server. */
  list: 'list'
}

/**
 *
 * @param {String[]} args
 */
const determineAction = args => {
  switch (args[0].toLowerCase()) {
    case actions.create: return actions.create
    case actions.list: return actions.list
    case actions.vote: return actions.vote

    default: return undefined
  }
}

/**
 * Get the question/message for the poll and return it via a Promise.
 *
 * @param {Message} msg The original message that called the command.
 *
 * @returns {Promise<String>|Promise<undefined>} The response from the user wrapped in a Promise.
 */
const getPollMsg = async msg => {
  // Send the message requesting the question/message.
  await msg.reply(Strings.polls.getPollMsg)

  // Return the response from the user.
  return Command.getResponse(msg, val => val.length > 0, msg.author.id)
}

/**
 * Get the user vote count, or how many times a user is allowed to vote in the
 * given poll.
 *
 * @param {Message} msg The original message that called the command.
 *
 * @returns {Promise<String>|Promise<undefined>} The response from the user wrapped in a Promise.
 */
const getUserVoteCount = async msg => {
  // Send the message requesting the vote count.
  await msg.reply('How many times would you like users to be able to vote? You can enter any number equal to or greater than 1, or 0 if you wish for them to have unlimited votes.')

  let response = await Command.getResponse(msg, val => parseInt(val) >= 0, msg.author.id, 'Please provide a valid number. It can be any number equal to or greater than 0, where 0 means unlimited votes.')

  // Return the response from the user.
  return parseInt(response)
}

/**
 * Get the input type, or how users are to vote in the given poll.
 *
 * 0 = The user provides their own responses to the poll question.
 * 1 = The user is given a list of choices to choose from for their vote.
 *
 * @param {Message} msg The original message that called the command.
 *
 * @returns {Promise<String>|Promise<undefined>} The response from the user wrapped in a Promise.
 */
const getInputType = async msg => {
  // Send the message requesting the input type.
  await msg.reply(Strings.polls.getInputType.join('\n'))

  let response = await Command.getResponse(msg, val => parseInt(val) === 0 || parseInt(val) === 1, msg.author.id, Strings.polls.invalidInputType)

  // Return the response from the user.
  return parseInt(response)
}

/**
 * Gets the choices available to users who wish to vote. Instead of a user
 * providing their own input for the vote, they have to choose from this list.
 *
 * @param {Message} msg The original message that called the command.
 *
 * @returns {Promise<String[]>|Promise<undefined>} The response from the user wrapped in a Promise.
 */
const getVoteChoices = async msg => {
  // Send the message requesting the vote choices.
  await msg.reply('What are the available options to vote on? Please input each choice on their own line. To insert a new line without sending the message, use `Shift + Enter`.')

  // Get the user response.
  let response = await Command.getResponse(msg, val => val.length > 0, msg.author.id, 'Please provide some text for the voting options. Each line is considered a different option, and you can use `Shift + Enter` to insert a new line without sending the message.')

  // Return the users response as an array.
  if (response === undefined) return undefined
  else return response.split('\n')
}

module.exports.actions = actions
module.exports.getPollMsg = getPollMsg
module.exports.getInputType = getInputType
module.exports.getVoteChoices = getVoteChoices
module.exports.determineAction = determineAction
module.exports.getUserVoteCount = getUserVoteCount

// #region Timezone/Timing Stuff
/** An enum for the various types of timing available. */
const timingTypes = {
  startOnly: 0,
  endOnly: 1,
  both: 2,
  neither: 3
}

/**
 * Gets the type of timing for the poll. Does it have a start or end time? Just
 * an end time? Just a start time?
 *
 * @param {Message} msg
 *
 * @returns {Promise<Number>|Promise<undefined>}
 */
const getTimingType = async msg => {
  await msg.reply(Strings.polls.getTimingType)
  return Command.getResponse(msg, val => val >= 0 && val <= 3, msg.author.id, Strings.polls.invalidTimingType)
}
const Timezones = require('../../data/Timezones.json')

const dateRegex = /[0-2][0-9]-[0-3][0-9]-[0-9][0-9] [0-2][0-9]:[0-6][0-9]/
const moment = require('moment-timezone')

/**
 * Gets both the start and end times for a poll. Validates the input using regex
 * and returns both of them via a Promise.
 *
 * @param {Message} msg The object of the message that was sent to run the command.
 *
 * @returns {BothTimes} The start and end times for the poll as an object.
 *
 * @see https://www.timeanddate.com/worldclock/converter.html?iso=20181018T150000&p1=1440
 */
const getBothTimes = async msg => {
  await msg.reply('what is the date and time when the poll should open? (MM-dd-yy HH:mm e.g. 04-20-18 16:20)')
  let startTime = await Command.getResponse(msg, val => dateRegex.test(val), msg.author.id, Strings.polls.invalidDateInput)

  if (startTime !== undefined) {
    await msg.reply('what is the date and time when the poll should close? (MM-dd-yy HH:mm e.g. 04-21-18 16:20)')
    let endTime = await Command.getResponse(msg, val => dateRegex.test(val), msg.author.id, Strings.polls.invalidDateInput)

    return {
      startTime: startTime,
      endTime: endTime
    }
  } else return undefined
}

const getCorrectTimezone = async (msg, timezone) => {
  const reply = `what is the timezone this poll will be hosted in? Our current best guess is "**${timezone.abbr}**".\n\n` +
                `If this is incorrect, please provide the correct timezone. Otherwise, simply reply with "correct".\n\n` +
                `If you're unsure what your timezone is, you can visit https://www.timeanddate.com/worldclock/converter.html \nInput your city name and it will show you **UTC** -/+ a number, the - or + and the number is your offset (e.g. **-7** for PDT/West Coast USA).`

  // const offsetRegex = /[+|-]?[0-9]?[0-4]?$|correct/i

  /** @param {String} input */
  const validateTimezoneInput = input => {
    for (let x = 0; x < Timezones.length; x++) {
      if (getTimezone(input) !== undefined) return true
    }
  }

  await msg.reply(reply)
  let response = await Command.getResponse(msg, val => validateTimezoneInput(val), msg.author.id, "Please provide a valid timezone. If you're unsure, please visit https://www.timeanddate.com/worldclock/converter.html.")
  return getTimezone(response)
}

const getTimezone = input => {
  for (let x = 0; x < Timezones.length; x++) {
    let tz = Timezones[x]
    if (tz.offset === input || tz.label === input || tz.abbr === input) return tz
  }

  return undefined
}

/**
 * A collection of Discord regions and their assumed timezone with a Markdown
 * formatted label for display and UTC offset for conversion purposes.
 */
const regions = {
  'eu-central': {
    offset: '+2',
    label: '**CEST** (UTC +2)'
  },
  'london': {
    offset: '+1',
    label: '**BST** (UTC +1)'
  },
  'amsterdam': {
    offset: '+2',
    label: '**CEST** (UTC +2)'
  },
  'japan': {
    offset: '+9',
    label: '**JST** (UTC +9)'
  },
  'brazil': {
    offset: '-3',
    label: '**BRT** (UTC -3)'
  },
  'us-west': {
    offset: '-7',
    label: '**PST** (UTC -7)'
  },
  'hongkong': {
    offset: '+8',
    label: '**HKT** (UTC +8)'
  },
  'southafrica': {
    offset: '+2',
    label: '**SAST** (UTC +2)'
  },
  'sydney': {
    offset: '+11',
    label: '**AEDT** (UTC +11)'
  },
  'singapore': {
    offset: '+8',
    label: '**SGT** (UTC +8)'
  },
  'us-central': {
    offset: '-5',
    label: '**CDT** (UTC -5)'
  },
  'eu-west': {
    offset: '+1',
    label: '**WEST** (UTC +1)'
  },
  'us-south': {
    offset: '-5',
    label: '**CDT** (UTC -5)'
  },
  'us-east': {
    offset: '-4',
    label: '**EDT** (UTC -4)'
  },
  'frankfurt': {
    offset: '+2',
    label: '**CEST** (UTC +2)'
  },
  'russia': {
    offset: '+3',
    label: '**MSK** (UTC +3)'
  }
}

/**
 * Converts the given region String to it's most likely timezone's UTC offset.
 *
 * @param {String} region The region String returned from Discord you wish to convert.
 *
 * @returns {Region}
 */
const convertRegionToTimezone = region => {
  return regions[region]
}

/**
 * @typedef {Object} BothTimes
 * @property {String} startTime The date & time when the poll will open.
 * @property {String} endTime The date & time when the poll will close.
 */

/**
 * @typedef {Object} Region
 * @prop {String} offset The UTC offset of the regions timezone.
 * @prop {String} label The Markdown formatted label of the timezone.
 */
// #endregion Timezone/Timing Stuff
