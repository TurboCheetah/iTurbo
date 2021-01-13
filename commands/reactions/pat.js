const Command = require('../../structures/Command.js')
const { MessageEmbed } = require('discord.js')

class Pat extends Command {
  constructor(...args) {
    super(...args, {
      description: 'Pat someone',
      usage: 'pat <@member>',
      guildOnly: true,
      cooldown: 3,
      cost: 5,
      botPermissions: ['EMBED_LINKS']
    })
  }

  async run(ctx, [member]) {
    member = await this.verifyMember(ctx, member)

    if (member.id === ctx.author.id) return ctx.reply("You can't pat yourself!")

    const { url } = await this.client.ksoft.images.random('pat', { nsfw: ctx.channel.nsfw })

    const embed = new MessageEmbed().setColor(0x9590ee).setDescription(`**${member.displayName}**, you just got pats from **${ctx.member.displayName}**`).setImage(url).setFooter('Powered by ')

    return ctx.reply({ embed })
  }
}

module.exports = Pat
