const settings = require('./local.settings.json')

module.exports = {
  apps: [
    {
      name: 'Tron',
      script: './dist/Tron.js',
      watch: true,
      env: {
        PORT: 3030,
        NODE_ENV: 'development',
        DISCORD_TOKEN: settings.discordToken,
        COMMAND_PREFIX: settings.commandPrefix,
        OWNER_ID: settings.ownerId,
        GIPHY_TOKEN: settings.giphyToken
      }
    },
    {
      name: 'Transpiler',
      script: 'tsc --watch',
      watch: false
    }
  ]
}
