import { Room, Client } from 'colyseus';
import { Dispatcher } from '@colyseus/command';
import BattleSchema from '../schemas/BattleSchema';
import { OnPlayerJoin, OnPlayerLeave } from '../commands/BattleCommand';
import BattleMode from '../gamemodes/BattleMode';

export default class BattleRoom extends Room<BattleSchema> {
  dispacther = new Dispatcher(this);

  game: BattleMode;

  onCreate() {
    this.setState(new BattleSchema());
    this.setPatchRate(1000 / 25);

    this.game = new BattleMode(this, this.dispacther);
  }

  onJoin(client: Client) {
    console.log(
      'Join',
      this.clients.map((c) => c.sessionId),
    );
    this.dispacther.dispatch(new OnPlayerJoin(), client);
  }

  onLeave(client: Client) {
    this.dispacther.dispatch(new OnPlayerLeave(), {
      sessionId: client.sessionId,
      room: this,
    });
  }
}
