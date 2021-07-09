const Command = require('#structures/Command')
const { MessageEmbed } = require('discord.js')

class Suggestion extends Command {
  constructor(...args) {
    super(...args, {
      description: language => language('commands/general/suggestion:description'),
      usage: language => language('commands/general/suggestion:usage'),
      aliases: ['suggest'],
      cooldown: 60,
      botPermissions: ['EMBED_LINKS']
    })
  }

  async run(ctx, args) {
    if (!args.length) {
      const embed = new MessageEmbed()
        .setColor(this.client.constants.color)
        .setAuthor(ctx.author.username, ctx.author.displayAvatarURL({ size: 128, dynamic: true }))
        .setDescription(ctx.translate('commands/general/suggestion:prompt'))
        .setTimestamp()

      const filter = msg => msg.author.id === ctx.author.id
      const response = await ctx.message.awaitReply('', filter, 60000, embed)
      if (!response) return ctx.reply('common:noReplyTimeout', { time: 60 })

      if (response.toLowerCase()) {
        return ctx.reply('commands/general/suggestion:success', { isSupport: ctx.guild && ctx.guild.id !== this.client.constants.mainGuildID ? ' to the support server' : '' })
      } else if (['cancel'].includes(response)) {
        return ctx.reply('common:operationCancelled')
      } else {
        return ctx.reply('commands/general/suggestion:invalid')
      }
    }

    await this.client.shard.broadcastEval(`
    (async () => {
      const channel = this.channels.cache.get('735638790621757461')
      if (channel) {
        const { MessageEmbed } = require('discord.js')

        const embed = new MessageEmbed()
        .setColor(this.client.constants.color)
        .setTitle('${ctx.translate('commands/general/suggestion:title')}')
        .setDescription('${args.join(' ')}')
        .setThumbnail('${ctx.author.displayAvatarURL({ size: 512, dynamic: true })}')
        .setAuthor('${ctx.author.tag}', '${ctx.author.displayAvatarURL({ size: 128, dynamic: true })}')
        .setFooter('${ctx.translate('commands/general/suggestion:footer', ctx.author.id)}')
  
      const message = await channel.send({ embed })
      await message.react(this.constants.reactions.success)
      await message.react(this.constants.reactions.error)
      }
    })()
    `)

    return ctx.tr('commands/general/suggestion:submitted', { isSupport: ctx.guild && ctx.guild.id !== this.client.constants.mainGuildID ? ' to the support server' : '' })
  }
}

module.exports = Suggestion
