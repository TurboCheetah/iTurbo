const Command = require('#structures/Command')
const { MessageEmbed } = require('discord.js')
const c = require('@aero/centra')

class Dog extends Command {
  constructor(...args) {
    super(...args, {
      description: language => language.get('COMMAND_DOG_DESCRIPTION'),
      aliases: ['randomdog', 'woof'],
      cooldown: 3,
      botPermissions: ['EMBED_LINKS']
    })
  }

  async run(ctx) {
    const { message } = await c('https://dog.ceo/api/breeds/image/random').json()

    ctx.reply(new MessageEmbed().setTitle('Random Dog').setColor(0x9590ee).setImage(message))
  }
}

module.exports = Dog
