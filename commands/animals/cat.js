const Command = require('../../structures/Command.js')
const { MessageEmbed } = require('discord.js')
const c = require('@aero/centra')

class Cat extends Command {
  constructor(...args) {
    super(...args, {
      description: 'Get a picture of a random cat!',
      cooldown: 3,
      aliases: ['meow', 'catpic', 'randomcat'],
      botPermissions: ['EMBED_LINKS']
    })
  }

  async run(ctx) {
    const { file } = await c('https://aws.random.cat/meow').json()

    const embed = new MessageEmbed()
      .setTitle('Random Cat')
      .setColor(0x9590ee)
      .setAuthor(ctx.author.tag, ctx.author.displayAvatarURL({ size: 64 }))
      .setImage(file)
    return ctx.reply({ embed })
  }
}

module.exports = Cat
