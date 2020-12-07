const Command = require('../../structures/Command.js')
const { MessageEmbed } = require('discord.js')
const createBar = require('string-progressbar')

class NowPlaying extends Command {
  constructor (...args) {
    super(...args, {
      description: 'Gets information about the currently playing song',
      aliases: ['np', 'song'],
      botPermissions: ['CONNECT', 'SPEAK', 'EMBED_LINKS'],
      usage: 'nowplaying',
      guildOnly: true,
      cost: 0,
      cooldown: 3
    })
  }

  async run (ctx) {
    const queue = this.client.distube.getQueue(ctx.message)

    if (!queue) {
      const embed = new MessageEmbed()
        .setColor(0x9590EE)
        .setAuthor('| Nothing is playing!', ctx.author.displayAvatarURL({ size: 512 }))
      return ctx.reply({ embed })
    }

    const embed = new MessageEmbed()
      .setColor(0x9590EE)
      .setAuthor('🎵 Now Playing')
      .setTitle(queue.songs[0].name)
      .setURL(queue.songs[0].url)
      .setThumbnail(queue.songs[0].thumbnail)
      .addField('Requested by', queue.songs[0].user, true)
      .addField('Queue', `${queue.songs.length === 1 ? '1 song' : `${queue.songs.length} songs`} - ${queue.formattedDuration}`, true)
      .addField('Duration', `\`${queue.formattedCurrentTime}\` ${createBar(queue.songs[0].formattedDuration, queue.formattedCurrentTime, 50)} \`${queue.songs[0].formattedDuration}\``, false)
    ctx.reply({ embed })
  }
}

module.exports = NowPlaying
