import 'reflect-metadata'
import path from 'path'
import { Intents } from 'discord.js'
import { Client } from 'discordx'
import Manager from './Manager'
import Anilist from 'anilist-node'
import { KSoftClient } from '@ksoft/api'
import { API } from 'nhentai'
import { NotABot } from './guards/NotABot'
import { Constants } from './utils/constants'

export class IslaClient extends Client {
  public anilist: Anilist
  public ksoft: KSoftClient
  public nhentai: API
  public cluster?: Manager
  public constants: typeof Constants

  constructor() {
    super({
      intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
      classes: [path.join(__dirname, 'commands', '**/*.{ts,js}'), path.join(__dirname, 'events', '**/*.{ts,js}')],
      botGuilds: process.env.NODE_ENV === 'development' ? [String(process.env.DEV_GUILD) ?? ''] : undefined,
      silent: true,
      guards: [NotABot]
    })

    this.anilist = new Anilist(process.env.ANILIST_TOKEN)
    this.ksoft = new KSoftClient(process.env.KSOFT_TOKEN as string)
    this.nhentai = new API()
    this.constants = Constants
  }
}
