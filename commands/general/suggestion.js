const Command = require('#structures/Command')
const { MessageEmbed } = require('discord.js')

class Suggestion extends Command {
  constructor(...args) {
    super(...args, {
      description: 'Got a suggestion to improve the bot? Submit it using this command.',
      usage: 'suggestion <idea>',
      aliases: ['suggest'],
      cooldown: 60,
      botPermissions: ['EMBED_LINKS']
    })
  }

  async run(ctx, args) {
    if (!args.length) {
      const embed = new MessageEmbed()
        .setAuthor(ctx.author.username, ctx.author.displayAvatarURL({ size: 64, dynamic: true }))
        .setDescription('What would you like to suggest?\n\nReply with `cancel` to cancel the operation. The message will timeout after 60 seconds.')
        .setTimestamp()
        .setColor(0x9590ee)

      const filter = msg => msg.author.id === ctx.author.id
      const response = await ctx.message.awaitReply('', filter, 60000, embed)
      if (!response) return ctx.reply('No reply within 60 seconds. Time out.')

      if (response.toLowerCase()) {
        return ctx.reply(`Your idea has been successfully submitted${ctx.guild && ctx.guild.id !== this.client.constants.mainGuildID ? ' to the support server' : ''}.`)
      } else if (['cancel'].includes(response)) {
        return ctx.reply('Operation cancelled.')
      } else {
        return ctx.reply('Invalid response, please try again.')
      }
    }

    await this.client.shard.broadcastEval(`
    (async () => {
      const channel = this.channels.cache.get('735638790621757461')
      if (channel) {
        const { MessageEmbed } = require('discord.js')

        const embed = new MessageEmbed()
        .setTitle('New Suggestion')
        .setDescription('${args.join(' ')}')
        .setColor(0x9590ee)
        .setThumbnail('${ctx.author.displayAvatarURL({ size: 512, dynamic: true })}')
        .setAuthor('${ctx.author.tag}', '${ctx.author.displayAvatarURL({ size: 512, dynamic: true })}')
        .setFooter('User ID: ${ctx.author.id}')
  
      const message = await channel.send({ embed })
      await message.react(this.constants.reactions.success)
      await message.react(this.constants.reactions.error)
      }
    })()
    `)

    return ctx.reply(`Your idea has been successfully submitted${ctx.guild && ctx.guild.id !== this.client.constants.mainGuildID ? ' to the support server' : ''}.`)
  }
}

module.exports = Suggestion
