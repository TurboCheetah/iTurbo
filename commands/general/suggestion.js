const Command = require('#structures/Command')
const { MessageEmbed } = require('discord.js')

class Suggestion extends Command {
  constructor(...args) {
    super(...args, {
      description: language => language.get('suggestionDescription'),
      usage: language => language.get('suggestionUsage'),
      aliases: ['suggest'],
      cooldown: 60,
      botPermissions: ['EMBED_LINKS']
    })
  }

  async run(ctx, args) {
    if (!args.length) {
      const embed = new MessageEmbed()
        .setColor(this.client.constants.color)
        .setAuthor(ctx.author.username, ctx.author.displayAvatarURL({ size: 64, dynamic: true }))
        .setDescription(ctx.language.get('suggestionPrompt'))
        .setTimestamp()

      const filter = msg => msg.author.id === ctx.author.id
      const response = await ctx.message.awaitReply('', filter, 60000, embed)
      if (!response) return ctx.reply(ctx.language.get('noReplyTimeout', 60))

      if (response.toLowerCase()) {
        return ctx.reply(ctx.language.get('suggestionSuccess', ctx))
      } else if (['cancel'].includes(response)) {
        return ctx.reply(ctx.language.get('operationCancelled'))
      } else {
        return ctx.reply(ctx.language.get('suggestionInvalid'))
      }
    }

    await this.client.shard.broadcastEval(`
    (async () => {
      const channel = this.channels.cache.get('735638790621757461')
      if (channel) {
        const { MessageEmbed } = require('discord.js')

        const embed = new MessageEmbed()
        .setColor(this.client.constants.color)
        .setTitle('${ctx.language.get('suggestionTitle')}')
        .setDescription('${args.join(' ')}')
        .setThumbnail('${ctx.author.displayAvatarURL({ size: 512, dynamic: true })}')
        .setAuthor('${ctx.author.tag}', '${ctx.author.displayAvatarURL({ size: 128, dynamic: true })}')
        .setFooter('${ctx.language.get('suggestionFooter', ctx.author.id)}')
  
      const message = await channel.send({ embed })
      await message.react(this.constants.reactions.success)
      await message.react(this.constants.reactions.error)
      }
    })()
    `)

    return ctx.reply(ctx.language.get('suggestionSubmitted'))
  }
}

module.exports = Suggestion
