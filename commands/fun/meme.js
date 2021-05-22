const Command = require('#structures/Command')
const { MessageEmbed } = require('discord.js')

class Meme extends Command {
  constructor(...args) {
    super(...args, {
      description: language => language.get('memeDescription'),
      cooldown: 5,
      cost: 5,
      aliases: ['memes', 'dankmemes'],
      botPermissions: ['EMBED_LINKS']
    })
  }

  async run(ctx) {
    const { url, post: { title, subreddit, link, upvotes, author, comments } } = await this.client.ksoft.images.reddit(this.client.utils.random(this.client.constants.subreddits.memes), { span: 'week' })

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

module.exports = Meme
