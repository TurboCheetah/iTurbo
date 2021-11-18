import { BaseCluster, ShardingManager } from 'kurasuta'
import { IslaClient } from '#/Client'

export default class Manager extends BaseCluster {
  public client!: IslaClient

  constructor(...args: [ShardingManager]) {
    super(...args)

    this.client.cluster = this
  }

  async launch(): Promise<void> {
    this.client.login(process.env.NODE_ENV === 'development' ? process.env.DEV_TOKEN ?? '' : process.env.TOKEN ?? '')
  }
}
