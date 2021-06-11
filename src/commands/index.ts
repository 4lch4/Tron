import { Ping } from './ping'
export * from './unknown'

export function getCommands() {
  return [new Ping()]
}
