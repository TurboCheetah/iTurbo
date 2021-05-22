const Command = require('#structures/Command')
const { MessageEmbed } = require('discord.js')
const c = require('@aero/centra')

class Joke extends Command {
  constructor(...args) {
    super(...args, {
      description: language => language.get('jokeDescription'),
      aliases: ['jk'],
      cooldown: 3,
      botPermissions: ['EMBED_LINKS']
    })
  }

  async run(ctx) {
    const body = await c('https://sv443.net/jokeapi/v2/joke/Any').json()

    if (body.error) return ctx.errorMsg(ctx.language.get('error'), ctx.language.get('jokeError'))
    const flags = Object.entries(body.flags)
      .filter(x => x[1])
      .map(x => x[0])
      .join(', ')

    const embed = new MessageEmbed()
      .setColor(this.client.constants.color)
      .setTitle(`${body.category}${flags ? ` (${flags})` : ''}`)
      .setDescription(body.type === 'single' ? `${body.joke}` : `**${body.setup}**\n*${body.delivery}*`)
      .setAuthor(ctx.author.tag, ctx.author.displayAvatarURL({ size: 128, dynamic: true }))

    return ctx.reply({ embed })
  }
}

module.exports = Joke
