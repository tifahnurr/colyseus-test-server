import { OnPlayerMove, OnPlayerSpawn } from './../commands/BattleCommand';
import { Dispatcher } from '@colyseus/command';
import { Room, Client } from 'colyseus';

export default class BattleMode {
  constructor(private room: Room, private dispacther: Dispatcher) {
    this.room.onMessage('spawn', this.OnSpawn.bind(this));
    this.room.onMessage('move', this.OnMove.bind(this));
  }

  OnSpawn(client: Client, msg: { x: number; y: number; id: number }) {
    const { sessionId } = client;
    this.dispacther.dispatch(new OnPlayerSpawn(), {
      sessionId,
      ...msg,
      angle: 0,
    });
  }

  OnMove(client: Client, msg: { x: number; y: number; angle: number }) {
    const { sessionId } = client;
    this.dispacther.dispatch(new OnPlayerMove(), { sessionId, ...msg });
  }
}
