const Event = require('../structures/Event.js')
const { MessageEmbed } = require('discord.js')

class playSong extends Event {
  async run (msg, queue, song) {
    const embed = new MessageEmbed()
      .setColor(0x9590EE)
      .setAuthor('🎵 Now Playing 🎵')
      .setTitle(song.name)
      .setURL(song.url)
      .setThumbnail(song.thumbnail)
      .addField('Requested by', song.user, true)
      .addField('Duration', song.formattedDuration, true)
      .addField('Queue', `${queue.songs.length === 1 ? '1 song' : `${queue.songs.length} songs`} - ${queue.formattedDuration}`, true)
      .addField('Volume', `${queue.volume}%`, true)
      .addField('Loop', queue.repeatMode ? queue.repeatMode == 2 ? 'All Queue' : 'This Song' : 'Off', true)
      .addField('Autoplay', queue.autoplay ? 'On' : 'Off', true)
      .addField('Enabled Filters', queue.filter || 'No filters have been enabled', true)
    msg.channel.send({ embed })
  }
}

module.exports = playSong
