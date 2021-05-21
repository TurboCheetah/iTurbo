const Command = require('#structures/Command')
const { MessageEmbed } = require('discord.js')
const c = require('@aero/centra')

class Shiba extends Command {
  constructor(...args) {
    super(...args, {
      description: language => language.get('COMMAND_SHIBA_DESCRIPTION'),
      aliases: ['doge', 'shib', 'shiba', 'shibainu', 'shibe'],
      cooldown: 3,
      botPermissions: ['EMBED_LINKS']
    })
  }

  async run(ctx) {
    const [url] = await c('https://shibe.online/api/shibes').json()

    ctx.reply(new MessageEmbed().setTitle('Shiba Inu').setColor(0x9590ee).setImage(url))
  }
}

module.exports = Shiba
