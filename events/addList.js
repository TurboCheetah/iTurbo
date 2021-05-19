const Event = require('#structures/Event')
const { MessageEmbed } = require('discord.js')

class addList extends Event {
  async run(ctx, player, res) {
    const channel = this.client.channels.cache.get(player.textChannel)

    const embed = new MessageEmbed()
      .setColor(0x9590ee)
      .setAuthor(`Enqueued ${res.tracks ? res.tracks.length : res.songs.length} songs from playlist`, this.client.constants.addImg)
      .setTitle(res.playlist ? res.playlist.name : res.name)
      .setThumbnail(res.tracks ? `https://img.youtube.com/vi/${res.tracks[0].identifier}/maxresdefault.jpg` : `https://img.youtube.com/vi/${res.songs[0].identifier}/maxresdefault.jpg`)
      .addField('Requested by', res.tracks ? res.tracks[0].requester : ctx.author, true)
    if (res.playlist) embed.addField('Duration', this.client.utils.formatDuration(res.playlist.duration), true)
    channel.send({ embed })
  }
}

module.exports = addList
