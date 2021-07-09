const Command = require('#structures/Command')
const { MessageEmbed } = require('discord.js')

class Leaderboard extends Command {
  constructor(...args) {
    super(...args, {
      description: 'View the server leaderboard.',
      usage: 'leaderboard [page]',
      guildOnly: true,
      aliases: ['lb', 'top']
    })
  }

  async run(ctx, [page]) {
    page = this.verifyInt(page, 1)

    const rows = await this.client.settings.members.find({
      where: { id: { like: `${ctx.guild.id}.%` } },
      sort: { points: -1 }
    })

    if (rows.length === 0) return ctx.reply('There is no leaderboard in this server, maybe its a dead place???')

    const totalPages = Math.max(Math.round(rows.length / 10), 1)

    page -= 1

    if (page > totalPages && !totalPages) return ctx.reply(`There are only **${totalPages || 1}** pages in the leaderboard.`)
    if (totalPages && page + 1 > totalPages) return ctx.reply(`There are only **${totalPages || 1}** pages in the leaderboard.`)

    const positions = rows.map(row => row.id.split('.')[1])
    const leaderboard = []

    const top = rows.slice(page * 10, (page + 1) * 10)
    for (let i = 0; i < rows.length; i++) {
      const u = top[i]
      const user = await this.client.users.fetch(u.id.split('.')[1])
      leaderboard.push(`**#${(page * 10 + (i + 1)).toString()}** ❯ ${user} - **¥${parseInt(u.points).toLocaleString()}**\n`)
    }

    const pos = positions.indexOf(ctx.author.id).toString()
    const posTxt = pos === -1 ? '??' : (positions.indexOf(ctx.author.id) + 1).toString()

    const embed = new MessageEmbed()
      .setColor(this.client.constants.color)
      .setTitle(ctx.translate('leaderboardTitle', ctx.guild))
      .setThumbnail(ctx.guild.iconURL({ size: 512, dynamic: true }))
      .setDescription(ctx.translate('leaderboardPosition', posTxt, parseInt(ctx.member.settings.points).toLocaleString()))
      .addField(ctx.translate('leaderboardText'), leaderboard.join('\n'))
      .setFooter(ctx.translate('page', page + 1, totalPages || 1), ctx.author.avatarURL({ size: 128, dynamic: true }))

    return ctx.reply({ embed })
  }
}

module.exports = Leaderboard
