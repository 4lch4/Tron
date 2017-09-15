'use strict'

const download = require('image-downloader')
const Canvas = require('canvas')
const Tools = require('../util/Tools.js')
const Image = Canvas.Image
const tools = new Tools()
const fs = require('fs')

class Ship {
  constructor (options) {
    this.options = options || {}
  }

  /**
   * Parses the given URLs and returns an array of Canvas.Image objects.
   *
   * @param {string[]} urls
   * @param {(Image[])} callback
   */
  getShipImages (urls, callback) {
    this.getPngUrls(urls, (pngUrls) => {
      this.processUrls(pngUrls, (options) => {
        this.downloadImages(options, (filenames) => {
          filenames.splice(1, 0, '/var/tron/images/ship/heart.png')
          let imagesProcessed = 0
          let images = []

          filenames.forEach((filename, key, array) => {
            let image = new Image()
            image.src = fs.readFileSync(filename)
            images.push(image)

            imagesProcessed++

            if (imagesProcessed === 3) {
              callback(images)
            }
          })
        })
      })
    })
  }

  downloadImages (options, callback) {
    let processCount = 0
    let filenames = []

    options.forEach((option, key, array) => {
      if (!fs.existsSync(option.dest)) {
        download.image(option).then(({
          filename,
          image
        }) => {
          processCount++
          filenames.push(filename)

          if (processCount === array.length) {
            callback(filenames)
          }
        })
      } else {
        processCount++
        filenames.push(option.dest)

        if (processCount === array.length) {
          callback(filenames)
        }
      }
    })
  }

  processUrls (urls, callback) {
    let options = []

    for (let i = 0; i < urls.length; i++) {
      let url = urls[i]
      let start = url.lastIndexOf('/') + 1
      let end = url.lastIndexOf('?')
      let filename = ''

      if (end === -1) {
        filename = url.substring(start)
      } else {
        filename = url.substring(start, end)
      }

      options.push({
        url: url,
        dest: '/var/tron/images/ship/' + filename
      })
    }

    callback(options)
  }

  getPngUrls (urls, callback) {
    let pngUrls = []

    for (let i = 0; i < 2; i++) {
      let url = urls[i]

      if (url.endsWith('.jpg?size=128')) {
        url = url.substring(0, url.lastIndexOf('.jpg')) + '.png?size=128'
        pngUrls[i] = url
      } else {
        pngUrls[i] = url
      }
    }

    callback(pngUrls)
  }

  getShipName (msg, callback) {
    let usernames = [
      msg.mentions[0].username,
      msg.mentions[1].username
    ]

    let limit0 = tools.getRandom(0, usernames[0].length)
    let limit1 = tools.getRandom(0, usernames[1].length)
    let firstChoice = tools.getRandom(0, 1)
    let start = tools.getRandom(0, 1)
    let shipName = ''

    switch (firstChoice) {
      case 0:
        switch (start) {
          case 0:
            shipName = usernames[0].substring(limit0) + usernames[1].substring(limit1)
            break
          case 1:
            shipName = usernames[0].substring(limit1) + usernames[1].substring(limit0)
            break
        }
        break
      case 1:
        switch (start) {
          case 0:
            shipName = usernames[1].substring(limit0) + usernames[0].substring(limit1)
            break
          case 1:
            shipName = usernames[1].substring(limit1) + usernames[0].substring(limit0)
            break
        }
        break
    }

    callback(tools.upperFirstC(
      shipName.replace(/^\W/gi, '')
    ))
  }
}

module.exports = Ship
