const Command = require('../../structures/Command.js')
const { MessageEmbed } = require('discord.js')

class Queue extends Command {
  constructor (...args) {
    super(...args, {
      description: 'Displays the music queue',
      aliases: ['q'],
      botPermissions: ['CONNECT', 'SPEAK', 'EMBED_LINKS'],
      usage: 'queue',
      guildOnly: true,
      cost: 0,
      cooldown: 3
    })
  }

  async run (ctx) {
    const queue = this.client.distube.getQueue(ctx.message)

    if (!queue || queue === undefined) {
      return ctx.reply('There is nothing in the queue!')
    }

    let upcoming = queue.songs.filter((song, id) => id > 0 && id < 15)
    upcoming = upcoming.map((song, id) => `**${id + 2}**. [${song.name}](${song.url}) - \`${song.formattedDuration}\``).join('\n')

    const embed = new MessageEmbed()
      .setColor(0x9590EE)
      .setAuthor(`| ${ctx.guild.name}'s Queue`, ctx.guild.iconURL({ size: 512 }))
      .setTitle(`🔊 Now playing: ${queue.songs[0].name}`)
      .setURL(queue.songs[0].url)
      .setThumbnail(queue.songs[0].thumbnail)
      .setDescription(`**Up next**\n${upcoming.length === 0 ? 'No upcoming songs' : upcoming}`)
      .setFooter(`Total length: ${queue.formattedDuration}`)
    ctx.reply({ embed })
  }
}

module.exports = Queue
