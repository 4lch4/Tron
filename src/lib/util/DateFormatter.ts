import dayjs from 'dayjs'

export class DateFormatter {
  get logDate(): string {
    return dayjs().format('YYYY-MM-DDTHH:mm:ssZ[Z]')
  }
}
