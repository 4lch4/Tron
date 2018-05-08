[![Build Status](https://img.shields.io/travis/HF-Solutions/Tron.svg?style=flat-square)](https://travis-ci.org/HF-Solutions/Tron)
[![Standard-Js](https://img.shields.io/badge/code_style-standard-brightgreen.svg?style=flat-square)](https://standardjs.com/)
[![dependencies Status](https://img.shields.io/david/HF-Solutions/Tron.svg?style=flat-square)](https://david-dm.org/Paranoid-Devs/Tron)
[![devDependencies Status](https://img.shields.io/david/dev/HF-Solutions/Tron.svg?style=flat-square)](https://david-dm.org/HF-Solutions/Tron?type=dev)
[![GitHub license](https://img.shields.io/github/license/HF-Solutions/Tron.svg?style=flat-square)](https://github.com/HF-Solutions/Tron/blob/master/LICENSE)

[![ForTheBadge](https://forthebadge.com/images/badges/fuck-it-ship-it.svg)](https://forthebadge.com)

# Tron

## Purpose

Tron is a bot that is primarily used with Discord. It has a number of commands that make chatting a
bit more enjoyable. Such as `+hug`, `+kiss`, `+kick`, `+lick`, and much more that are listed in
the help command.

Tron is built using the Discord.js Commando library which greatly improves upon the previously
used Eris library. Mostly because it comes with a lot of built in tools to help make Tron more
versatile, whereas Eris is lightweight and requires you to expand on it.

## Installation

While Tron is mostly developed without other people installing it in mind, you shouldn't have too
much trouble running your own instance if your heart desires. There are a few things to consider
before cloning the repo, running `npm i -y; npm start`, and hoping for the best:

1. Set the environment variable for the Discord Token (**DISCORD\_KEY**).
   - I use a config.json combined with pm2.config.js in order to use [pm2](http://pm2.keymetrics.io/) effectively for separate builds of Tron. 
   - You can refer to the [sample config.json](./util/config_sample.json) for further help.

1. If on Windows, refer to [this guide](https://github.com/Automattic/node-canvas/wiki/Installation---Windows) available on the [node-canvas](https://github.com/Automattic/node-canvas) repo, before installing all of the dependencies.

1. After completing the above, attempt to run `npm i` and if it installs everything successfully, try `npm start`, which will run Tron in the development/beta environment.
    - If you want to run the production version, simply use `npm run start-prod`.