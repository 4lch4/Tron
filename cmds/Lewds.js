const Tools = require('../util/Tools')
const tools = new Tools()

const IOTools = require('../util/IOTools')
const ioTools = new IOTools()

const download = require('image-downloader')

/** Stores the links on obutts.ru that are available for download */
let buttLinks = {}

/**
 *  Provides functions for retrieving various images of the Lewd variety. Upon creation, it's used
 * for retrieving a list of URL's to download butt jpg's and png's so that Tron can send it to
 * another user upon receiving the +newd command. Ideally, I'd like to give this class many more
 * features down the road, I'm just not sure where to start yet.
 */
class Lewds {
  constructor (options) {
    this.options = options || {}
  }

  /**
   * Standard function to get the content of a Butt image for +newd command. If this is the first
   * time the function is called, /var/tron/ButtImages.txt is parsed and all the links available
   * there are added to an array that's split by the \n character.
   *
   * A random number is generated between 0 and the amount of links available and one is picked.
   * The image is downloaded and then the content and filename is returned through the provided
   * callback.
   *
   * @param {*} callback
   */
  getButt (callback) {
    if (buttLinks.length === undefined) {
      ioTools.readFile('/var/tron/ButtImages.txt', (file) => {
        buttLinks = file.split('\n')

        let random = tools.getRandom(0, buttLinks.length)

        this.getRandomButt(random, (butt, filename) => {
          callback(butt, filename)
        })
      })
    } else {
      this.getRandomButt(tools.getRandom(0, buttLinks.length), (butt, filename) => {
        callback(butt, filename)
      })
    }
  }

  /**
   *  Using the provided "random" integer, getRandomButt() downloads the image at
   * buttlinks[random] and then passes the filename and content back through the callback. If
   * there are any errors, they are thrown here using a simple catch → throw.
   *
   * @param {int} random
   * @param {*} callback
   */
  getRandomButt (random, callback) {
    let buttLink = buttLinks[random]
    let shortFilename = buttLink.substring(buttLink.lastIndexOf('/') + 1)

    download.image({
      url: buttLink,
      dest: '/var/tron/images/butts/' + shortFilename
    }).then(({
      filename,
      image
    }) => {
      callback(image, shortFilename)
    }).catch((err) => {
      throw err
    })
  }
}

module.exports = Lewds
