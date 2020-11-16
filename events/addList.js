const Event = require('../structures/Event.js')
const { MessageEmbed } = require('discord.js')

class addList extends Event {
  async run (msg, queue, playlist) {
    const embed = new MessageEmbed()
      .setColor(0x9590EE)
      .setAuthor(`🎵 Added Playlist 🎵`)
      .setTitle(playlist.name)
      .setURL(playlist.url)
      .setThumbnail(playlist.thumbnail)
      .addField('Requested by', song.user, true)
      .addField('Length', `${playlist.songs.length === 1 ? `1 song` : `${playlist.songs.length} songs`} - ${playlist.formattedDuration}`, true)
      .addField('Queue', `${queue.songs.length === 1 ? `1 song` : `${queue.songs.length} songs`} - ${queue.formattedDuration}`, true)
      .addField('Volume', `${queue.volume}%`, true)
      .addField('Loop', queue.repeatMode ? queue.repeatMode == 2 ? 'All Queue' : 'This Song' : 'Off', true)
      .addField('Autoplay', queue.autoplay ? 'On' : 'Off', true)
      .addField('Enabled Filters', queue.filter || 'No filters have been enabled', true)
    msg.channel.send({ embed })
  }
}

module.exports = addList
