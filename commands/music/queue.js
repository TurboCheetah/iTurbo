const Command = require('../../structures/Command.js')
const { MessageEmbed } = require('discord.js')
const { FieldsEmbed } = require('discord-paginationembed')

class Queue extends Command {
  constructor(...args) {
    super(...args, {
      description: 'Displays the music queue',
      aliases: ['q'],
      botPermissions: ['CONNECT', 'SPEAK', 'EMBED_LINKS'],
      usage: 'queue [page]',
      guildOnly: true,
      cost: 0,
      cooldown: 3
    })
  }

  async run(ctx, [page = 1]) {
    const player = this.client.manager.players.get(ctx.guild.id)

    if (!player || !player.queue || !player.queue.current) {
      const embed = new MessageEmbed().setColor(0x9590ee).setAuthor('| Nothing is playing!', ctx.author.displayAvatarURL({ size: 512 }))
      return ctx.reply({ embed })
    }

    if (!player.queue.map(track => track).length) {
      const embed = new MessageEmbed()
        .setColor(0x9590ee)
        .setAuthor(`| ${ctx.guild.name}'s Queue`, ctx.guild.iconURL({ size: 512 }))
        .setTitle(`🔊 Now playing: ${player.queue.current.title}`)
        .setURL(player.queue.current.uri)
        .setThumbnail(player.queue.current.displayThumbnail('maxresdefault'))
        .addField('Up Next', 'None')
        .setFooter(`Total length: ${this.client.utils.formatDuration(player.queue.duration)}`, ctx.author.displayAvatarURL({ size: 64 }))
      return ctx.reply({ embed })
    }

    const Pagination = new FieldsEmbed()
      .setArray(player.queue.map(track => track))
      .setAuthorizedUsers([ctx.author.id])
      .setChannel(ctx.channel)
      .setElementsPerPage(5)
      .setPage(page)
      .setPageIndicator('footer', (page, pages) => `Requested by ${ctx.author.tag} | Page ${page} of ${pages}`)
      .formatField('Up Next', track => `**${player.queue.indexOf(track) + 1}**. [${track.title}](${track.uri}) [${track.requester}]`)

    Pagination.embed
      .setColor(0x9590ee)
      .setAuthor(`| ${ctx.guild.name}'s Queue`, ctx.guild.iconURL({ size: 512 }))
      .setTitle(`🔊 Now playing: ${player.queue.current.title}`)
      .setURL(player.queue.current.uri)
      .setThumbnail(player.queue.current.displayThumbnail('maxresdefault'))
      .setFooter(`Total length: ${this.client.utils.formatDuration(player.queue.duration)}`, ctx.author.displayAvatarURL({ size: 64 }))

    return Pagination.build()
  }
}

module.exports = Queue
