import { importx } from '@discordx/importer'
import { BaseCluster } from 'kurasuta'
import path from 'path'

export default class Manager extends BaseCluster {
  async launch(): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    await importx(path.join(__dirname, '/{events,commands}/**/*.{ts,js}'))
    await this.client.login(process.env.NODE_ENV === 'development' ? process.env.DEV_TOKEN ?? '' : process.env.TOKEN ?? '')
  }
}
