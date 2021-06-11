export * from '../BaseCommand'
export * from './bot'
export * from './config'
export * from './DateFormatter'
export * from './giphy'
export * from './logger'

/**
 * Generates a random number between the min (inclusive) and max (exclusive).
 *
 * @param min The minimum number to generate.
 * @param max The maximum number to generate.
 */
export function getRandomNumber(min: number, max: number) {
  return Math.floor(Math.random() * (max - min) + min)
}
