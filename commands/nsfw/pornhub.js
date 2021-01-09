const Command = require('../../structures/Command.js')
const pornsearch = require('pornsearch')
const { MessageEmbed } = require('discord.js')

class Pornhub extends Command {
  constructor(...args) {
    super(...args, {
      description: 'Search for a video or gif on PornHub',
      usage: 'pornhub [gif] <query>',
      cooldown: 15,
      cost: 3,
      nsfw: true,
      aliases: ['ph'],
      botPermissions: ['EMBED_LINKS']
    })
  }

  async run(ctx, args) {
    switch (args[0]) {
      case 'gif': {
        try {
          args = args.splice(1)
          const search = await pornsearch.search(args).gifs()
          const result = this.client.utils.random(search)

          ctx.reply(`${result.title} - ${result.webm}`)
        } catch (err) {
          console.error(err)
        }
        break
      }
      default: {
        try {
          let result = await pornsearch.search(args).videos()
          result = this.client.utils.random(result)
          console.log(result.title.trim())
          const embed = new MessageEmbed()
            .setColor(0x9590ee)
            .setTitle(result.title.trim())
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
}

module.exports = Pornhub
