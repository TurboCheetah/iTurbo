const Command = require('#structures/Command')
const { MessageEmbed } = require('discord.js')
const { Embeds, FieldsEmbed } = require('discord-paginationembed')

class Help extends Command {
  constructor(...args) {
    super(...args, {
      description: language => language.get('helpDescription'),
      usage: language => language.get('helpUsage'),
      botPermissions: ['EMBED_LINKS', 'ADD_REACTIONS']
    })
  }

  async run(ctx, [command, page = 1]) {
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
          .setPage(page)
          .setPageIndicator('footer', (page, pages) => ctx.language.get('page', page, pages))
          .formatField(ctx.language.get('helpCommands'), i => `• [**${i}**](https://docs.iturbo.cc/commands/${category.toLowerCase()}#${i} '${this.store.get(i).aliases.length > 0 ? `\n${ctx.language.get('helpCommandAliases', this.store.get(i).aliases.join(', '))}` : ''}') - ${this.store.get(i).description}`)

        Pagination.embed
          .setColor(this.client.constants.color)
          .setAuthor(ctx.language.get('helpCategory'), this.client.user.displayAvatarURL({ size: 128, dynamic: true }))
          .setDescription(ctx.language.get('helpCategoryDescription', ctx))
          .setFooter(ctx.language.get('requestedBy', ctx.author.tag), null)

        return Pagination.build()
      }

      const cmd = this.store.get(command.toLowerCase())
      if (!cmd) return ctx.reply(ctx.language.get('helpDoesNotExist'))

      let cost = ctx.language.get('helpCost')

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
        return ctx.reply(ctx.language.get('helpIsNSFW'))
      }

      const cmdArgs = []
      for (const [key, value] of Object.entries(cmd.arguments)) cmdArgs.push(`• \`${key}\` ${value}`)
      const cmdExamples = []
      for (const [key, value] of Object.entries(cmd.examples)) cmdExamples.push(`• \`${ctx.guild ? ctx.guild.settings.prefix : '|'}${cmd.name} ${key}\` ${value}`)

      const embed = new MessageEmbed()
        .setTitle(ctx.language.get('helpCommand', this.client.utils.toProperCase(cmd.name)))
        .setURL(`https://docs.iturbo.cc/commands/${cmd.category.toLowerCase()}#${cmd.name}`)
        .setColor(this.client.constants.color)
        .setDescription(cmd.description)
        .addField(ctx.language.get('helpCommandUsage'), `${ctx.guild ? ctx.guild.settings.prefix : '|'}${cmd.usage}`)
        .addField(ctx.language.get('helpCommandAliases'), cmd.aliases.length ? cmd.aliases.join(', ') : ctx.language.get('none'))
      // eslint-disable-next-line prettier/prettier
      embed.addField(ctx.language.get('helpCommandCategory'), cmd.category)
        .setFooter(`${ctx.language.get('helpCommandCost', cost)} • ${ctx.language.get('helpCommandCooldown', cmd.cooldown ? `${cmd.cooldown} Seconds` : ctx.language.get('none'))}`)

      if (cmd.extendedHelp !== ctx.language.get('helpNoExtendedHelp')) embed.addField(ctx.language.get('helpExtendedHelp'), cmd.extendedHelp)

      const examplesEmbed = new MessageEmbed()
        .setTitle(ctx.language.get('helpCommand', this.client.utils.toProperCase(cmd.name)))
        .setURL(`https://docs.iturbo.cc/commands/${cmd.category.toLowerCase()}#${cmd.name}`)
        .setColor(this.client.constants.color)
        .setFooter(`${ctx.language.get('helpCommandCost', cost)} • ${ctx.language.get('helpCommandCooldown', cmd.cooldown ? `${cmd.cooldown} Seconds` : ctx.language.get('none'))}`)

      if (cmdArgs.length) examplesEmbed.addField(ctx.language.get('helpCommandArguments'), cmdArgs.join('\n'))
      if (cmdExamples.length) examplesEmbed.addField(ctx.language.get('helpCommandExamples'), cmdExamples.join('\n'))

      const embeds = [embed, examplesEmbed]
      if (!cmdArgs.length && !cmdExamples.length) return ctx.reply({ embed })

      const Pagination = new Embeds()
        .setArray(embeds)
        .setAuthorizedUsers([ctx.author.id])
        .setChannel(ctx.channel)
        .setPage(page)
        .setDisabledNavigationEmojis(['delete'])
        .setPageIndicator('footer', (page, pages) => `${ctx.language.get('helpCommandCost', cost)} • ${ctx.language.get('helpCommandCooldown', cmd.cooldown ? `${cmd.cooldown} Seconds` : ctx.language.get('none'))} • ${ctx.language.get('page', page, pages)}`)

      return Pagination.build()
    }

    const embed = new MessageEmbed()
      .setColor(this.client.constants.color)
      .setAuthor(this.client.user.tag, this.client.user.displayAvatarURL({ size: 128, dynamic: true }))
      .setTitle(ctx.language.get('helpTitle'))
      .setURL('https://docs.iturbo.cc/commands')
      .setDescription(ctx.language.get('helpBaseDesc', ctx))
      .addField(ctx.language.get('helpBaseAvail'), keys.map(key => `[\`${key}\`](https://docs.iturbo.cc/commands/${key.toLowerCase()})`).join(' '))
      .setImage('https://i.imgur.com/g3jV9fg.gif')

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
