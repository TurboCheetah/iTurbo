const Command = require('#structures/Command')
const { MessageEmbed } = require('discord.js')

class UserPrefix extends Command {
  constructor(...args) {
    super(...args, {
      description: language => language.get('userprefixDescription'),
      extendedHelp: language => language.get('userprefixExtendedHelp'),
      usage: language => language.get('userprefixUsage'),
      aliases: ['uprefix'],
      botPermissions: ['EMBED_LINKS']
    })
  }

  async run(ctx, [action = 'list', ...args]) {
    if (!['add', 'remove', 'list'].includes(action)) {
      return ctx.errorMsg(ctx.language.get('invalidAction'), ctx.language.get('correctUsage', ctx.guild.prefix, this.usage))
    }

    return this[action](ctx, args)
  }

  async add(ctx, args) {
    if (ctx.author.settings.prefix && ctx.author.settings.prefix.length >= 10) {
      return ctx.errorMsg(ctx.language.get('error'), ctx.language.get('userprefixOverLimit'))
    }

    const prefixInput = args.join(' ').toLowerCase()
    if (!prefixInput) return ctx.errorMsg(ctx.language.get('error'), ctx.language.get('userprefixNoPrefix'))

    // User prefixes get an extra 5 chars compared to guild prefixes.
    if (prefixInput.length > 15) return ctx.errorMsg(ctx.language.get('error'), ctx.language.get('userprefixLong'))

    // Get existing prefixes to append to.
    const prefix = ctx.author.settings.prefix || []

    // Avoid duplicates.
    if (prefix.includes(prefixInput)) return ctx.errorMsg(ctx.language.get('error'), ctx.language.get('userprefixAlreadyAdded'))

    prefix.push(prefixInput)

    await ctx.author.update({ prefix })
    return ctx.successMsg('Success', ctx.language.get('userprefixSuccess', prefixInput))
  }

  async list(ctx) {
    if (!ctx.author.settings.prefix || !ctx.author.settings.prefix.length) {
      return ctx.errorMsg(ctx.language.get('error'), ctx.language.get('userprefixNoPrefixes'))
    }

    const embed = new MessageEmbed()
      .setColor(this.client.constants.color)
      .setTitle(ctx.language.get('userprefixTitle'))
      .setAuthor(ctx.author.tag, ctx.author.displayAvatarURL({ size: 128, dynamic: true }))
      .setDescription(ctx.author.settings.prefix.map(prefix => `• ${prefix}`).join('\n'))

    return ctx.reply({ embed })
  }

  async remove(ctx, args) {
    if (!ctx.author.settings.prefix || !ctx.author.settings.prefix) {
      return ctx.errorMsg(ctx.language.get('error'), ctx.language.get('userprefixNoneToRemove'))
    }

    const prefixInput = args.join(' ').toLowerCase()
    if (!prefixInput) return ctx.errorMsg(ctx.language.get('error'), ctx.language.get('userprefixNoPrefixToRemove'))

    const prefix = ctx.author.settings.prefix
    if (!prefix.includes(prefixInput)) return ctx.errorMsg(ctx.language.get('error'), ctx.language.get('userprefixInvalid'))

    prefix.splice(prefix.indexOf(prefixInput), 1)

    await ctx.author.update({ prefix })

    return ctx.successMsg(ctx.language.get('success'), ctx.language.get('userprefixRemoved', prefixInput))
  }
}

module.exports = UserPrefix
