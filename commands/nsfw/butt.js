const Command = require('../../structures/Command.js')
const fetch = require('node-fetch')
const { MessageEmbed } = require('discord.js')

class Butt extends Command {
  constructor (...args) {
    super(...args, {
      description: 'Returns a picture of a butt.',
      usage: 'ass',
      aliases: ['ass', 'booty'],
      cooldown: 3,
      cost: 3,
      nsfw: true,
      botPermissions: ['EMBED_LINKS']
    })

    this.errorMessage = 'There was an error.'
  }

  async run (ctx) {
    const data = await fetch('http://api.oboobs.ru/butts/0/1/random')
      .then((res) => res.json())
      .then((body) => {
        if (body.error) throw this.errorMessage
        return body[0].preview
      })
      .catch(() => { throw this.errorMessage })

    if (!ctx.channel.nsfw) {
      return ctx.reply('The result I found was NSFW and I cannot post it in this channel.')
    }

    const embed = new MessageEmbed()
      .setColor(0x9590EE)
      .setImage(`http://media.oboobs.ru/${data}`)
      .setFooter(`Requested by: ${ctx.author.tag} • Powered by oBoobs.ru`, ctx.author.displayAvatarURL({ size: 32 }))
    return ctx.reply({ embed })
  }
}

module.exports = Butt
