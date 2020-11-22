const Event = require('../structures/Event.js')
const { MessageEmbed } = require('discord.js')

class addSong extends Event {
  async run (msg, queue, song) {
    const embed = new MessageEmbed()
      .setColor(0x9590EE)
      .setAuthor(`Enqueued at position ${queue.songs.length}`, 'https://i.imgur.com/Nmg88HS.png')
      .setTitle(song.name)
      .setURL(song.url)
      .setThumbnail(song.thumbnail)
      .addField('Requested by', song.user, true)
      .addField('Duration', song.formattedDuration, true)
      .addField('Queue', `${queue.songs.length === 1 ? '1 song' : `${queue.songs.length} songs`} - ${queue.formattedDuration}`, true)
    msg.channel.send({ embed })
  }
}

module.exports = addSong
