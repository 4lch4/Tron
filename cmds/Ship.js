const download = require('image-downloader')
const Canvas = require('canvas')
const Tools = require('../util/Tools.js')
const shuffle = require('shuffle-array')
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
          filenames.splice(1, 0, '/home/alcha/tron/images/ship/heart.png')
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
        dest: '/home/alcha/tron/images/ship/' + filename
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
    const combined = msg.mentions[0].username + msg.mentions[1].username
    const shuffled = shuffle(combined.split(''))
    const randomLength = tools.getRandom(1, shuffled.length)
    const shipName = shuffled.toString().substring(0, randomLength)
    console.log('shipName = ' + shipName)
    callback(tools.upperFirstC(shipName.replace(/,/g, '')))
    shipName.replace()
  }
}

module.exports = Ship
