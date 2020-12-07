const Event = require('../structures/Event.js')
const { MessageEmbed } = require('discord.js')

class playList extends Event {
  async run (msg, queue, playlist, song) {
    const embed = new MessageEmbed()
      .setColor(0x9590EE)
      .setAuthor(`🎵 Now Playing Playlist ${playlist.name}`)
      .setTitle(`Now playing ${playlist.songs[0].name}`)
      .setURL(playlist.songs[0].url)
      .setThumbnail(playlist.thumbnail)
      .addField('Requested by', song.user, true)
      .addField('Length', `${playlist.songs.length === 1 ? '1 song' : `${playlist.songs.length} songs`} - ${playlist.formattedDuration}`, true)
      .addField('Queue', `${queue.songs.length === 1 ? '1 song' : `${queue.songs.length} songs`} - ${queue.formattedDuration}`, true)
    msg.channel.send({ embed })
  }
}

module.exports = playList
