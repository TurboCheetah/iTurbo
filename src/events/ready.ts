import { Discord, ArgsOf, Once } from 'discordx'
import { Logger } from '#utils/Logger'
import { IslaClient } from '#/Client'

@Discord()
export abstract class ReadyEvent {
    @Once('ready')
    async ready([_client]: ArgsOf<'ready'>, client: IslaClient): Promise<void> {
        // init all applicaiton commands
        await client.initApplicationCommands()

        // init permissions; enabled log to see changes
        await client.initApplicationPermissions(true)

        client.user?.setActivity('anime', { type: 'WATCHING' })

        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        Logger.success(`${client.user?.tag} serving ${((await client.shard?.fetchClientValues('guilds.cache.size')) as number[]).reduce((acc, guildCount) => acc + guildCount, 0)} guilds`)
    }
}
