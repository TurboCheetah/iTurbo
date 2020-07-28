const Command = require("../../structures/Command.js");
const fetch = require("node-fetch");
const { MessageEmbed } = require("discord.js");

class Reddit extends Command {
  constructor(...args) {
    super(...args, {
      description: "Returns a random reddit post.",
      usage: "reddit",
      aliases: ["nsfwr", "rnsfw"],
      cooldown: 3,
      cost: 3,
      nsfw: true,
    });

    this.errorMessage = "There was an error. Reddit may be down, or the subreddit doesnt exist.";
  }

  async run(ctx) {
    const subreddits = ["nsfw", "boobs", "tits", "pussy", "palegirls", "adorableporn", "ass", "asiansgonewild", "gonewild", "bigtitssmallnip", "assvsboobs", "boobies", "bustypetite", "fantastictits", "onoff", "fortyfivefiftyfive", "grool", "juicyasians", "legalteens", "Nude_Selfie", "nude_snapchat", "petitegonewild", "rearpussy", "rosynips", "tiddies", "justhotwomen", "nsfwverifiedamateurs", "public"];
    const data = await fetch(`https://www.reddit.com/r/${this.client.utils.random(subreddits)}.json?limit=100&?sort=hot&t=all`)
      .then((res) => res.json())
      .then((body) => {
        if(body.error) throw this.errorMessage;
        return body.data.children;
      })
      .catch(() => { throw this.errorMessage; });
      
    const nsfwPost = this.client.utils.random(data).data;

    if(nsfwPost.over_18 && !ctx.channel.nsfw) {
      return ctx.reply("The result I found was NSFW and I cannot post it in this channel.");
    }

    const embed = new MessageEmbed()
    .setTitle(`r/${nsfwPost.subreddit} - ${nsfwPost.title}`)
    .setURL(`https://www.reddit.com/${nsfwPost.permalink}`)
    .setColor(0x9590EE)
    .setImage(nsfwPost.url)
    .setDescription(`:thumbsup: ${nsfwPost.ups} | :speech_balloon: ${nsfwPost.num_comments}`)
    .setFooter(`Requested by: ${ctx.author.tag} | Powered by Reddit`, ctx.author.displayAvatarURL({ size: 32 }));

    return ctx.reply({ embed });
  }
}

module.exports = Reddit;
