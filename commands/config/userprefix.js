const Command = require('#structures/Command')
const { MessageEmbed } = require('discord.js')

class UserPrefix extends Command {
  constructor(...args) {
    super(...args, {
      description: language => language('commands/config/userprefix:description'),
      extendedHelp: language => language('commands/config/userprefix:extendedHelp'),
      usage: language => language('commands/config/userprefix:usage'),
      aliases: ['uprefix'],
      botPermissions: ['EMBED_LINKS']
    })
  }

  async run(ctx, [action = 'list', ...args]) {
    if (!['add', 'remove', 'list'].includes(action)) {
      return ctx.errorMsg(ctx.translate('common:invalidAction'), ctx.translate('common:correctUsage', { prefix: ctx.guild.prefix, usage: this.usage }))
    }

    return this[action](ctx, args)
  }

  async add(ctx, args) {
    if (ctx.author.settings.prefix && ctx.author.settings.prefix.length >= 10) {
      return ctx.errorMsg(ctx.translate('common:error'), ctx.translate('commands/config/userprefix:overLimit'))
    }

    const prefixInput = args.join(' ').toLowerCase()
    if (!prefixInput) return ctx.errorMsg(ctx.translate('common:error'), ctx.translate('commands/config/userprefix:noPrefix'))

    // User prefixes get an extra 5 chars compared to guild prefixes.
    if (prefixInput.length > 15) return ctx.errorMsg(ctx.translate('common:error'), ctx.translate('commands/config/userprefix:long'))

    // Get existing prefixes to append to.
    const prefix = ctx.author.settings.prefix || []

    // Avoid duplicates.
    if (prefix.includes(prefixInput)) return ctx.errorMsg(ctx.translate('common:error'), ctx.translate('commands/config/userprefix:alreadyAdded'))

    prefix.push(prefixInput)

    await ctx.author.update({ prefix })
    return ctx.successMsg('Success', ctx.translate('commands/config/userprefix:success', { prefix: prefixInput }))
  }

  async list(ctx) {
    if (!ctx.author.settings.prefix || !ctx.author.settings.prefix.length) {
      return ctx.errorMsg(ctx.translate('common:error'), ctx.translate('commands/config/userprefix:noPrefixes'))
    }

    const embed = new MessageEmbed()
      .setColor(this.client.constants.color)
      .setTitle(ctx.translate('commands/config/userprefix:title'))
      .setAuthor(ctx.author.tag, ctx.author.displayAvatarURL({ size: 128, dynamic: true }))
      .setDescription(ctx.author.settings.prefix.map(prefix => `• ${prefix}`).join('\n'))

    return ctx.reply({ embed })
  }

  async remove(ctx, args) {
    if (!ctx.author.settings.prefix || !ctx.author.settings.prefix) {
      return ctx.errorMsg(ctx.translate('common:error'), ctx.translate('commands/config/userprefix:noneToRemove'))
    }

    const prefixInput = args.join(' ').toLowerCase()
    if (!prefixInput) return ctx.errorMsg(ctx.translate('common:error'), ctx.translate('commands/config/userprefix:noPrefixToRemove'))

    const prefix = ctx.author.settings.prefix
    if (!prefix.includes(prefixInput)) return ctx.errorMsg(ctx.translate('common:error'), ctx.translate('commands/config/userprefix:invalid'))

    prefix.splice(prefix.indexOf(prefixInput), 1)

    await ctx.author.update({ prefix })

    return ctx.successMsg(ctx.translate('common:success'), ctx.translate('commands/config/userprefix:removed', { prefix: prefixInput }))
  }
}

module.exports = UserPrefix
