const Command = require('../../structures/Command.js')
const { MessageEmbed } = require('discord.js')
const c = require('@aero/centra')

class Shibe extends Command {
  constructor(...args) {
    super(...args, {
      description: 'Post a randomly selected image of a Shiba Inu.',
      extended: 'This command will return a beautiful Shiba Inu.',
      cooldown: 3,
      aliases: ['doge', 'shib', 'shiba', 'shibainu'],
      botPermissions: ['EMBED_LINKS']
    })
  }

  async run(ctx) {
    const [url] = await c('https://shibe.online/api/shibes').json()

    const embed = new MessageEmbed().setTitle('Shiba Inu').setColor(0x9590ee).setImage(url)

    return ctx.reply({ embed })
  }
}

module.exports = Shibe
