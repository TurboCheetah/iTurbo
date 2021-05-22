const Command = require('#structures/Command')
const { MessageEmbed } = require('discord.js')

class Badge extends Command {
  constructor(...args) {
    super(...args, {
      description: language => language.get('badgeDescription'),
      usage: language => language.get('badgeUsage'),
      extendedHelp: language => language.get('badgeExtendedHelp'),
      aliases: ['robohash'],
      botPermissions: ['EMBED_LINKS']
    })
  }

  async run(ctx, [user, set = 1]) {
    user = await this.verifyUser(ctx, user, true)

    if (isNaN(parseInt(set)) || parseInt(set) < 0 || parseInt(set) > 5) {
      return ctx.reply(ctx.language.get('badgeNaN'))
    }

    return ctx.reply(
      new MessageEmbed()
        .setColor(this.client.constants.color)
        .setTitle(ctx.language.get('badgeTitle', user.tag, set))
        .setImage(`https://robohash.org/${user.id}?set=set${set}`)
        .setFooter(ctx.language.get('requestedBy', ctx.author.tag), ctx.author.displayAvatarURL({ size: 128, dynamic: true }))
        .setTimestamp()
    )
  }
}

module.exports = Badge
