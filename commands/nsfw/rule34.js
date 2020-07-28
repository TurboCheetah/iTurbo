const Command = require("../../structures/Command.js");
const fetch = require("node-fetch");
const { MessageEmbed } = require("discord.js");
const { posts } = require("rule34js");
const { shorten } = require("../../utils/Utils.js")

class Rule34 extends Command {
  constructor(...args) {
    super(...args, {
      description: "Returns a random reddit post.",
      usage: "rule34 [search]",
      aliases: ["r34"],
      cooldown: 3,
      cost: 3,
      nsfw: true,
    });

    this.errorMessage = "There was an error.";
  }

  async run(ctx, query) {
      const search = query.join('_').split('_|_');
      var data = await posts({tags:search})
      const random = Math.floor(Math.random() * data.posts.length);
    
    if(!ctx.channel.nsfw) {
      return ctx.reply("The result I found was NSFW and I cannot post it in this channel.");
    }

    if (!data.posts||data.posts[random] == undefined) {
      return ctx.reply('No results were found.');
    }

    if (data.posts[random].file_url.endsWith('webm')) {
      return ctx.reply(`Score: ${data.posts[random].score}\n${data.posts[random].file_url}`);
    }

    const embed = new MessageEmbed()
    .setTitle(`Score: ${data.posts[random].score}`)
    .addField(`Tags`, shorten(data.posts[random].tags))
    .setURL(data.posts[random].file_url)
    .setColor(0x9590EE)
    .setImage(data.posts[random].file_url)
    .setFooter(`Requested by: ${ctx.author.tag} | Powered by Rule34.XXX`, ctx.author.displayAvatarURL({ size: 32 }));
    return ctx.reply({ embed });
  }
}

module.exports = Rule34;
