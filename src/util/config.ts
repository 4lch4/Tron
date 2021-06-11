export const BotConfig = {
  token: process.env.DISCORD_TOKEN,
  cmdClientOpts: {
    name: 'Tron',
    owner: '219270060936527873',
    prefix: '+',
    defaultCommandOptions: {
      cooldown: 1000,
      caseInsensitive: true,
      cooldownMessage:
        "You're sending too many commands! Please wait at least 1s between commands.",
      cooldownExclusions: {
        channelIDs: ['356240357534597122'],
        userIDs: ['219270060936527873']
      }
    },
    ignoreBots: true,
    ignoreSelf: true
  }
}
