const Command = require('#structures/Command')
const { MessageEmbed } = require('discord.js')

class Badge extends Command {
  constructor(...args) {
    super(...args, {
      description: language => language('commands/fun/badge:description'),
      usage: language => language('commands/fun/badge:usage'),
      extendedHelp: language => language('commands/fun/badge:extendedHelp'),
      aliases: ['robohash'],
      botPermissions: ['EMBED_LINKS']
    })
  }

  async run(ctx, [user, set = 1]) {
    user = await this.verifyUser(ctx, user, true)

    if (isNaN(parseInt(set)) || parseInt(set) < 0 || parseInt(set) > 5) {
      return ctx.tr('commands/fun/badge:nan')
    }

    return ctx.reply(
      new MessageEmbed()
        .setColor(this.client.constants.color)
        .setTitle(ctx.translate('commands/fun/badge:title', user.tag, set))
        .setImage(`https://robohash.org/${user.id}?set=set${set}`)
        .setFooter(ctx.translate('common:requestedBy', { requester: ctx.author.tag }), ctx.author.displayAvatarURL({ size: 128, dynamic: true }))
        .setTimestamp()
    )
  }
}

module.exports = Badge
