const Command = require('#structures/Command')
const { MessageEmbed } = require('discord.js')
const c = require('@aero/centra')

class Duck extends Command {
  constructor(...args) {
    super(...args, {
      aliases: ['randomduck', 'ducc'],
      description: 'Grabs a random duck image from random-d.uk.',
      extendedHelp: 'This command grabs a random duck from https://random-d.uk/api/v1/random',
      cooldown: 3,
      botPermissions: ['EMBED_LINKS']
    })
  }

  async run(ctx) {
    const { url } = await c('https://random-d.uk/api/v1/random').json()

    return ctx.reply(new MessageEmbed().setTitle('Random Duck').setColor(0x9590ee).setImage(url))
  }
}

module.exports = Duck
