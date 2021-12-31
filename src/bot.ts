import 'reflect-metadata'
import * as dotenv from 'dotenv'
import { IslaClient } from '#/Client'
import { NotABot } from '#guards/NotABot'
import { Intents } from 'discord.js'
import { join } from 'path'

dotenv.config({ path: join(__dirname, '/../.env') })
process.env.NODE_ENV ??= 'development'
process.on('unhandledRejection', (err: Error) => console.error(err))

const client = new IslaClient({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
    botGuilds: process.env.NODE_ENV === 'development' ? [String(process.env.DEV_GUILD) ?? ''] : undefined,
    guards: [NotABot]
})

client.launch()
