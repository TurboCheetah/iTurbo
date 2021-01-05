const Command = require('../../structures/Command.js')

class ToggleChannel extends Command {
  constructor(...args) {
    super(...args, {
      description: 'Enables or disables the earning of points in a channel',
      aliases: ['togglepoints'],
      usage: 'togglechannel [channel]',
      userPermissions: ['MANAGE_GUILD'],
      guildOnly: true
    })
  }

  async run(ctx) {
    let channel = ctx.channel

    if (ctx.message.mentions.channels.size) channel = ctx.message.mentions.channels.first()

    const disabledChannels = ctx.guild.settings.disabledChannels || []

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
