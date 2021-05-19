const Command = require('#structures/Command')

class WeebGreetings extends Command {
  constructor(...args) {
    super(...args, {
      description: 'Enable/Disable Weeb style welcome/leave messages.',
      aliases: ['greetings'],
      usage: 'weebgreetings <enable <channel> | disable>',
      userPermissions: ['MANAGE_GUILD'],
      guildOnly: true
    })
  }

  async run(ctx, [action]) {
    if (!action) return ctx.reply(`${this.client.constants.emojis.error} Please specify either \`${ctx.guild.settings.prefix}weebgreetings enable #channel\` or \`${ctx.guild.settings.prefix}weebgreetings disable\``)

    if (action === 'disable') {
      await ctx.guild.update({ weebGreetings: null })
      return ctx.reply(`${this.client.constants.emojis.success} Successfully disabled weeb greetings.`)
    }

    if (action === 'enable') {
      if (!ctx.message.mentions.channels.size) return ctx.reply('Specify the channel you want to enable it on.')
      const channel = ctx.message.mentions.channels.first()
      await ctx.guild.update({ weebGreetings: channel.id })
      return ctx.reply(`${this.client.constants.emojis.success} Successfully enabled weeb greetings for the channel ${channel}`)
    }

    return ctx.reply('Invalid action either specify `enable #channel` or `disable`')
  }
}

module.exports = WeebGreetings
