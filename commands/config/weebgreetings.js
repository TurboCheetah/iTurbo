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
    if (!action) return ctx.errorMsg('Error', `Correct usage: \`${ctx.guild.prefix}${this.usage}\``)

    switch (action) {
      case 'enable':
        if (!ctx.message.mentions.channels.size) return ctx.reply('Specify the channel you want to enable it on.')
        await ctx.guild.update({ weebGreetings: ctx.message.mentions.channels.first().id })
        ctx.successMsg('Success', `Successfully enabled weeb greetings for the channel ${ctx.message.mentions.channels.first()}`)
        break
      case 'disable':
        await ctx.guild.update({ weebGreetings: null })
        ctx.successMsg('Success', 'Successfully disabled weeb greetings.')
        break
      default:
        ctx.errorMsg('Error', 'Invalid action either specify `enable <#channel>` or `disable`')
        break
    }
  }
}

module.exports = WeebGreetings
