import { Client, ClientOptions } from 'discordx'
import Anilist from 'anilist-node'
import { KSoftClient } from '@ksoft/api'
import { API } from 'nhentai'
import Taihou from 'taihou'
import { Api as Osu } from 'node-osu'
import { TraceMoe } from 'trace.moe.ts'
import { Constants } from '#utils/Constants'
import { Utils } from '#utils/Utils'
import { importx } from '@discordx/importer'
import path from 'path'

export class IslaClient extends Client {
    public anilist: Anilist
    public ksoft: KSoftClient
    public nhentai: API
    public taihou: typeof Taihou
    public osu: Osu
    public trace: TraceMoe
    public utils = Utils
    public constants: typeof Constants

    constructor(options: ClientOptions) {
        super(options)

        this.anilist = new Anilist(process.env.ANILIST_TOKEN)
        this.ksoft = new KSoftClient(process.env.KSOFT_TOKEN as string)
        this.nhentai = new API()
        this.taihou = new Taihou(process.env.WEEBSH_TOKEN, true, { userAgent: 'iTurbo/3.0.0' })
        this.osu = new Osu(process.env.OSU_API as string, { completeScores: true })
        this.trace = new TraceMoe()
        this.constants = Constants
    }

    async launch(): Promise<this> {
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        await importx(path.join(__dirname, '/{events,commands}/**/*.{ts,js}'))
        await this.login(process.env.NODE_ENV === 'development' ? process.env.DEV_TOKEN ?? '' : process.env.TOKEN ?? '')

        return this
    }
}
