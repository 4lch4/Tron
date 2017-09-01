const FeedParser = require('feedparser')
const request = require('request')

const parser = new FeedParser()

let feedName
let url

class RSSReader {
  constructor (options) {
    feedName = options.feedName
    url = options.url
  }

  parseFeed (callback) {
    let req = request(url)

    req.on('error', (err) => {
      console.log('error:', err)
    })

    req.on('response', (res) => {
      if (res.statusCode !== 200) {
        req.emit('Request error', new Error('Bad status code'))
      } else {
        req.pipe(parser)
      }
    })

    parser.on('error', (err) => {
      console.log('Parser error:', err)
    })

    parser.on('readable', () => {
      let item

      while (item === parser.read()) {
        this.parseItem(item, (comic) => {
          callback(comic)
        })
      }
    })
  }

  parseItem (item, callback) {
    callback(null, {
      feedName: feedName,
      title: item.title,
      description: item.description,
      url: item.link,
      date: item.date
    })
  }
}

module.exports = RSSReader
