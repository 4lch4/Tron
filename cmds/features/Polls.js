const Command = require('../BaseCmd')
const Survey = require('survaid')
const Strings = require('../util/Strings').enUS
const { isBetaTester } = require('../util/Config')
const {
  actions,
  getPollMsg,
  getInputType,
  getVoteChoices,
  determineAction,
  getUserVoteCount
} = require('../util/Polls')

class Poll extends Command {
  constructor (client) {
    super(client, {
      name: 'poll',
      group: 'features',
      memberName: 'poll',
      throttling: { usages: 1, duration: 10 },
      description: 'Allows you to create your own polls or vote in existing ones.',
      guildOnly: false,
      aliases: ['polls', 'survey', 'surveys'],
      argsType: 'multiple'
    })
  }

  /**
   * Steps to get a proper poll setup:
   *
   * 1) Get responses to the needed fields:
   *  - Title/Label/Question
   *  - Start Time of Poll
   *  - End Time of Poll
   *  - Is any input allowed or are there prefilled options?
   *    - If there are options to choose from, get the options
   *  - Can users vote more than once?
   * 2) Store that data and announce the poll is available.
   * 3) Enable other users to vote on the survey if they're in the same server.
   *
   * @param {Message} msg
   * @param {String[]} [args]
   *
   * @returns {Promise<Message>}
   */
  async run (msg, args) {
    if (isBetaTester(msg.author.id)) {
      switch (args.length) {
        case 0: return msg.reply(Strings.polls.noArgs)
        case 1: return handleSingleArg(msg, args)
      }
    } else return msg.reply(Strings.standard.underDevelopment)
  }
}

/**
 * Handles when a user only provides one argument. Such as +polls vote or
 * +polls create.
 *
 * @param {Message} msg The message object sent to run the command.
 * @param {String[]} args The arguments provided to the command.
 */
const handleSingleArg = async (msg, args) => {
  // const timezone = await getCorrectTimezone(msg, convertRegionToTimezone(msg.guild.region))
  // console.log(`timezone = `)
  // console.log(timezone)
  switch (determineAction(args)) {
    case actions.create: {
      // Get the necessary fields from the user and create a poll
      // Start with the poll question/message
      const question = await getPollMsg(msg)

      if (question !== undefined) {
        const inputType = await getInputType(msg)

        if (inputType === undefined) break
        else if (inputType === 1) {
          // The poll creator will provide a list of options for users to vote on.
          var voteChoices = await getVoteChoices(msg)
          if (voteChoices === undefined) break
        }

        let voteCount = await getUserVoteCount(msg)
        if (voteCount === undefined) break
        else {
          let survey = new Survey({
            label: question,
            anyInput: getAnyInput(inputType),
            values: voteChoices
          })
          survey.values.forEach((val, key) => console.log(`Val = ${val}; key = ${key}`))
          // msg.reply(`Question = ${question}`)
          // msg.reply(`InputType = ${inputType}`)
          // msg.reply(`User vote count = ${voteCount}`)
          // if (voteChoices !== undefined) voteChoices.forEach(choice => msg.reply(`A vote choice = ${choice}`))
        }
      }

      break
    }

    case actions.vote: {
      // Get the survey they want to vote on and what they wanted to vote
      break
    }

    case actions.list: {
      // List the available surveys on the given server
      break
    }
  }
}

const getAnyInput = inputType => {
  if (inputType === 0) return true
  else return false
}

module.exports = Poll
const Message = require('discord.js').Message // Used for JSDocs
