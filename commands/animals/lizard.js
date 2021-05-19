const Command = require('#structures/Command')
const { MessageEmbed } = require('discord.js')
const c = require('@aero/centra')

class Lizard extends Command {
  constructor(...args) {
    super(...args, {
      aliases: ['randomlizard'],
      description: 'Grabs a random lizard image from nekos.life.',
      extendedHelp: 'This command grabs a random lizard from https://nekos.life/api/v2/img/lizard',
      cooldown: 3,
      botPermissions: ['EMBED_LINKS']
    })
  }

  async run(ctx) {
    const { url } = await c('https://nekos.life/api/v2/img/lizard').json()

    return ctx.reply(new MessageEmbed().setTitle('Random Lizard').setColor(0x9590ee).setImage(url))
  }
}

module.exports = Lizard
