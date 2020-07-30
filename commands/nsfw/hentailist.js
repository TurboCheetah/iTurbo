const Command = require("../../structures/Command.js");
const fetch = require("node-fetch");
const { MessageEmbed } = require("discord.js");

class HentaiList extends Command {
  constructor(...args) {
    super(...args, {
      description: "Search for hentai on HentaiList",
      usage: "hentailist <hentai>",
      aliases: ["hl", "hlist"],
      cooldown: 5,
      cost: 5,
      nsfw: true
    });
  }

  async run(ctx, args) {
    if (!args.length) return ctx.reply("What am I supposed to search for?");
    var args = args.join('-').toString().split('-')[0];
    
    var data = await fetch(`http://localhost:4445/api/hanime/${encodeURIComponent(args)}`)
      .then((r) => r.ok ? r.json() : '');

    if (!data) return ctx.reply("No results found.");

    if (isNaN(parseInt(args))) {
      data = data[0];
    }

    var tags = [];
    for (var i = 0; i < data.tags.length; i++) {
      tags[i] = data.tags[i];
    }

    const embed = new MessageEmbed()
      .setColor(0x9590EE)
      .setTitle(data.name)
      .setURL(data.url)
      .setThumbnail(data.cover_url)
      .setImage(data.poster_url)
      .addField(`Description`, data.description ? this.client.utils.shorten(data.description.replace(/(<([^>]+)>)/ig, '').replace(/\/r/g, '').replace(/\/n/g, '')) : 'No description given.')
      .addField(`Release Date`, data.released_at.slice(0, 10), true)
      .addField(`Producer`, data.brand)
      .addField(`Views`, data.views, true)
      .addField(`Likes`, data.likes, true)
      .addField(`Interests`, data.interests, true)
      .addField(`Tags`, `\`\`\`${tags.join(', ')}\`\`\``)
      .setFooter(`ID: ${data.id} | Requested by: ${ctx.author.tag} | Powered by HAnime.tv`, ctx.author.displayAvatarURL({ size: 32 }))

    return ctx.reply({ embed });
  }
}

module.exports = HentaiList;
