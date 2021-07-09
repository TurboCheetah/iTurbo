const Command = require('#structures/Command')
const { MessageEmbed } = require('discord.js')

class RepLB extends Command {
  constructor(...args) {
    super(...args, {
      description: language => language('commands/misc/replb:description'),
      aliases: ['repleaderboard', 'reputationleaderboard', 'reputationlb'],
      botPermissions: ['EMBED_LINKS']
    })
  }

  async run(ctx) {
    const rows = await this.client.settings.users.find({
      where: { reputation: { gt: 0 } },
      sort: { reputation: -1 },
      limit: 10
    })

    if (!rows.length) return ctx.tr('commands/misc/replb:noRep')

    const embed = new MessageEmbed()
      .setColor(0x9590ee)
      .setTitle(ctx.translate('commands/misc/replb:title', { amount: rows.length === 1 ? '' : ` ${rows.length}`, length: rows.length > 1 ? 's' : '' }))
      .setAuthor(ctx.author.tag, ctx.author.displayAvatarURL({ size: 64, dynamic: true }))
      .setFooter(ctx.translate('commands/misc/replb:footer', { prefix: ctx.guild.settings.prefix }))

    const lb = []

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i]
      const user = await this.client.users.fetch(row.id)
      lb.push(`${(i + 1).toString().padEnd(2, ' ')} ❯ ${user.tag} - ${row.reputation}`)
    }

    embed.setDescription(lb.join('\n'))

    return ctx.reply({ embed })
  }
}

module.exports = RepLB
