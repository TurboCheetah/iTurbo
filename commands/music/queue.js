const Command = require('../../structures/Command.js')
// const { MessageEmbed } = require('discord.js')
const { FieldsEmbed } = require('discord-paginationembed')

class Queue extends Command {
  constructor (...args) {
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

  async run (ctx, [page = 1]) {
    const queue = this.client.distube.getQueue(ctx.message)

    if (!queue || queue === undefined) {
      return ctx.reply('There is nothing in the queue!')
    }

    let upcoming = queue.songs.filter((song, id) => id > 0)

    /* const embed = new MessageEmbed()
      .setColor(0x9590EE)
      .setAuthor(`| ${ctx.guild.name}'s Queue`, ctx.guild.iconURL({ size: 512 }))
      .setTitle(`🔊 Now playing: ${queue.songs[0].name}`)
      .setURL(queue.songs[0].url)
      .setThumbnail(queue.songs[0].thumbnail)
      .setDescription(`**Up next**\n${upcoming.length === 0 ? 'No upcoming songs' : upcoming}`)
      .setFooter(`Total length: ${queue.formattedDuration}`)
    ctx.reply({ embed }) */

    const Pagination = new FieldsEmbed()
      .setArray(upcoming)
      .setAuthorizedUsers([ctx.author.id])
      .setChannel(ctx.channel)
      .setElementsPerPage(5)
      .setPage(page)
      .setPageIndicator('footer', (page, pages) => `Requested by ${ctx.author.tag} | Page ${page} of ${pages}`)
      .formatField('Up Next', song => `**${upcoming.indexOf(song) + 2}**. [${song.name}](${song.url}) requested by ${song.user}`)

    //upcoming = upcoming.map((song, id) => `**${id + 2}**. [${song.name}](${song.url}) - \`${song.formattedDuration}\``).join('\n')

    Pagination.embed
      .setColor(0x9590EE)
      .setAuthor(`| ${ctx.guild.name}'s Queue`, ctx.guild.iconURL({ size: 512 }))
      .setTitle(`🔊 Now playing: ${queue.songs[0].name}`)
      .setURL(queue.songs[0].url)
      .setThumbnail(queue.songs[0].thumbnail)
      // .setDescription(`**Up next**\n${upcoming.length === 0 ? 'No upcoming songs' : upcoming}`)
      .setFooter(`Total length: ${queue.formattedDuration}`, ctx.author.displayAvatarURL({ size: 64 }))

    return Pagination.build()
  }
}

module.exports = Queue
