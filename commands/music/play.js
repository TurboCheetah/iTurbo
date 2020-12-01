const Command = require('../../structures/Command.js')
const { MessageEmbed } = require('discord.js')
const { getPreview, getTracks } = require('spotify-url-info')
const ytsr = require('@distube/ytsr')

class Play extends Command {
  constructor (...args) {
    super(...args, {
      description: 'Plays the desired song',
      aliases: ['pl'],
      botPermissions: ['CONNECT', 'SPEAK', 'EMBED_LINKS'],
      usage: 'play <search query or URL>',
      guildOnly: true,
      cost: 0
    })
  }

  async run (ctx, args) {
    if (!args.length && this.client.distube.isPaused(ctx.message)) {
      this.client.distube.resume(ctx.message)
      const embed = new MessageEmbed()
        .setColor(0x9590EE)
        .setAuthor('| ▶ Resumed the player', ctx.author.displayAvatarURL({ size: 512 }))
      return ctx.reply({ embed })
    }

    if (!args.length) return ctx.reply('What do you want me to play? Please provide a search query or song url!')

    if (args[0].indexOf('open.spotify.com') > -1 || args[0].indexOf('play.spotify.com') > -1) {
      if (args[0].indexOf('/playlist/')) {
        const data = await getTracks(args[0])
        data.forEach(song => {
          this.client.distube.play(ctx.message, `${song.artists[0].name} - ${song.name}`)
        })
      }
      const data = await getPreview(args[0])
      const search = await ytsr(`${data.artist} - ${data.title}`, { limit: 15 })
      const results = search.items.map(i => new SearchResult(i))
      if (results.length === 0) throw Error('No result!')
      return console.log(results)
      // return this.client.distube.play(ctx.message, `${data.artist} - ${data.title}`)
    }

    this.client.distube.play(ctx.message, args.join(' '))
  }
}

module.exports = Play
