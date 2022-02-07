import { OnPlayerMove, OnPlayerSpawn, OnStarCollected, OnPlayerCollision, OnPlayerShoot, OnLaserHit, OnPlayerGameOver } from './../commands/BattleCommand';
import { Dispatcher } from '@colyseus/command';
import { Room, Client } from 'colyseus';

export default class BattleMode {
  constructor(private room: Room, private dispacther: Dispatcher) {
    this.room.onMessage('spawn', this.OnSpawn.bind(this));
    this.room.onMessage('move', this.OnMove.bind(this));
    this.room.onMessage('gameover', this.OnGameOver.bind(this));
    this.room.onMessage('starCollected', this.OnStarCollected.bind(this));
    this.room.onMessage('playerCollision', this.OnPlayerCollision.bind(this));
    this.room.onMessage('shoot', this.OnPlayerShoot.bind(this));
    this.room.onMessage('laserHit', this.OnLaserHit.bind(this))
    // this.room.onMessage('ping', this.OnPlayerPing.bind(this));
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

  OnGameOver(client: Client) {
    const { sessionId } = client;
    this.dispacther.dispatch(new OnPlayerGameOver(), { sessionId });
  }

  OnStarCollected(client: Client, msg: {id: number}) {
    const { sessionId } = client;
    this.dispacther.dispatch(new OnStarCollected(), {
      sessionId,
      ...msg
    })
  }

  OnPlayerCollision(client: Client, msg: {id: number}) {
    const { sessionId } = client;
    this.dispacther.dispatch(new OnPlayerCollision(), {
      sessionId,
      ...msg
    })
  }

  OnPlayerShoot(client: Client, msg: {id: number, x: number, y: number}) {
    const { sessionId } = client;
    this.dispacther.dispatch(new OnPlayerShoot(), {
      sessionId,
      ...msg
    })
  }

  OnLaserHit(client: Client, msg: {id: number}) {
    const { sessionId } = client;
    this.dispacther.dispatch(new OnLaserHit(), {
      sessionId,
      ...msg
    })
  }

  OnUpdateHp(client: Client, msg: {hp: number}) {

  }
  // OnPlayerPing(client: Client, msg: {lastPing: number, currentRTT: number}) {
  //   console.log('msg received');
  //   client.send('pong', msg);
  // }
}
