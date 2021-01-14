const Command = require('../../structures/Command.js')
const { MessageEmbed } = require('discord.js')

class Bird extends Command {
  constructor(...args) {
    super(...args, {
      aliases: ['birb', 'chirp'],
      description: 'Grabs a random bird image from the KSoft API.',
      cooldown: 3,
      botPermissions: ['EMBED_LINKS']
    })
  }

  async run(ctx) {
    const { url } = await this.client.ksoft.images.random('birb', { nsfw: false })

    return ctx.reply(new MessageEmbed().setTitle('Random Bird').setImage(url).setColor(0x9590ee).setFooter('Powered by KSoft.Si'))
  }
}

module.exports = Bird
