const Command = require('../../structures/Command.js')
const fetch = require('node-fetch')

class RedditGif extends Command {
  constructor (...args) {
    super(...args, {
      description: 'Returns a random reddit post.',
      usage: 'redditgif',
      aliases: ['nsfwrgif', 'rnsfwgif', 'rgif'],
      cooldown: 3,
      cost: 3,
      nsfw: true,
      botPermissions: ['EMBED_LINKS']
    })

    this.errorMessage = 'There was an error. Reddit may be down, or the subreddit doesnt exist.'
  }

  async run (ctx) {
    const subreddits = ['nsfw_gif', 'nsfw_gifs', 'porn_gifs', 'povjiggle', 'slowmojiggles', 'tittydrop', 'verticalgifs']
    const data = await fetch(`https://www.reddit.com/r/${this.client.utils.random(subreddits)}.json?limit=800&?sort=hot&t=all`)
      .then((res) => res.json())
      .then((body) => {
        if (body.error) throw this.errorMessage
        return body.data.children
      })
      .catch(() => { throw this.errorMessage })

    const nsfwPost = this.client.utils.random(data).data

    if (nsfwPost.over_18 && !ctx.channel.nsfw) {
      return ctx.reply('The result I found was NSFW and I cannot post it in this channel.')
    }

    // Broken due to RedGifs
    /*     const embed = new MessageEmbed()
    .setTitle(`r/${nsfwPost.subreddit} - ${nsfwPost.title}`)
    .setURL(`https://www.reddit.com/${nsfwPost.permalink}`)
    .setColor(0x9590EE)
    .setImage(nsfwPost.url)
    .setFooter(`Requested by: ${ctx.author.tag} • Powered by Reddit`, ctx.author.displayAvatarURL({ size: 32 }));

    return ctx.reply({ embed }); */
    return ctx.reply(`r/${nsfwPost.subreddit} - ${nsfwPost.title}\n${nsfwPost.url}`)
  }
}

module.exports = RedditGif
