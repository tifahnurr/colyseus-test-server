/* eslint-disable max-classes-per-file */
/* eslint-disable import/prefer-default-export */

import { Command } from '@colyseus/command';
import { Room } from 'colyseus';
import BattleSchema from '../schemas/BattleSchema';
import PlayerSchema from '../schemas/PlayerSchema';
import { Vector2DSchema } from '../schemas/Util';

interface Session {
  sessionId: string,
}

export class OnPlayerJoin extends Command<BattleSchema, Session> {
  execute({ sessionId }: Session) {
    const player = new PlayerSchema();
    player.id = 0;
    this.state.players.set(sessionId, player);
  }
}

interface RoomSession extends Session {
  room: Room
}

export class OnPlayerLeave extends Command<BattleSchema, RoomSession> {
  execute({ sessionId, room }: RoomSession) {
    const player = this.state.players.get(sessionId);
    const id = player?.id || 0;
    if(!player) { return; }
    this.state.players.delete(sessionId);
    room.broadcast('leave', id);
  }
}
