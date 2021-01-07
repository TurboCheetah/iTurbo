const Command = require('../../structures/Command.js')
const { MessageEmbed } = require('discord.js')
const { FieldsEmbed } = require('discord-paginationembed')

class Help extends Command {
  constructor(...args) {
    super(...args, {
      description: 'View help for commands.',
      usage: 'help [category|command]',
      botPermissions: ['EMBED_LINKS']
    })
  }

  async run(ctx, [command]) {
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

        const Pagination = new FieldsEmbed()
          .setArray(map[category])
          .setAuthorizedUsers([ctx.author.id])
          .setChannel(ctx.channel)
          .setElementsPerPage(7)
          .setPage(1)
          .setPageIndicator('footer', (page, pages) => `Requested by ${ctx.author.tag} • Page ${page} of ${pages}`)
          .formatField('Commands', i => `• [**${i}**](https://docs.iturbo.cc/commands/${category.toLowerCase()}#${i} '${this.store.get(i).aliases.length > 0 ? `\nAliases: ${this.store.get(i).aliases.join(', ')}` : ''}') - ${this.store.get(i).description}`)

        Pagination.embed
          .setColor(0x9590ee)
          .setAuthor(`Help - ${category}`, this.client.user.displayAvatarURL({ size: 32 }))
          .setDescription(`For more information about a command run \`${ctx.guild ? ctx.guild.settings.prefix : '|'}help <command>\` or hover over it`)
          .setFooter(`Requested by ${ctx.author.tag}`, ctx.author.displayAvatarURL({ size: 64 }))

        return Pagination.build()
      }

      const cmd = this.store.get(command)
      if (!cmd) return ctx.reply("That category/command does not exist! Why would you think I'd have such a thing?")

      let cost = 'Free'

      if (cmd.cost && ctx.guild && ctx.guild.settings.social) {
        const premium = await this.client.verifyPremium(ctx.author)

        if (premium) {
          // Premium users get a 25% off the cost.
          cost = `¥${cmd.cost - Math.floor(cmd.cost / 2 / 2)}`
        } else {
          cost = `¥${cmd.cost}`
        }
      }

      if (cmd.nsfw && ctx.guild && !ctx.channel.nsfw) {
        return ctx.reply("You can't view details of that command in a non NSFW channel.")
      }

      return ctx.reply(
        new MessageEmbed()
          .setTitle(`Help - ${this.client.utils.toProperCase(cmd.name)}`)
          .setURL(`https://docs.iturbo.cc/commands/${cmd.category.toLowerCase()}#${cmd.name}`)
          .setColor(0x9590ee)
          .setAuthor(this.client.user.tag, this.client.user.displayAvatarURL({ size: 64 }))
          .setDescription([`**Description:** ${cmd.description}`, `**Category:** ${cmd.category}`, `**Aliases:** ${cmd.aliases.length ? cmd.aliases.join(', ') : 'None'}`, `**Cooldown:** ${cmd.cooldown ? cmd.cooldown + ' Seconds' : 'None'}`, `**Usage:** ${ctx.guild ? ctx.guild.settings.prefix : '|'}${cmd.usage}`, `**Cost:** ${cost}`, `**Extended Help:** ${cmd.extendedHelp}`].join('\n'))
      )
    }

    const embed = new MessageEmbed()
      .setColor(0x9590ee)
      .setAuthor(this.client.user.tag, this.client.user.displayAvatarURL({ size: 64 }))
      .setTitle('Help')
      .setURL('https://docs.iturbo.cc')
      .setDescription(`For all commands in a category run \`${ctx.guild ? ctx.guild.settings.prefix : '|'}help <category>\`\nIf you need further help feel free to join the [support server](https://discord.gg/011UYuval0uSxjmuQ).`)
      .addField('Available Categories', keys.map(key => `[\`${key}\`](https://docs.iturbo.cc/commands/${key.toLowerCase()})`).join(' '))
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
