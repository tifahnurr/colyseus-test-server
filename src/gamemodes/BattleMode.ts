import { Dispatcher } from '@colyseus/command';
import { Room, Client } from 'colyseus';
import PlayerSchema from '../schemas/PlayerSchema';

export default class BattleMode {
  constructor(private room: Room, private dispacther: Dispatcher) {
    this.room.onMessage('spawn', this.OnSpawn.bind(this));
    this.room.onMessage('move', this.OnMove.bind(this));
  }

  OnSpawn(client: Client, msg: {x: number, y: number, id: number}) {
    const { sessionId } = client;
    const player = this.room.state.players.get(sessionId) as PlayerSchema;

    if (!player) { return; }
    const { x, y, id } = msg;

    player.id = id;
    player.isSpawned = true;
    player.position.assign({ x, y });
  }

  OnMove(client: Client, msg: {x: number, y: number, angle: number}) {
    const { sessionId } = client;
    const player = this.room.state.players.get(sessionId) as PlayerSchema;

    if(msg.x !== undefined) {
      player.position.assign({x: msg.x});
    }

    if(msg.y !== undefined) {
      player.position.assign({y: msg.y});
    }

    if(msg.angle !== undefined) {
      player.assign({ angle: msg.angle });
    }
    
  }
}
