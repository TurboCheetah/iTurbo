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
    switch (action) {
      case 'enable':
        if (!ctx.message.mentions.channels.size) return ctx.errorMsg('Specify the channel you want to enable it on.')
        await ctx.guild.update({ starboard: ctx.message.mentions.channels.first().id })
        ctx.successMsg(`Successfully enabled the server starboard for the channel ${ctx.message.mentions.channels.first()}`)
        break
      case 'disable':
        await ctx.guild.update({ starboard: null })
        ctx.successMsg('Successfully disabled the server starboard.')
        break
      case 'limit':
        amount = this.verifyInt(amount)
        if (amount < 1) return ctx.errorMsg('Limit cannot be less than 1')
        if (amount > ctx.guild.memberCount) return ctx.errorMsg('Limit cannot be more than the amount of members in the server.')
        await ctx.guild.update({ starboardLimit: amount })
        ctx.successMsg(`Successfully updated the starboard star limit to ${amount}`)
        break
      default:
        ctx.errorMsg('Error', `Correct usage: \`${ctx.guild.prefix}${this.usage}\``)
        break
    }
  }
}

module.exports = Starboard
