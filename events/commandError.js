const Event = require('../structures/Event.js')
const { MessageEmbed } = require('discord.js')

class CommandError extends Event {
  async run(ctx, err) {
    // Allow `throw "Error message"` to rewind stack and reply from nested calls from a command.
    if (typeof err === 'string') return ctx.reply(err)
    console.log(`[COMMAND] ${ctx.command.name}: ${err.stack || err}`)
    if (this.client.sentry) {
      this.client.sentry.setContext('info', {
        user: ctx.author.tag,
        guild: ctx.guild ? ctx.guild.name : 'DM',
        command: ctx.command.name,
        usage: ctx.parsedContent
      })
      this.client.sentry.captureException(err)
    }
    await ctx.reply(`${this.client.constants.error} Uh! Something went wrong unexpectedly!${ctx.author.id !== this.client.constants.ownerID ? " Don't worry my master will keep track of the problem and fix it soon." : ''}`)
    const channel = this.client.channels.cache.get('735638949770559569')
    if (!channel) return
    const embed = new MessageEmbed()
      .setTitle('Command Error')
      .setColor(0x9590ee)
      .setDescription(`An Error occured in command: ${ctx.command.name}\n\`\`\`js\n${err.stack || err}\`\`\``)
      .setFooter(`User: ${ctx.author.tag}, Guild: ${ctx.guild ? ctx.guild.name : 'DM'}`)
    return channel.send({ embed })
  }
}

module.exports = CommandError
