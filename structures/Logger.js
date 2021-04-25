const { bgYellow, yellow, bgGreenBright, greenBright, bgRed, red } = require('chalk')
const dayjs = require('dayjs')

class Logger {
  warn(text) {
    return console.log(`${bgYellow.gray(dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss'))} ${yellow(text)}`)
  }

  success(text) {
    return console.log(`${bgGreenBright.gray(dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss'))} ${greenBright(text)}`)
  }

  error(text) {
    return console.log(`${bgRed.white(dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss'))} ${red(text)}`)
  }

  critical(text) {
    console.log(`${bgRed.white(dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss'))} ${red(text)}`)
    return process.exit(-1)
  }
}

module.exports = Logger
