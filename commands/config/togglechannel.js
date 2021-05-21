const Command = require('#structures/Command')

class ToggleChannel extends Command {
  constructor(...args) {
    super(...args, {
      description: language => language.get('togglechannelDescription'),
      usage: language => language.get('togglechannelUsage'),
      aliases: ['togglepoints', 'disablechannel', 'enablechannel'],
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
      return ctx.successMsg(ctx.language.get('success'), ctx.language.get('togglechannelEnabled'))
    }

    disabledChannels.push(channel.id)
    await ctx.guild.update({ disabledChannels })
    return ctx.successMsg(ctx.language.get('success'), ctx.language.get('togglechannelDisabled'))
  }
}

module.exports = ToggleChannel
