/*
 * Co-Authored-By: dirigeants (https://github.com/dirigeants)
 * Co-Authored-By: Ravy <ravy@aero.bot> (https://ravy.pink)
 * Co-Authored-By: Turbo (https://turbo.ooo)
 * License: MIT License
 * Credit example: Copyright (c) 2019 dirigeants, MIT License
 */

const Command = require('../../structures/Command.js')
const { inspect } = require('util')
const c = require('@aero/centra')
const { MessageEmbed } = require('discord.js')
const Stopwatch = require('../../utils/Stopwatch.js')

class Eval extends Command {
  constructor(...args) {
    super(...args, {
      description: 'Evaluates arbitrary JavaScript',
      ownerOnly: true,
      hidden: true,
      usage: 'eval <code>',
      aliases: ['ev']
    })
  }

  async eval(ctx, code) {
    code = code.replace(/[“”]/g, '"').replace(/[‘’]/g, "'")
    const stopwatch = new Stopwatch()
    let success, syncTime, asyncTime, result
    let thenable = false
    const token = ctx.client.token.split('').join('[^]{0,2}')
    const rev = ctx.client.token.split('').reverse().join('[^]{0,2}')
    const filter = new RegExp(`${token}|${rev}`, 'g')

    try {
      if (ctx.flags.async) code = `(async () => {\n${code}\n})()`
      // eslint-disable-next-line no-eval
      result = eval(code)
      syncTime = stopwatch.toString()
      if (this.client.utils.isThenable(result)) {
        thenable = true
        stopwatch.restart()
        result = await result
        asyncTime = stopwatch.toString()
      }
      success = true
    } catch (error) {
      if (!syncTime) syncTime = stopwatch.toString()
      if (thenable && !asyncTime) asyncTime = stopwatch.toString()
      result = error
      success = false
    }

    stopwatch.stop()
    if (typeof result !== 'string') {
      result = inspect(result, { depth: 0, maxArrayLength: null })
    }

    result = result.replace(filter, '[TOKEN]')
    return { success, time: this.formatTime(syncTime, asyncTime), result: this.clean(result) }
  }

  formatTime(syncTime, asyncTime) {
    return asyncTime ? `⏱ ${asyncTime}<${syncTime}>` : `⏱ ${syncTime}`
  }

  clean(text) {
    return text.replace(/`/g, '`' + String.fromCharCode(8203)).replace(/@/g, '@' + String.fromCharCode(8203))
  }

  async run(ctx, args) {
    if (!args.length) return ctx.reply('You need to give me code to evaluate.')

    const { code } = this.client.utils.getCodeBlock(ctx.rawArgs.replace(/--(async) /gi, ''))
    const { success, result, time } = await this.eval(ctx, code)
    if (result.length < 1950) {
      const embed = new MessageEmbed()
        .setColor(success ? this.client.constants.success : this.client.constants.error)
        .setTitle(success ? 'Success' : 'Error')
        .addField('Output', `\`\`\`js\n${result}\n\`\`\``)
        .setFooter(`${time}`)
      return ctx.reply({ embed })
    } else {
      try {
        const { key } = await c('https://haste.turbo.ooo/documents', 'POST').body(result).json()
        return ctx.reply(`Output was to long so it was uploaded to hastebin https://haste.turbo.ooo/${key}.js `)
      } catch (error) {
        return ctx.reply(`I tried to upload the output to hastebin but encountered this error ${error.name}:${error.message}`)
      }
    }
  }
}

module.exports = Eval
