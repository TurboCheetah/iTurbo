const Command = require('#structures/Command')
const { MessageEmbed } = require('discord.js')

class RedditGif extends Command {
  constructor(...args) {
    super(...args, {
      description: language => language('redditGifDescription'),
      aliases: ['porngif', 'pgif', 'nsfwrgif', 'rnsfwgif', 'rgif'],
      cooldown: 3,
      cost: 15,
      nsfw: true,
      botPermissions: ['EMBED_LINKS']
    })
  }

  async run(ctx) {
    const { url, post: { title, subreddit, link, upvotes, author, comments } } = await this.client.ksoft.images.reddit(this.client.utils.random(this.client.constants.subreddits.gifs), { span: 'month' })

    const embed = new MessageEmbed()
      .setColor(this.client.constants.color)
      .setAuthor(author, undefined, `https://reddit.com${author}`)
      .setTitle(title)
      .setURL(link)
      .setFooter(`${subreddit} • 👍 ${upvotes} • 💬 ${comments}`)

    await ctx.reply({ embed })
    await ctx.reply(url)
  }
}

module.exports = RedditGif
