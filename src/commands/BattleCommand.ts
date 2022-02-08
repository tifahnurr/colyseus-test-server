/* eslint-disable max-classes-per-file */
/* eslint-disable import/prefer-default-export */

import { Command } from '@colyseus/command';
import { Room } from 'colyseus';
import BattleSchema from '../schemas/BattleSchema';
import LaserSchema from '../schemas/LaserSchema';
import PlayerSchema from '../schemas/PlayerSchema';
import StarSchema from '../schemas/StarSchema';
import { Vector2DSchema, Velocity } from '../schemas/Util';

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

interface Laser {
  laserId: number;
}

interface WithRoom {
  room: Room;
}

interface HP {
  hp: number;
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

export class OnPlayerGameOver extends Command<BattleSchema, Session> {
  execute({sessionId}: Session) {
    const player = this.state.players.get(sessionId);
    const id = player?.id || 0;
    if (!player) {
      return;
    }
    this.state.players.delete(sessionId);
    this.room.broadcast('despawn', id);
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
    player.score = 0;
    player.position.assign({ x, y });
    player.hp = 100;
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

export class OnStarSpawn extends Command<
  BattleSchema,
  Map<number, number>
> {
  execute(starSpawnedTime: Map<number, number>) {
    const star = new StarSchema();
    const id = (Math.floor(Math.random() * 1e5) + Date.now()) % 65000;
    star.id = id;
    star.position.assign({x: Math.floor(Math.random() * Math.pow(2, 12)), y: Math.floor(Math.random() * Math.pow(2, 12))});
    star.isDespawned = false;
    this.state.stars.set(String(id), star);
    starSpawnedTime.set(id, Date.now());
    // setTimeout(() => {
    //   star.isDespawned = true
    //   this.state.stars.delete(String(id));
    // }, 10000);
  }
}

export class ClearStar extends Command<
  BattleSchema,
  Map<number, number>
> {
  execute(starSpawnedTime: Map<number, number>) {
    this.state.stars.forEach((star) => {
      if (Date.now() - starSpawnedTime.get(star.id) >= 10000) {
        star.isDespawned = true;
        this.state.stars.delete(String(star.id));
        starSpawnedTime.delete(star.id);
      }
    })
  }
}

export class UpdatePlayerHp extends Command<
  BattleSchema,
  Map<number, number>
> {
  execute(lastPlayerUpdateHp: Map<number, number>) {
    this.state.players.forEach((player) => {
      if (lastPlayerUpdateHp.get(player.id)) {
        if (Date.now() - lastPlayerUpdateHp.get(player.id) >= 3000) {
          player.hp -= 3;
          lastPlayerUpdateHp.set(player.id, Date.now());
          if (player.hp <= 0) {
            player.hp = 0;
            this.room.broadcast('despawn', player.id);
          }
        }
      } else {
        lastPlayerUpdateHp.set(player.id, Date.now());
      }
    })
  }
}

export class OnStarCollected extends Command<
  BattleSchema,
  Session & ID
> {
  execute({ sessionId, id }: Session & ID) {
    const player = this.room.state.players.get(sessionId) as PlayerSchema;
    const star = this.room.state.stars.get(String(id)) as StarSchema;
    if (!player || !star) {
      return;
    }
    if (!star.isDespawned) {
      // this.state.stars.delete(String(id));
      star.isDespawned = true;
      player.score += 50;
      this.state.stars.delete(String(id));
    }
  }
}

export class OnPlayerCollision extends Command<
  BattleSchema,
  Session & ID
> {
  execute({sessionId, id}: Session & ID) {
    const playerA = this.room.state.players.get(sessionId) as PlayerSchema;
    if (!playerA) {
      return;
    }
    this.state.players.delete(sessionId);
    this.room.broadcast('despawn', id);
    this.room.broadcast('despawn', playerA.id);
  }
}

export class OnPlayerShoot extends Command<
  BattleSchema,
  Session & ID & Partial<Velocity>
> {
  execute({sessionId, id, x, y}: Session & ID & Partial<Velocity>) {
    const laser = new LaserSchema();
    const player = this.state.players.get(sessionId) as PlayerSchema;
    if (!laser || !player) {
      return;
    }
    laser.id = id;
    laser.origin.assign(player.position);
    laser.velocity.assign({ x });
    laser.velocity.assign({ y });
    laser.playerId = player.id;
    this.state.lasers.set(String(laser?.id), laser);

    setTimeout(() => {
      this.state.lasers.delete(String(laser?.id));
    }, 1000)
  }
}

export class OnLaserHit extends Command<
  BattleSchema,
  Session & ID & Laser
> {
  execute({ sessionId, id, laserId }: Session & ID & Laser) {
    const laser = this.room.state.lasers.get(String(laserId)) as LaserSchema;
    let playerShoot: PlayerSchema = this.state.players.get(sessionId);
    let playerHit: PlayerSchema;
    if (!laser) return;
    this.state.players.forEach((p) => {
      if (p.id === id) {
        playerHit = p;
      }
    })
    if (!playerShoot || !playerHit) return;
    if (!laser.isDespawned) {
      // this.state.stars.delete(String(id));
      laser.isDespawned = true;
      this.state.lasers.delete(String(id));
      playerHit.hp -= 10;
      playerShoot.score += 20;
    }
  }
}

export class OnUpdateHp extends Command<
  BattleSchema,
  Session & HP
> {
  execute({ sessionId, hp }: Session & HP) {
    const player = this.state.players.get(sessionId) as PlayerSchema;
    if (!player) {
      return;
    }
    player.hp = hp;
  }
}