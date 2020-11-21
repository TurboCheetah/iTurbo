const Command = require('../../structures/Command.js')
const { MessageEmbed } = require('discord.js')

class NowPlaying extends Command {
  constructor (...args) {
    super(...args, {
      description: 'Gets information about the currently playing song',
      aliases: ['np', 'song'],
      botPermissions: ['CONNECT', 'SPEAK', 'EMBED_LINKS'],
      usage: 'nowplaying',
      guildOnly: true,
      cost: 0,
      cooldown: 5
    })
  }

  async run (ctx) {
    const queue = this.client.distube.getQueue(ctx.message)

    const embed = new MessageEmbed()
      .setColor(0x9590EE)
      .setAuthor('🎵 Now Playing')
      .setTitle(queue.songs[0].name)
      .setURL(queue.songs[0].url)
      .setThumbnail(queue.songs[0].thumbnail)
      .addField('Requested by', queue.songs[0].user, true)
      .addField('Duration', `${queue.formattedCurrentTime}/${queue.songs[0].formattedDuration}`, true)
      .addField('Queue', `${queue.songs.length === 1 ? '1 song' : `${queue.songs.length} songs`} - ${queue.formattedDuration}`, true)
    ctx.reply({ embed })
  }
}

module.exports = NowPlaying
