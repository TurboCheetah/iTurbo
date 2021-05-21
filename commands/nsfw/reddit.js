const Command = require('#structures/Command')
const { MessageEmbed } = require('discord.js')

class Reddit extends Command {
  constructor(...args) {
    super(...args, {
      description: language => language.get('redditDescription'),
      usage: language => language.get('redditUsage'),
      aliases: ['porn', 'nsfwr', 'rnsfw'],
      cooldown: 3,
      cost: 15,
      nsfw: true,
      botPermissions: ['EMBED_LINKS']
    })
  }

  async run(ctx, [type]) {
    const subs = this.client.constants.subreddits
    if (!type || !['ass', 'boobs', 'thighs'].includes(type)) type = 'all'

    const { url, post: { title, subreddit, link, upvotes, author, comments } } = await this.client.ksoft.images.reddit(this.client.utils.random(type === 'all' ? [...subs.ass, ...subs.boobs, ...subs.thighs] : subs[type]), { span: 'month' })

    const embed = new MessageEmbed()
      .setColor(this.client.constants.color)
      .setAuthor(author, undefined, `https://reddit.com${author}`)
      .setTitle(title)
      .setURL(link)
      .setImage(url)
      .setFooter(`${subreddit} • 👍 ${upvotes} • 💬 ${comments}`)

    ctx.reply({ embed })
  }
}

module.exports = Reddit
