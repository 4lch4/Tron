import { CommandClient, Message, PossiblyUncachedTextableChannel } from 'eris'
// import { writeJSON } from 'fs-extra'
import { getRandomNumber, Giphy } from '../util'

export async function unknown(
  tron: CommandClient,
  msg: Message<PossiblyUncachedTextableChannel>
): Promise<void> {
  if (!msg.command && msg.content.startsWith('+')) {
    const giphy = new Giphy()
    const gifData = await giphy.searchGif(msg.content)

    if (gifData.length === 0) {
      tron.createMessage(
        msg.channel.id,
        "Awww, it looks like there aren't any gifs with this search :("
      )
    } else {
      const randomNumber = getRandomNumber(0, gifData.length)
      const gif = gifData[randomNumber]

      tron.createMessage(msg.channel.id, gif.bitly_url)
    }
  }
}
