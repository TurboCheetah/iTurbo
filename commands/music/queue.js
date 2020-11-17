const Command = require('../../structures/Command.js')
const { MessageEmbed } = require('discord.js')

class Queue extends Command {
  constructor (...args) {
    super(...args, {
      description: 'Plays the desired song',
      aliases: ['pl'],
      botPermissions: ['CONNECT', 'SPEAK', 'EMBED_LINKS'],
      usage: 'play <search query or URL>',
      guildOnly: true,
      cost: 0,
      cooldown: 20
    })
  }

  async run (ctx) {
    const queue = this.client.distube.getQueue(ctx.message)

    if (!queue || queue === undefined) {
      return ctx.reply('There is nothing in the queue!')
    }

    let upcoming = queue.songs.filter((song, id) => id > 0)
    upcoming = upcoming.map((song, id) => `**${id + 2}**. [${song.name}](${song.url}) - \`${song.formattedDuration}\``).join('\n')

    const embed = new MessageEmbed()
      .setColor(0x9590EE)
      .setAuthor('🎵 Current Queue 🎵')
      .setTitle(`Now playing: ${queue.songs[0].name}`)
      .setURL(queue.songs[0].url)
      .setThumbnail(queue.songs[0].thumbnail)
      .setDescription(`**Next Songs**\n${upcoming.length === 0 ? 'No upcoming songs' : upcoming}`)
    ctx.reply({ embed })
  }
}

module.exports = Queue
