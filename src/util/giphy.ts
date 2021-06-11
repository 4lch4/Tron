import GiphyAPI, { GIFObject } from 'giphy-api'

export class Giphy {
  private giphy: GiphyAPI.Giphy

  constructor() {
    if (process.env.GIPHY_TOKEN) {
      this.giphy = GiphyAPI(process.env.GIPHY_TOKEN)
    } else {
      throw new Error('No GIPHY_TOKEN environment variable found.')
    }
  }

  async searchGif(content: string): Promise<GIFObject[]> {
    const searchRes = await this.giphy.search(content.substring(1))

    return searchRes.data
  }
}
