import { bgYellow, yellow, bgGreenBright, greenBright, bgRed, red } from 'chalk'
import dayjs from 'dayjs'

export class Logger {
  constructor(env: string) {
    if (env === 'development') Logger.warn('Bot started in development mode')
  }

  public static warn(text: string): void {
    return console.log(`${bgYellow.gray(dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss'))} ${yellow(text)}`)
  }

  public static success(text: string): void {
    return console.log(`${bgGreenBright.gray(dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss'))} ${greenBright(text)}`)
  }

  public staticerror(text: string | Error): void {
    return console.log(`${bgRed.white(dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss'))} ${red(text)}`)
  }

  public static critical(text: string): never {
    console.log(`${bgRed.white(dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss'))} ${red(text)}`)
    return process.exit(-1)
  }
}
