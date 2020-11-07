const Command = require('../../structures/Command.js')
const pornsearch = require('pornsearch')
const { MessageEmbed } = require('discord.js')

class Pornhub extends Command {
  constructor (...args) {
    super(...args, {
      description: 'Search for a video or gif on PornHub',
      usage: 'pornhub [gif] <query>',
      cooldown: 15,
      nsfw: true,
      aliases: ['ph']
    })
  }

  async run (ctx, args) {
    switch (args[0]) {
      case 'gif':
        try {
          var args = args.splice(1)
          const search = await pornsearch.search(args).gifs()
          var result = this.client.utils.random(search)

          ctx.reply(`${result.title} - ${result.webm}`)
        } catch (err) {
          console.error(err)
        }
        break
      default:
        try {
          var result = await pornsearch.search(args).videos()
          result = this.client.utils.random(result)
          var embed = new MessageEmbed()
            .setColor(0x9590EE)
            .setTitle(result.title)
            .setURL(result.url)
            .addField('Duration', result.duration, true)
            .addField('Views', result.views, true)
            .addField('Rating', result.rating, true)
            .setImage(result.thumb)
            .setFooter(`Requested by: ${ctx.author.tag} • Powered by PornHub`, ctx.author.displayAvatarURL({ size: 32 }))

          ctx.reply({ embed })
        } catch (err) {
          console.error(err)
        }
        break
    }
  }
}

module.exports = Pornhub
