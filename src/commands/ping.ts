import { GeneratorFunctionReturn, Message, CommandGenerator } from 'eris'
import { BaseCommand } from '../util'

export class Ping extends BaseCommand {
  constructor() {
    super(
      'ping',
      {
        aliases: ['pang'],
        caseInsensitive: true
      }
    )
  }

  execute(msg: Message, args: string[]): void {
    
  }
}

export async function ping(_msg: Message): Promise<GeneratorFunctionReturn> {
  return 'Pong!'
}