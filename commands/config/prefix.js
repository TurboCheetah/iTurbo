const Command = require('#structures/Command')

class Prefix extends Command {
  constructor(...args) {
    super(...args, {
      description: 'Set or reset the prefix for this server.',
      usage: 'prefix [prefix|reset]',
      guildOnly: true,
      aliases: ['setprefix', 'changeprefix']
    })
  }

  async run(ctx, args) {
    if (!args.length) {
      return ctx.reply(`The prefix for this server is **${ctx.guild.settings.prefix}**`)
    }

    if (!ctx.member.permissions.has('MANAGE_GUILD')) {
      return ctx.errorMsg('Error', 'You need the `Manage Server` permission to change the prefix.')
    }

    const prefix = args.join(' ')

    if (prefix === 'reset') return this.reset(ctx)
    if (prefix.length > 10) return ctx.errorMsg("Prefix can't be longer than 10 characters.")
    if (prefix === ctx.guild.settings.prefix) return ctx.errorMsg('That is already the current prefix.')

    await ctx.guild.update({ prefix })
    return ctx.successMsg('Success', `Updated prefix to **${prefix}**`)
  }

  async reset(ctx) {
    if (ctx.guild.settings.prefix === '|') return ctx.errorMsg('The prefix is already set to the default.')
    await ctx.guild.update({ prefix: '|' })
    return ctx.successMsg('Success', 'Reset the prefix for this server to **|**')
  }
}

module.exports = Prefix
