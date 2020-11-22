const { promisify } = require('util')

const suffixes = ['Bytes', 'KB', 'MB', 'GB']

const { promises: { lstat, readdir } } = require('fs')
const path = require('path')

const { MessageEmbed } = require('discord.js')

/**
 * Static class with utilities used throughout the bot.
 */
class Utils {
  constructor () {
    throw new Error('Utils is a static class and cannot be instantiated.')
  }

  static toProperCase (str) {
    return str.replace(/([^\W_]+[^\s-]*) */g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase())
  }

  static random (arr) {
    return arr[Math.floor(Math.random() * arr.length)]
  }

  static getBytes (bytes) {
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return (!bytes && '0 Bytes') || `${(bytes / Math.pow(1024, i)).toFixed(2)} ${suffixes[i]}`
  }

  static escapeRegex (str) {
    return str.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')
  }

  // Convert milliseconds into human readable string.
  static getDuration (time) {
    const seconds = Math.floor(time / 1000) % 60
    const minutes = Math.floor((time / (1000 * 60)) % 60)
    const hours = Math.floor((time / (1000 * 60 * 60)) % 24)
    const days = Math.floor((time / (1000 * 60 * 60 * 24)) % 7)
    return [`${days} Days`, `${hours} Hours`, `${minutes} Minutes`,
      `${seconds} Seconds`].filter((time) => !time.startsWith('0')).join(', ')
  }

  // Tries to find an image from a message.
  static getImage (msg) {
    // First see if we have an attachment.
    const attach = msg.attachments.filter((x) => x.url && x.width && x.height)
    if (attach.size) return attach.first().url

    // Next see if we have an embed with an image.
    const imageEmbeds = msg.embeds.filter((x) => x.image && x.image.url)
    if (imageEmbeds.length) return imageEmbeds[0].image.url

    // Finally see if there is an image url.
    const urlEmbeds = msg.embeds.filter((x) => x.type === 'image' && x.url)
    if (urlEmbeds.length) return urlEmbeds[0].url

    // Ok found nothing.
    return null
  }

  static getCodeBlock (txt) {
    const match = /^```(\S*)\n?([^]*)\n?```$/.exec(txt)
    if (!match) return { lang: null, code: txt }
    if (match[1] && !match[2]) return { lang: null, code: match[1] }
    return { lang: match[1], code: match[2] }
  }

  // This piece of code is taken from fs-nextra by BDISTIN
  // MIT Licensed
  // I just didn't want to add a dependency I wouldn't use more than once.
  static async walk (dir, options = {}, results = new Map(), level = -1) {
    dir = path.resolve(dir)
    const stats = await lstat(dir)
    if (!options.filter || options.filter(stats, dir)) results.set(dir, stats)
    if (stats.isDirectory() && (typeof options.depthLimit === 'undefined' || level < options.depthLimit)) {
      await Promise.all((await readdir(dir)).map((part) => Utils.walk(path.join(dir, part), options, results, ++level)))
    }
    return results
  }

  static shorten (text, maxLen = 1024) {
    return text.length > maxLen ? `${text.substr(0, maxLen - 3)}...` : text
  }

  /**
 *
 * @param {*} ctx command context
 * @param {string} text prompt question
 * @param {array} yes positive response(s)
 * @param {array} no negative response(s)
 * @param {function} positiveFunction function that runs if response is positive
 * @param {function} negativeFunction function that runs if response is negative
 */

  static async prompt (ctx, text, yes, no, positiveFunction, negativeFunction) {
    const embed = new MessageEmbed()
      .setAuthor(ctx.author.username, ctx.author.displayAvatarURL({ size: 64 }))
      .setDescription(`${text}\n\nReply with \`cancel\` to cancel the operation. The message will timeout after 60 seconds.`)
      .setTimestamp()
      .setColor(0x9590EE)

    const filter = (msg) => msg.author.id === ctx.author.id
    const response = await ctx.message.awaitReply('', filter, 60000, embed)
    if (!response) return ctx.reply('No reply within 60 seconds. Time out.')

    if (yes.includes(response.toLowerCase())) {
      await positiveFunction()
    } else if (no.includes(response)) {
      await negativeFunction()
    } else if (['cancel'].includes(response)) {
      return ctx.reply('Operation cancelled.')
    } else {
      return ctx.reply('Invalid response, please try again.')
    }
  }
}

Utils.sleep = promisify(setTimeout)

module.exports = Utils
