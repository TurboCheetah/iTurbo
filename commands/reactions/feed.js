const Command = require('#structures/Command')
const { MessageEmbed } = require('discord.js')
const c = require('@aero/centra')

class Feed extends Command {
  constructor(...args) {
    super(...args, {
      description: 'Feed someone',
      usage: 'feed <@member>',
      guildOnly: true,
      cooldown: 3,
      cost: 5,
      botPermissions: ['EMBED_LINKS']
    })
  }

  async run(ctx, [member]) {
    member = await this.verifyMember(ctx, member)

    if (member.id === ctx.author.id) return ctx.reply("You can't feed yourself!")

    const { url } = await c('https://nekos.life/api/v2/img/feed').json()

    const embed = new MessageEmbed().setColor(0x9590ee).setDescription(`**${member.displayName}**, you just got fed by **${ctx.member.displayName}**`).setImage(url).setFooter('Powered by nekos.life')

    return ctx.reply({ embed })
  }
}

module.exports = Feed
