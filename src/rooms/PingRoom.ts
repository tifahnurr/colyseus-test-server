import { PingMetadata } from './../metadatas/PingMeta';
import { Client, Delayed, Presence, Room } from 'colyseus';
import { getMeta, setMeta } from '../utils/MetaTool';

export default class PingRoom<
  State = any,
  Metadata extends Partial<PingMetadata> = Partial<PingMetadata>,
> extends Room<State, Metadata> {
  protected maxPing = 5000;

  protected delayedPing?: Delayed;

  protected delayedCalcPing?: Delayed;

  constructor(presence?: Presence) {
    super(presence);
  }

  onCreate(options: any): void | Promise<any> {
    this.setMetadata({});
    this.metadata.ping = 0;
    this.listenPingPong();
  }

  protected starHearthbeat(
    pingInterval = this.maxPing,
    calInterval = this.maxPing,
  ) {
    this.delayedPing?.clear();
    this.delayedPing = this.clock.setInterval(
      this.sendPing.bind(this),
      pingInterval,
    );

    this.delayedCalcPing?.clear();
    this.delayedCalcPing = this.clock.setInterval(
      this.calcAveragePing.bind(this),
      calInterval,
    );
  }

  private listenPingPong() {
    this.onMessage('ping', this.onPing.bind(this));
    this.onMessage('pong', this.onPong.bind(this));
  }

  onPing(client: Client, message: any) {
    client.send('pong', message);
  }

  onPong(client: Client, message: number) {
    if (client.userData === undefined) {
      client.userData = {};
    }

    const pong = getMeta<number>(client.userData, 'pong', -1);
    if (pong > message) {
      // return unorder message
      return;
    }

    const delta = this.clock.currentTime - message; // ms
    setMeta(client.userData, 'ping', delta);
    setMeta(client.userData, 'pong', message);

    if (delta > this.maxPing) {
      this._events?.emit('ping-timeout', client, delta);
    }
  }

  protected calcAveragePing() {
    const { metadata } = this;

    const total = this.clients.reduce((total, client) => {
      total += client.userData?.ping || 0;
      return total;
    }, 0);

    const average = this.clients.length ? total / this.clients.length : 0;
    if (metadata) {
      metadata.ping = average;
    }
  }

  protected sendPing() {
    this.broadcast('ping', this.clock.currentTime);
  }
}
