const { Command } = require('discord.js-commando')
const path = require('path')
const Canvas = require('canvas')
const ioTools = new (require('../../util/IOTools'))()
const tools = new (require('../../util/Tools'))()
const shuffle = require('shuffle-array')
const Image = Canvas.Image

async function getShipCanvas (images) {
  const finalCanvas = new Canvas((images.length * 128), 128)
  const ctx = finalCanvas.getContext('2d')

  for (let x = 0; x < images.length; x++) {
    ctx.drawImage(images[x], (x * 128), 0, 128, 128)
  }

  return Promise.resolve(finalCanvas)
}

async function getShipImages (urls) {
  const options = await processUrls(urls)
  const filenames = await getShipFilenames(options)
  let images = []

  for (let x = 0; x < filenames.length; x++) {
    let image = new Image()
    image.src = ioTools.readFileSync(filenames[x])
    images.push(image)
  }

  return Promise.resolve(images)
}

async function getShipFilenames (options) {
  let filenames = []

  for (let x = 0; x < options.length; x++) {
    const image = await ioTools.downloadImage(options[x])
    filenames.push(image.filename)
  }

  filenames.splice(1, 0, path.join(__dirname, '../../images/ship/heart.png'))

  return Promise.resolve(filenames)
}

async function processUrls (urls) {
  let options = []

  try {
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
        dest: path.join(__dirname, '../../images/ship/', filename)
      })
    }
  } catch (err) {
    return Promise.reject(err)
  }

  return Promise.resolve(options)
}

function getShipName (msg) {
  const user0 = msg.mentions.users.array()[0].username
  const user1 = msg.mentions.users.array()[1].username
  const combined = user0 + user1

  const shuffled = shuffle(combined.split(''))
  const randomLength = tools.getRandom(1, shuffled.length)
  const shipName = shuffled.toString().substring(0, randomLength)
  return Promise.resolve(`**${tools.upperFirstC(shipName.replace(/,/g, ''))}**`)
}

class Ship extends Command {
  constructor (client) {
    super(client, {
      name: 'ship',
      group: 'features',
      memberName: 'ship',
      throttling: { usages: 1, duration: 10 },
      description: 'Ships two users as a couple.',
      examples: ['+ship @Alcha#2621 @Aadio#1576'],
      args: [{
        key: 'user1',
        label: 'User 1',
        prompt: 'Who\'s the first person you wish to ship?',
        type: 'user'
      }, {
        key: 'user2',
        label: 'User 2',
        prompt: 'Who do you wish to ship the first person with?',
        type: 'user'
      }]
    })
  }

  async run (msg, { user1, user2 }) {
    const imgFormat = { format: 'png', size: 128 }
    const urls = [user1.displayAvatarURL(imgFormat), user2.displayAvatarURL(imgFormat)]

    getShipImages(urls).then(images => {
      getShipCanvas(images).then(canvas => {
        getShipName(msg).then(shipName => {
          const content = 'Lovely shipping!\nShip name: ' + shipName

          msg.channel.send(content, { files: [canvas.toBuffer()] })
        })
      })
    }).catch(err => console.error(err))
  }
}

module.exports = Ship
