import { BaseCluster, ShardingManager } from 'kurasuta'
import { Bot } from './Client'

export default class Manager extends BaseCluster {
  public client!: Bot

  constructor(...args: [ShardingManager]) {
    super(...args)

    this.client.cluster = this
  }

  async launch(): Promise<void> {
    this.client.init()
  }
}
