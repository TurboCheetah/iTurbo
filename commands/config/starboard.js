const Command = require('#structures/Command')

class Starboard extends Command {
  constructor(...args) {
    super(...args, {
      description: 'Configure the server starboard.',
      extendedHelp: 'The starboard is a channel where when users add a star reaction to messages it will be posted there. It is used to highlight funny/embarrassing/dumb moments and such. You can set a limit to avoid messages below the limit to be posted in the starboard channel.',
      usage: 'starboard limit <amount> | enable <#channel> | disable',
      userPermissions: ['MANAGE_GUILD'],
      guildOnly: true
    })
  }

  async run(ctx, [action, amount]) {
    if (!action) return ctx.reply('Specify one of `enable #channel`, `disable` or `limit <amount>`')

    if (action === 'disable') {
      await ctx.guild.update({ starboard: null })
      return ctx.reply(`${this.client.constants.emojis.success} Successfully disabled the server starboard.`)
    }

    if (action === 'enable') {
      if (!ctx.message.mentions.channels.size) return ctx.reply('Specify the channel you want to enable it on.')
      const channel = ctx.message.mentions.channels.first()
      await ctx.guild.update({ starboard: channel.id })
      return ctx.reply(`${this.client.constants.emojis.success} Successfully enabled the server starboard for the channel ${channel}`)
    }

    if (action === 'limit') {
      amount = this.verifyInt(amount)
      if (amount < 1) return ctx.reply('Limit cannot be less than 1')
      if (amount > ctx.guild.memberCount) return ctx.reply('Limit cannot be more than the amount of members in the server.')
      await ctx.guild.update({ starboardLimit: amount })
      return ctx.reply(`${this.client.constants.emojis.success} Successfully updated the starboard star limit to ${amount}`)
    }

    return ctx.reply(`${this.client.constants.emojis.error} Invalid action. Specify one of \`enable #channel\`, \`disable\` or \`limit <amount>\``)
  }
}

module.exports = Starboard
