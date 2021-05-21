const Command = require('#structures/Command')
const { MessageEmbed } = require('discord.js')

class UserPrefix extends Command {
  constructor(...args) {
    super(...args, {
      description: 'Manage Per-User Global prefixes.',
      aliases: ['uprefix'],
      usage: 'userprefix <add|remove|list:default> <prefix>',
      extendedHelp: 'With this command you can add a prefix that only you can use everywhere this bot is available. Convenient for those who find the prefix uncomfortable or just wants to stick with one prefix everywhere. Keep in mind prefixes are case insensitives so do not worry about that.',
      botPermissions: ['EMBED_LINKS']
    })
  }

  async run(ctx, [action = 'list', ...args]) {
    if (!['add', 'remove', 'list'].includes(action)) {
      return ctx.errorMsg('Invalid Action', `Correct usage: \`${ctx.guild.prefix}${this.usage}\``)
    }

    return this[action](ctx, args)
  }

  async add(ctx, args) {
    if (ctx.author.settings.prefix && ctx.author.settings.prefix.length >= 10) {
      return ctx.errorMsg('Error', "You can't have more than 10 prefixes. Remove some before trying again.")
    }

    const prefixInput = args.join(' ').toLowerCase()
    if (!prefixInput) return ctx.errorMsg('Error', 'You must provide a prefix.')

    // User prefixes get an extra 5 chars compared to guild prefixes.
    if (prefixInput.length > 15) return ctx.errorMsg('Error', 'Prefix cannot be longer than 15 characters!')

    // Get existing prefixes to append to.
    const prefix = ctx.author.settings.prefix || []

    // Avoid duplicates.
    if (prefix.includes(prefixInput)) return ctx.errorMsg('Error', 'That prefix is already on the list.')

    prefix.push(prefixInput)

    await ctx.author.update({ prefix })
    return ctx.successMsg('Success', `Successfully added the prefix **${prefixInput}** to your list of prefixes.`)
  }

  async list(ctx) {
    if (!ctx.author.settings.prefix || !ctx.author.settings.prefix.length) {
      return ctx.errorMsg('Error', "You don't have any user prefixes yet!")
    }

    const embed = new MessageEmbed()
      .setTitle('User Prefixes')
      .setAuthor(ctx.author.tag, ctx.author.displayAvatarURL({ size: 64, dynamic: true }))
      .setColor(0x9590ee)
      .setDescription(ctx.author.settings.prefix.map(prefix => `• ${prefix}`).join('\n'))

    return ctx.reply({ embed })
  }

  async remove(ctx, args) {
    if (!ctx.author.settings.prefix || !ctx.author.settings.prefix) {
      return ctx.errorMsg('Error', "You don't have any prefixes to remove!")
    }

    const prefixInput = args.join(' ').toLowerCase()
    if (!prefixInput) return ctx.errorMsg('Error', 'You must provide a prefix to remove!')

    const prefix = ctx.author.settings.prefix
    if (!prefix.includes(prefixInput)) return ctx.errorMsg('Error', 'That prefix is not in your list.')

    prefix.splice(prefix.indexOf(prefixInput), 1)

    await ctx.author.update({ prefix })

    return ctx.successMsg('Success', `Removed the prefix **${prefixInput}** from your prefix list.`)
  }
}

module.exports = UserPrefix
