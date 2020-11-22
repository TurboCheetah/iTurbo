const Command = require('../../structures/Command.js')

class Prefix extends Command {
  constructor (...args) {
    super(...args, {
      description: 'Set or reset the prefix for this server.',
      usage: 'prefix [prefix|reset]',
      guildOnly: true,
      aliases: ['setprefix', 'changeprefix']
    })
  }

  async run (ctx, args) {
    if (!args.length) {
      return ctx.reply(`The prefix for this server is \`${ctx.guild.settings.prefix}\``)
    }

    if (!ctx.member.permissions.has('MANAGE_GUILD')) { return ctx.reply('You need the `Manage Server` permissions to change the prefix.') }

    const prefix = args.join(' ')

    if (prefix === 'reset') return this.reset(ctx)
    if (prefix.length > 10) return ctx.reply("Prefix can't be longer than 10 characters.")
    if (prefix === ctx.guild.settings.prefix) throw 'That is already the current prefix.'

    await ctx.guild.update({ prefix })
    return ctx.reply(`${this.client.constants.success} Successfully updated prefix to: \`${prefix}\``)
  }

  async reset (ctx) {
    if (ctx.guild.settings.prefix === '|') return ctx.reply('The prefix is already the default.')
    await ctx.guild.update({ prefix: '|' })
    return ctx.reply('Reset the prefix for this server to `|`')
  }
}

module.exports = Prefix
