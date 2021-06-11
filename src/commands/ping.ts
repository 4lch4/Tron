import { Message, MessageContent } from 'eris'
import { BaseCommand } from '../lib'

export class Ping extends BaseCommand {
  constructor() {
    super('ping', {
      aliases: ['pang'],
      caseInsensitive: true
    })
  }

  async execute(_msg: Message, _args: string[]): Promise<MessageContent> {
    return 'Pong!'
  }
}
