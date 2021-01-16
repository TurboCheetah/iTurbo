/**
 * Command execution context.
 */
const { MessageEmbed } = require('discord.js')

class CommandContext {
  constructor(client, msg) {
    this.client = client
    this.message = msg

    // The following fields are initialized manually when a CommandContext is created.
    this.args = []
    this.flags = {}
    this.parsedContent = ''
    this.command = null
    this.invokedName = '' // The exact alias the user used to refer to the command.
    this.prefix = '|' // Prefix used to invoke the command.
  }

  /**
   * Gets the raw args.
   * By default it trims extra spaces and stuff.
   * This is useful for e.g code to preserve indents and all.
   */
  get rawArgs() {
    // Slice prefix + command name and trim the start/ending spaces.
    return this.message.content.slice(this.prefix.length + this.invokedName.length).trim()
  }

  get member() {
    return this.message.member
  }

  get channel() {
    return this.message.channel
  }

  get author() {
    return this.message.author
  }

  get guild() {
    return this.message.guild
  }

  reply(...args) {
    return this.channel.send(...args)
  }

  success() {
    return this.message.react(':success:779886882917449728').catch(err => {
      throw err
    })
  }

  failure() {
    return this.message.react(':error:779886874533560320').catch(err => {
      throw err
    })
  }

  random(arr, replace = {}) {
    let res = this.client.utils.random(arr)

    for (const [k, v] of Object.entries(replace)) {
      res = res.replace(new RegExp(`{{${k}}}`, 'g'), v)
    }

    return this.reply(res)
  }

  msgEmbed(text, icon = this.author.displayAvatarURL({ size: 512, dynamic: true })) {
    const embed = new MessageEmbed().setColor(0x9590ee).setAuthor(`| ${text}`, icon)
    return this.channel.send({ embed })
  }
}

module.exports = CommandContext
