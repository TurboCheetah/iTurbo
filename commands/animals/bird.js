const Command = require('../../structures/Command.js')
const { MessageEmbed } = require('discord.js')

class Bird extends Command {
  constructor(...args) {
    super(...args, {
      aliases: ['birb', 'chirp'],
      description: 'Grabs a random bird image from the KSoft API.',
      extendedHelp: 'This command grabs a random big from https://api.ksoft.si/images/random-image',
      cooldown: 3,
      botPermissions: ['EMBED_LINKS']
    })
  }

  async run(ctx) {
    const { url } = await this.client.ksoft.images.random('birb', { nsfw: false })

    return ctx.reply(
      new MessageEmbed()
        .setTitle('Random Bird')
        .setImage(url)
        .setColor(0x9590ee)
        .setAuthor(ctx.author.tag, ctx.author.displayAvatarURL({ size: 64 }))
        .setFooter('Powered by KSoft.si')
    )
  }
}

module.exports = Bird
