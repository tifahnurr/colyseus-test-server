/* eslint-disable import/prefer-default-export */

import { Command } from '@colyseus/command';
import BattleSchema from '../schemas/BattleSchema';

export class OnPlayerJoin extends Command<BattleSchema, object> {
  execute(obj: object) {
    this.state.players.set('test', obj);
  }
}
