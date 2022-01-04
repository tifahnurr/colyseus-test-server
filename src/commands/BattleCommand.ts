/* eslint-disable max-classes-per-file */
/* eslint-disable import/prefer-default-export */

import { Command } from '@colyseus/command';
import { Room } from 'colyseus';
import BattleSchema from '../schemas/BattleSchema';
import PlayerSchema from '../schemas/PlayerSchema';
import { Vector2DSchema } from '../schemas/Util';

interface Session {
  sessionId: string;
}

interface Transform {
  x: number;
  y: number;
  angle: number;
}

interface ID {
  id: number;
}

interface WithRoom {
  room: Room;
}

export class OnPlayerJoin extends Command<BattleSchema, Session> {
  execute({ sessionId }: Session) {
    const player = new PlayerSchema();
    player.id = 0;
    this.state.players.set(sessionId, player);
  }
}

export class OnPlayerLeave extends Command<BattleSchema, Session & WithRoom> {
  execute({ sessionId, room }: Session & WithRoom) {
    const player = this.state.players.get(sessionId);
    const id = player?.id || 0;
    if (!player) {
      return;
    }
    this.state.players.delete(sessionId);
    room.broadcast('despawn', id);
  }
}

export class OnPlayerSpawn extends Command<
  BattleSchema,
  Session & Transform & ID
> {
  execute({ sessionId, x, y, id }: Session & Transform & ID) {
    const player = this.room.state.players.get(sessionId) as PlayerSchema;
    if (!player) {
      return;
    }
    player.id = id;
    player.isSpawned = true;
    player.position.assign({ x, y });
  }
}

export class OnPlayerMove extends Command<
  BattleSchema,
  Session & Partial<Transform>
> {
  execute({ sessionId, x, y, angle }: Session & Partial<Transform>) {
    const player = this.room.state.players.get(sessionId) as PlayerSchema;
    if (!player) {
      return;
    }

    if (x !== undefined) {
      player.position.assign({ x });
    }

    if (y !== undefined) {
      player.position.assign({ y });
    }

    if (angle !== undefined) {
      player.assign({ angle });
    }
  }
}
