const Event = require('../structures/Event.js')
const { MessageEmbed } = require('discord.js')

class addSong extends Event {
  async run(player, track, position = player.queue.size) {
    const channel = this.client.channels.cache.get(player.textChannel)

    const embed = new MessageEmbed()
      .setColor(0x9590ee)
      .setAuthor(`Enqueued at position ${position}`, 'https://i.imgur.com/Nmg88HS.png')
      .setTitle(track.title)
      .setURL(track.uri)
      .setThumbnail(track.displayThumbnail('maxresdefault'))
      .addField('Requested by', track.requester, true)
      .addField('Duration', this.client.utils.formatDuration(track.duration), true)
      .addField('Queue', `${player.queue.totalSize === 1 ? '1 song' : `${player.queue.totalSize} songs`} - ${this.client.utils.formatDuration(player.queue.duration)}`, true)
    channel.send({ embed }).then(ctx => ctx.delete({ timeout: 15000 }))
  }
}

module.exports = addSong
