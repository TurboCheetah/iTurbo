const Command = require('../../structures/Command.js')
const { MessageEmbed } = require('discord.js')
const fetch = require('node-fetch')

class Meme extends Command {
  constructor (...args) {
    super(...args, {
      description: 'Get a random meme from r/dankmemes',
      cooldown: 5,
      aliases: ['memes', 'dankmemes'],
      botPermissions: ['EMBED_LINKS']
    })
    this.cost = 5
  }

  async run (ctx) {
    const subs = ['dankmemes', 'me_irl']
    const search = ['hot', 'top']
    const { data: { children } } = await fetch(`https://www.reddit.com/r/${this.client.utils.random(subs)}/${this.client.utils.random(search)}.json?sort=top&t=day&limit=500`)
      .then((res) => res.json())
    const meme = this.client.utils.random(children).data

    const embed = new MessageEmbed()
      .setTitle(`r/${meme.subreddit} - ${meme.title}`)
      .setURL(`https://reddit.com${meme.source}`)
      .setColor(0x9590EE)
      .setImage(meme.url)
      .addField(':thumbsup: Upvotes', ` ${meme.ups}`, true)
      .addField(':thumbsdown: Downvotes', ` ${meme.downs}`, true)
      .addField(':speech_balloon: Comments', `${meme.num_comments}`, true)
      .setFooter(`Requested by: ${ctx.author.tag} • Powered by Reddit`, ctx.author.displayAvatarURL({ size: 32 }))
    return ctx.reply({ embed })
  }
}

module.exports = Meme
