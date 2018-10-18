/**
 * This object contains all of the strings necessary for the Poll command in
 * English (US).
 */
module.exports.polls = {
  /**
   * The message sent before attempting to collect the question/message that
   * users will be voting on in the new poll.
   */
  getPollMsg: 'what is the question or message of this poll?',

  /**
   * The message sent before attempting to collect the timing type for the new
   * poll. It also provides information on the four options: Start (0), End (1),
   * Both (2), or Neither (3).
   */
  getTimingType: 'is there a specific time you would like this poll to start `(0)`, end `(1)`, both `(2)`, or neither `(3)`?\n\n' +
  '- **Start Only `(0)`** = The poll will start at the specified start time but will be open until deleted or manually closed by the person who created the poll.' +
  '- **End Only `(1)`** = The poll will start after the necessary information is acquired and will be open until the specified end time, at which point no more votes will be accepted.' +
  '- **Both `(2)`** = The poll will start and end at the specified times.' +
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
  noArgs: 'please provide an action as well as the command. Such as `+poll vote` to vote in an existing poll.'
}

module.exports.standard = {
  /** The default message to send when invalid input is provided to a collector. */
  invalidInput: 'The provided input is not valid, please try again.'
}
