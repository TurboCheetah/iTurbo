const Command = require('#structures/Command')
const { MessageEmbed } = require('discord.js')
const c = require('@aero/centra')

class Cat extends Command {
  constructor(...args) {
    super(...args, {
      description: language => language.get('COMMAND_CAT_DESCRIPTION'),
      aliases: ['meow', 'catpic', 'randomcat'],
      cooldown: 3,
      botPermissions: ['EMBED_LINKS']
    })
  }

  async run(ctx) {
    const { file } = await c('https://aws.random.cat/meow').json()

    ctx.reply(new MessageEmbed().setTitle('Random Cat').setColor(0x9590ee).setImage(file))
  }
}

module.exports = Cat
