const TronTestingChannel = '356240357534597122'
const MyUserId = '219270060936527873'

export const BotConfig = {
  token: process.env.DISCORD_TOKEN,
  homeChannel: TronTestingChannel,
  cmdClientOpts: {
    name: 'Tron',
    owner: MyUserId,
    prefix: '+',
    defaultCommandOptions: {
      cooldown: 1000,
      caseInsensitive: true,
      cooldownMessage:
        "You're sending too many commands! Please wait at least 1s between commands.",
      cooldownExclusions: {
        channelIDs: [TronTestingChannel],
        userIDs: [MyUserId]
      }
    },
    ignoreBots: true,
    ignoreSelf: true
  }
}
