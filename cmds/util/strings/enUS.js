/**
 * This object contains all of the strings necessary for the Poll command in
 * English (US).
 */
module.exports.polls = {
  /**
   * The message sent before attempting to collect the question/message that
   * users will be voting on in the new poll.
   */
  getPollMsg: 'What is the question or message of this poll?',

  /**
   * The message sent before attempting to collect the timing type for the new
   * poll. It also provides information on the four options: Start (0), End (1),
   * Both (2), or Neither (3).
   */
  getTimingType: 'Is there a specific time you would like this poll to start `(0)`, end `(1)`, both `(2)`, or neither `(3)`?\n\n' +
  '- **Start Only `(0)`** = The poll will start at the specified start time but will be open until deleted or manually closed by the person who created the poll.\n' +
  '- **End Only `(1)`** = The poll will start after the necessary information is acquired and will be open until the specified end time, at which point no more votes will be accepted.\n' +
  '- **Both `(2)`** = The poll will start and end at the specified times.\n' +
  '- **Neither `(3)`** = The poll will start after the necessary information is acquired and will be open until deleted or manually closed by the person who created the poll.',

  /**
   * The message to send if a user provides an invalid timing type. Currently,
   * the only accepted values are 0 - 3, each of which represents a different
   * timing type:
   *
   * 0 - Start Time Only
   *
   * 1 - End Time Only
   *
   * 2 - Both Start and End Times
   *
   * 3 - Neither
   */
  invalidTimingType: 'Please choose between only a start time `(0), only an end time `(1)`, both a start and end time `(2)`, or neither `(3)`.',

  /** The response for when a user provides no arguments to the poll command. */
  noArgs: 'Please provide an action as well as the command. Such as `+poll vote` to vote in an existing poll.',

  /** The response for when a user provides an invalid date format. */
  invalidDateInput: 'Please provide the date in the following format: MM-dd-YY HH:mm (e.g. 04-20-18 16:20 for April 20, 2018 @ 04:20 PM)',

  /**
   * The message to send when asking for the input type of the poll. Do users
   * provide their own response (0) or is there a list of choices (1)? The
   * message is an array, so it's suggested to use this text with a call to join
   * like so: `.join('\n')`.
   */
  getInputType: [
    'How do users vote?',
    '```markdown',
    '0 - They provide their own responses to the poll question.',
    '1 - There is a list of choices that they can choose from for their vote.',
    '```'
  ],

  /** The response to send when the user provides an invalid input type. */
  invalidInputType: 'Please provide either a 0 or 1 where 0 means users provide their own responses, and 1 means you will provide a list of choices to vote on.'
}

module.exports.standard = {
  /** The default message to send when invalid input is provided to a collector. */
  invalidInput: 'The provided input is not valid, please try again.',

  /**
   * The default message to send when a message is under development and
   * unavailable to them.
   */
  underDevelopment: 'This command is currently under development and is not publicly available.'
}
