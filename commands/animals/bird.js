const Command = require('#structures/Command')
const { MessageEmbed } = require('discord.js')

class Bird extends Command {
  constructor(...args) {
    super(...args, {
      description: language => language.get('COMMAND_BIRD_DESCRIPTION'),
      aliases: ['birb', 'chirp'],
      cooldown: 3,
      botPermissions: ['EMBED_LINKS']
    })
  }

  async run(ctx) {
    const { url } = await this.client.ksoft.images.random('birb', { nsfw: false })

    ctx.reply(new MessageEmbed().setTitle('Random Bird').setColor(0x9590ee).setImage(url).setFooter('Powered by KSoft.Si'))
  }
}

module.exports = Bird
