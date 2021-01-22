const Command = require('../../structures/Command.js')
const { MessageEmbed } = require('discord.js')
const { Embeds } = require('discord-paginationembed')

class LavaStats extends Command {
  constructor(...args) {
    super(...args, {
      description: 'View Lavalink stats.',
      ownerOnly: true,
      hidden: true,
      botPermissions: ['EMBED_LINKS']
    })
  }

  async run(ctx, [page = 1]) {
    const embeds = []
    // const nodes = this.client.manager.nodes.map(node => node)
    const nodes = await this.client.shard.fetchClientValues('manager.nodes')
    for (const node of nodes) {
      const seconds = Math.floor(node.stats.uptime / 1000) % 60
      const minutes = Math.floor((node.stats.uptime / (1000 * 60)) % 60)
      const hours = Math.floor((node.stats.uptime / (1000 * 60 * 60)) % 24)
      const days = Math.floor((node.stats.uptime / (1000 * 60 * 60 * 24)) % 7)
      const uptime = [`${days} Days`, `${hours} Hours`, `${minutes} Minutes`, `${seconds} Seconds`].filter(time => !time.startsWith('0')).join(', ')

      const nodeEmbed = new MessageEmbed()
        .setColor(0x9590ee)
        .setAuthor(node.options.host, this.client.user.displayAvatarURL({ size: 64, dynamic: true }))
        .setTitle('Lavalink Stats')
        .addField('CPU', `${node.stats.cpu.systemLoad.toFixed(2) * 10}%`, true)
        .addField('Memory', `${(node.stats.memory.used / 1024 / 1024).toFixed(2)} MB`, true)
        .addField('Uptime', `${uptime}`, true)
        .addField('Players', `${node.stats.players}`, true)
        .addField('Playing Players', `${node.stats.playingPlayers}`, true)
        .setFooter(`Requested by ${ctx.author.tag}`, null)

      embeds.push(nodeEmbed)
    }

    const Pagination = new Embeds()
      .setArray(embeds)
      .setAuthorizedUsers([ctx.author.id])
      .setChannel(ctx.channel)
      .setPage(page)
      .setPageIndicator('footer', (page, pages) => `Node ${page} of ${pages}`)

    return Pagination.build()
  }
}

module.exports = LavaStats
