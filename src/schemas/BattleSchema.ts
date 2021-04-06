import { MapSchema, Schema, type } from '@colyseus/schema';
import PlayerSchema from './PlayerSchema';

export default class BattleSchema extends Schema {
  @type({ map: PlayerSchema })
  players = new MapSchema<PlayerSchema>();
}
