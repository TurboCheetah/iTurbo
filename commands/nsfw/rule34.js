const Command = require('../../structures/Command.js')
const { MessageEmbed } = require('discord.js')
const booru = require('booru')
const { shorten } = require('../../utils/Utils.js')

class Rule34 extends Command {
  constructor(...args) {
    super(...args, {
      description: "Rule 34: If it exists there's porn of it.",
      usage: 'rule34 [search]',
      aliases: ['r34'],
      cooldown: 3,
      cost: 3,
      nsfw: true,
      botPermissions: ['EMBED_LINKS']
    })

    this.errorMessage = 'There was an error.'
  }

  async run(ctx, query) {
    const search = query.join('_').split('_|_')
    const [posts] = await booru.search('rule34', search, { limit: 1, random: true })

    if (!ctx.channel.nsfw) {
      return ctx.reply('The result I found was NSFW and I cannot post it in this channel.')
    }

    if (!posts || !posts.data.file_url) return ctx.reply('No results were found.')

    if (posts.data.file_url.endsWith('webm')) {
      return ctx.reply(`Score: ${posts.data.score}\n${posts.data.file_url}`)
    }

    const embed = new MessageEmbed()
      .setTitle(`Score: ${posts.data.score}`)
      .addField('Tags', shorten(posts.data.tags))
      .setURL(posts.data.postView)
      .setColor(0x9590ee)
      .setImage(posts.data.file_url)
      .setFooter('Powered by Rule34.XXX', ctx.author.displayAvatarURL({ size: 32, dynamic: true }))
    return ctx.reply({ embed })
  }
}

module.exports = Rule34
