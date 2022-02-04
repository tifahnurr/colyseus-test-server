import { Client } from 'colyseus';
import { Dispatcher } from '@colyseus/command';
import BattleSchema from '../schemas/BattleSchema';
import { OnPlayerJoin, OnPlayerLeave, OnStarSpawn, ClearStar } from '../commands/BattleCommand';
import BattleMode from '../gamemodes/BattleMode';
import PingRoom from './PingRoom';

export default class BattleRoom extends PingRoom<BattleSchema> {
  dispacther = new Dispatcher(this);

  game: BattleMode;

  starSpawnedTime: Map<number, number>;

  clearCount: number;

  onCreate(options: any) {
    super.onCreate(options);
    this.starHearthbeat();
    this.setState(new BattleSchema());
    this.setPatchRate(50);
    this.game = new BattleMode(this, this.dispacther);
    this.starSpawnedTime = new Map();
    this.clearCount = 0;
    this.startUpdateStar();
  }

  onJoin(client: Client) {
    console.log(
      'Join',
      this.clients.map((c) => c.sessionId),
    );
    this.dispacther.dispatch(new OnPlayerJoin(), client);
  }

  async onLeave(client: Client, consented: boolean) {

    // this.state.players.get(client.sessionId).connected = false;
    console.log("player leave");
    try {
      if (consented) {
          throw new Error("consented leave");
      }

      // allow disconnected client to reconnect into this room until 20 seconds
      await this.allowReconnection(client, 20);
      console.log("reconnected");

      // client returned! let's re-activate it.
      // this.state.players.get(client.sessionId).connected = true;

    } catch (e) {
      this.dispacther.dispatch(new OnPlayerLeave(), {
        sessionId: client.sessionId,
        room: this,
      });
    }

  }

  startUpdateStar() {
    this.clock.setInterval(() => {
      for (let i = 0; i < Math.floor(Math.random() * 25) + 20; i++) {
        this.dispacther.dispatch(new OnStarSpawn(), this.starSpawnedTime)
      }
      this.clearCount++;
      if (this.clearCount > 2) {
        this.dispacther.dispatch(new ClearStar(), this.starSpawnedTime)
        this.clearCount = 0;
      }
    }, 500);
  }
}
