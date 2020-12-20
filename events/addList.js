const Event = require('../structures/Event.js')
const { MessageEmbed } = require('discord.js')

class addList extends Event {
  async run (ctx, player, res) {
    const channel = this.client.channels.cache.get(player.textChannel)

    if (player.queue.size > 1 && channel.guild.settings.nowplaying === false) return

    const embed = new MessageEmbed()
      .setColor(0x9590EE)
      .setAuthor(`Enqueued ${res.tracks ? res.tracks.length : res.songs.length} songs from playlist`, 'https://i.imgur.com/Nmg88HS.png')
      .setTitle(res.playlist ? res.playlist.name : res.name)
      .setThumbnail(res.tracks ? `https://img.youtube.com/vi/${res.tracks[0].identifier}/maxresdefault.jpg` : `https://img.youtube.com/vi/${res.songs[0].identifier}/maxresdefault.jpg`)
      .addField('Requested by', res.tracks ? res.tracks[0].requester : ctx.author, true)
    if (res.playlist) embed.addField('Duration', this.client.utils.formatDuration(res.playlist.duration), true)
    channel.send({ embed }).then(ctx => ctx.delete({ timeout: 15000 }))
  }
}

module.exports = addList
