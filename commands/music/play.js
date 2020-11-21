const Command = require('../../structures/Command.js')

class Play extends Command {
  constructor (...args) {
    super(...args, {
      description: 'Plays the desired song',
      aliases: ['pl'],
      botPermissions: ['CONNECT', 'SPEAK'],
      usage: 'play <search query or URL>',
      guildOnly: true,
      cost: 0
    })
  }

  async run (ctx, args) {
    if (!args.length && this.client.distube.isPaused(ctx.message)) {
      this.client.distube.resume(ctx.message)
      const embed = new MessageEmbed()
        .setColor(0x9590EE)
        .setAuthor('| ▶ Resumed the player', ctx.author.displayAvatarURL({ size: 512 }))
      return ctx.reply({ embed })
    }

    if (!args.length) return ctx.reply('What do you want me to play? Please provide a search query or song url!')

    this.client.distube.play(ctx.message, args.join(' '))
  }
}

module.exports = Play
