const Command = require('../BaseCmd')

module.exports = class Emotes extends Command {
  constructor (client) {
    super(client, {
      name: 'emotes',
      group: 'admin',
      memberName: 'emotes',
      description: 'Displays all of the emotes available on the server.',
      examples: ['+emotes', '+emotes animated', '+emotes still'],
      guildOnly: true,
      args: [{
        key: 'type',
        default: 'all',
        prompt: 'What type of emotes would you like to display?',
        validate: val => {
          if (val === 'all' || val === 'animated' || val === 'still') return true
          else return 'Please provide a valid emote type (`animated`, `still`, or `all`).'
        },
        parse: val => val.toLowerCase()
      }]
    })
  }

  async run (msg, { type }) {
    if (msg.guild.available) {
      let output = []

      switch (type) {
        case 'still':
          output.push('**Standard Emotes:**')
          output.push(`${(await getStillEmotes(msg.guild)).join(' ')}\n`)
          break

        case 'animated':
          output.push('**Animated Emotes (Requires Discord Nitro):**')
          output.push(`${(await getAnimatedEmotes(msg.guild)).join(' ')}\n`)
          break

        case 'all':
          output.push('**Standard Emotes:**')
          output.push(`${(await getStillEmotes(msg.guild)).join(' ')}\n`)
          output.push('**Animated Emotes (Requires Discord Nitro):**')
          output.push(`${(await getAnimatedEmotes(msg.guild)).join(' ')}\n`)
          break
      }

      if (output.join('\n').length < 2000) return msg.channel.send(output.join('\n'))
      else {
        msg.channel.send(`${output[0]}\n${output[1]}`)
        return msg.channel.send(`${output[2]}\n${output[3]}`)
      }
    } else return msg.reply('unfortunately the Discord server is unable to be searched for emoji at this time. Please try again later.')
  }
}

/**
 * Gets all animated emoji from the given guild and returns it as an array of
 * GuildEmoji objects.
 *
 * @param {Guild} guild The guild you wish to get the emoji from.
 *
 * @returns {GuildEmoji[]} An array of GuildEmoji objects.
 */
const getAnimatedEmotes = async guild => {
  let animatedEmoji = []

  guild.emojis.each(emoji => { if (emoji.animated) animatedEmoji.push(emoji) })

  return animatedEmoji
}

/**
 * Gets all still/non-animated emoji from the given guild and returns it as an
 * array of GuildEmoji objects.
 *
 * @param {Guild} guild The guild you wish to get the emoji from.
 *
 * @returns {GuildEmoji[]} An array of GuildEmoji objects.
 */
const getStillEmotes = async guild => {
  let stillEmoji = []

  guild.emojis.each(emoji => { if (!emoji.animated) stillEmoji.push(emoji) })

  return stillEmoji
}
