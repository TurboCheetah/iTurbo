const Event = require('../structures/Event.js')
const { MessageEmbed } = require('discord.js')

class playSong extends Event {
  async run(player, track) {
    const channel = this.client.channels.cache.get(player.textChannel)

    if (player.queue.size > 1 && channel.guild.settings.nowplaying === false) return

    // Send a message when the track starts playing with the track name and the requester's Discord tag, e.g. username#discriminator
    const embed = new MessageEmbed()
      .setColor(0x9590ee)
      .setAuthor('🎵 Now Playing')
      .setTitle(track.title)
      .setURL(track.uri)
      .setThumbnail(track.displayThumbnail('maxresdefault'))
      .addField('Requested by', track.requester, true)
      .addField('Duration', this.client.utils.formatDuration(track.duration), true)
      .addField('Queue', `${player.queue.totalSize === 1 ? '1 song' : `${player.queue.totalSize} songs`} - ${this.client.utils.formatDuration(player.queue.duration)}`, true)
    channel.send({ embed }).then(ctx => ctx.delete({ timeout: 15000 }))
  }
}

module.exports = playSong
