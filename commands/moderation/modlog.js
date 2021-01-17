const Command = require('../../structures/Command.js')

class Modlog extends Command {
  constructor(...args) {
    super(...args, {
      description: 'Enable/Disable a modlog.',
      usage: 'modlog <enable|disable> <channel>',
      userPermissions: ['MANAGE_GUILD'],
      guildOnly: true
    })
  }

  async run(ctx, [action]) {
    if (!action && !ctx.guild.settings.modlog) return ctx.reply(`${this.client.constants.emojis.success} Invalid action. Specify either \`enable #channel\` or \`disable\``)
    if (!action) return ctx.reply(`The modlog is current set to ${this.client.channels.cache.get(ctx.guild.settings.modlog)}`)

    switch (action) {
      case 'disable':
        await ctx.guild.update({ modlog: null })
        ctx.reply(`${this.client.constants.emojis.success} Successfully disabled the modlog.`)
        break

      case 'enable': {
        if (!ctx.message.mentions.channels.size) return ctx.reply('Specify the channel you want to enable it on.')
        const channel = ctx.message.mentions.channels.first()
        await ctx.guild.update({ modlog: channel.id })
        ctx.reply(`${this.client.constants.emojis.success} Successfully enabled modlog for the channel ${channel}`)
        break
      }
      default:
        ctx.reply(`${this.client.constants.emojis.success} Invalid action. Specify either \`enable #channel\` or \`disable\``)
        break
    }
  }
}

module.exports = Modlog
