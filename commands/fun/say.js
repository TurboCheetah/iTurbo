const Command = require("../../structures/Command.js");

class Say extends Command {
  constructor(...args) {
    super(...args, {
      aliases: ["echo", "talk", "repeat"],
      description: "I will say whatever you want me to.",
      usage: "say <message>"
    });
  }

  async run(ctx, args) {
    if(!args.length) return ctx.reply("What do you want me to say?");
    if(ctx.message.deletable) await ctx.message.delete().catch(() => null);
    return ctx.reply(args.join(" "), { disableMentions: "all" });
  }
}

module.exports = Say;
