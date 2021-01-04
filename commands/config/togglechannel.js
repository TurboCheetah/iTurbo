const Command = require('../../structures/Command.js')

class ToggleChannel extends Command {
  constructor(...args) {
    super(...args, {
      description: 'Enables or disables a channel for the earning points',
      usage: 'togglechannel <channel>',
      userPermissions: ['MANAGE_GUILD'],
      guildOnly: true
    })
  }

  async run(ctx) {
    if (!ctx.message.mentions.channels.size) return ctx.reply(`${this.client.constants.error} Invalid action!\nCorrect usage: ${this.usage}`)

    const disabledChannels = ctx.guild.settings.disabledChannels || []
    const channel = ctx.message.mentions.channels.first()

    if (disabledChannels.includes(channel.id)) {
      disabledChannels.splice(channel.id.indexOf(disabledChannels, 1))
      await ctx.guild.update({ disabledChannels })
      return ctx.reply(`${this.client.constants.success} Users talking in ${channel} will earn points.`)
    }

    disabledChannels.push(channel.id)
    await ctx.guild.update({ disabledChannels })
    return ctx.reply(`${this.client.constants.success} Users talking in ${channel} will no longer earn points.`)
  }
}

module.exports = ToggleChannel
