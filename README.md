[![ForTheBadge](http://forthebadge.com/images/badges/does-not-contain-msg.svg)](https://forthebadge.com/)

[![Standard-Js](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com/)
[![David-dm](https://david-dm.org/Paranoid-Devs/Tron.svg)](https://david-dm.org/Paranoid-Devs/Tron)

[![Paranoid-Devs](https://discordapp.com/api/guilds/325504841541746688/embed.png)](https://discord.gg/JfskD5Q)

# Purpose

Tron is a bot that is primarily used with Discord. It has a number of commands that make chatting a
bit more enjoyable. Such as `+hug`, `+kiss`, `+kick`, `+lick`, and much more that are listed in
[commands](./Commands.md).

## Dependencies

The dependencies are all listed in the `package.json`. The easiest way to install all of the
dependencies is to clone the repository and run `npm install` which installs them all into a
`node_modules` folder.

## Installation

To install Tron, follow these steps:

1. Clone the repository to your machine:
    - `git clone https://github.com/Paranoid-Devs/Tron.git`
1. Next, we need to install the dependencies:
    - `npm install`
    - If you get an error for canvas, follow the steps it provides to resolve it.
1. After dependencies, we need a config.json so the bot can function.
    - Create a new file in the util folder: `./Tron/util/config.json`
    - Copy/Paste from [the template](./util/config_template.json) from the Github repository and
    fill in the empty fields. You'll need an API key from the following sites:
        - [Cleverbot API](https://www.cleverbot.com/api/)
        - [Battle.net API](https://dev.battle.net/)
        - [Tumblr API](https://www.tumblr.com/docs/en/api/v2)
        - [MyAnimeList Account](https://myanimelist.net/) - For
        [Popura](https://www.npmjs.com/package/popura)
    - Make sure to fill in all of the fields or remove the code that is related to that information.
1. After setting up the `config.json`, we are ready to launch! You can start the bot by using
    `npm start` which will execute the `scripts/start` portion of the `package.json`.
