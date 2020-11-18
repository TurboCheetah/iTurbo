const Command = require('../../structures/Command.js')
const { MessageEmbed } = require('discord.js')

class Help extends Command {
  constructor (...args) {
    super(...args, {
      description: 'View help for commands.',
      usage: 'help [command]',
      botPermissions: ['EMBED_LINKS']
    })
  }

  async run (ctx, [command]) {
    const splitCategory = (embedObj, text, maxLen = 1024) => {
      if (text.length > maxLen) {
        for (let fieldNum = 1; fieldNum < Math.ceil(text.length / 1024); fieldNum++) {
          embedObj.addField('Continued', text.substr(text.substr(0, maxLen - 3).lastIndexOf(' ['), maxLen - 3))
        }
      }
    }

    const map = {} // Map<Category, Array<Command.Name>>
    for (const command of this.store.values()) {
      // Check for hidden commands first so if all commands in a category is hidden we won't even show the category.
      if (command.hidden) continue
      if (command.ownerOnly && ctx.author.id !== this.client.constants.ownerID) continue
      if (command.nsfw && !ctx.channel.nsfw) continue

      if (!map[command.category]) map[command.category] = []
      map[command.category].push(command.name)
    }

    // Sort the categories alphabetically.
    const keys = Object.keys(map).sort()

    if (command) {
      if (keys.includes(this.client.utils.toProperCase(command))) {
        const category = this.client.utils.toProperCase(command)
        const cmds = map[category].map(i => `[\`${i}\`](https://turbo.ooo '${this.store.get(i).description}${this.store.get(i).aliases.length > 0 ? `\nAliases: ${this.store.get(i).aliases.join(', ')}` : ''}')`).join(' ')
        const embed = new MessageEmbed()
          .setColor(0x9590EE)
          .setAuthor(`Help - ${category}`, this.client.user.displayAvatarURL({ size: 32 }))
          .setDescription(`For more information about a command run \`${ctx.guild ? ctx.guild.settings.prefix : '|'}help <command>\``)
          .addField('Commands', cmds.substr(0, cmds.substr(0, 1024 - 3).lastIndexOf(' [')))
          .setFooter(`Requested by ${ctx.author.tag} • Hover over commands for info!`, ctx.author.displayAvatarURL({ size: 32 }))
        splitCategory(embed, cmds, 1000)
        return ctx.reply({ embed })
      }

      const cmd = this.store.get(command)
      if (!cmd) return ctx.reply("That category/command does not exist! Why would you think I'd have such a thing?")

      let cost = 'Free'

      if (cmd.cost && (ctx.guild && ctx.guild.settings.social)) {
        const premium = await this.client.verifyPremium(ctx.author)

        if (premium) {
          // Premium users get a 25% off the cost.
          cost = `¥${cmd.cost - Math.floor(cmd.cost / 2 / 2)}`
        } else {
          cost = `¥${cmd.cost}`
        }
      }

      if (cmd.nsfw && (ctx.guild && !ctx.channel.nsfw)) { return ctx.reply("You can't view details of that command in a non NSFW channel.") }

      return ctx.reply(new MessageEmbed()
        .setTitle(`Help - ${cmd.name}`)
        .setColor(0x9590EE)
        .setAuthor(this.client.user.tag, this.client.user.displayAvatarURL({ size: 64 }))
        .setDescription([
          `**Description:** ${cmd.description}`,
          `**Category:** ${cmd.category}`,
          `**Aliases:** ${cmd.aliases.length ? cmd.aliases.join(', ') : 'None'}`,
          `**Cooldown:** ${cmd.cooldown ? cmd.cooldown + ' Seconds' : 'None'}`,
          `**Usage:** ${ctx.guild ? ctx.guild.settings.prefix : '|'}${cmd.usage}`,
          `**Cost:** ${cost}`,
          `**Extended Help:** ${cmd.extendedHelp}`
        ].join('\n')))
    }

    const embed = new MessageEmbed()
      .setColor(0x9590EE)
      // .setAuthor(this.client.user.tag, this.client.user.displayAvatarURL({ size: 64 }))
      .setAuthor('Help', this.client.user.displayAvatarURL({ size: 64 }))
      .setDescription(`For all commands in a category run \`${ctx.guild ? ctx.guild.settings.prefix : '|'}help <category>\`\nIf you need further help feel free to join the [support server](https://discord.gg/FFGrsWE).`)
      .addField('Available Categories', keys.map(key => `\`${key}\``).join(' '))
      .setImage('https://i.imgur.com/g3jV9fg.gif')
      .setFooter(`Requested by ${ctx.author.tag}`, ctx.author.displayAvatarURL({ size: 32 }))

    /*     for (const category of keys) {
          // Skip un-needed categories
          if (category === "Social" && ctx.guild && !ctx.guild.settings.social) continue;
          if (category === "Nsfw" && ctx.guild && !ctx.channel.nsfw) continue;
          embed.addField(category, `${map[category].map(i => `[\`${i}\`](https://turbo.ooo ${this.store.get(i).description})`).join(' ')}`);
        } */

    return ctx.reply({ embed })
  }
}

module.exports = Help
