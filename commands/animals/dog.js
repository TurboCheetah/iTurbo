const Command = require('#structures/Command')
const { MessageEmbed } = require('discord.js')
const c = require('@aero/centra')

class Dog extends Command {
  constructor(...args) {
    super(...args, {
      aliases: ['randomdog', 'woof'],
      description: 'Grabs a random dog image from random.dog.',
      extendedHelp: 'This command grabs a random dog from https://dog.ceo/api/breeds/image/random',
      cooldown: 3,
      botPermissions: ['EMBED_LINKS']
    })
  }

  async run(ctx) {
    const { message } = await c('https://dog.ceo/api/breeds/image/random').json()

    return ctx.reply(new MessageEmbed().setTitle('Random Dog').setImage(message).setColor(0x9590ee))
  }
}

module.exports = Dog
