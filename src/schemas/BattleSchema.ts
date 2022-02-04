import { MapSchema, Schema, type } from '@colyseus/schema';
import LaserSchema from './LaserSchema';
import PlayerSchema from './PlayerSchema';
import StarSchema from './StarSchema';

export default class BattleSchema extends Schema {
  @type({ map: PlayerSchema })
  players = new MapSchema<PlayerSchema>();

  @type({ map: StarSchema })
  stars = new MapSchema<StarSchema>();

  @type({ map: LaserSchema})
  lasers = new MapSchema<LaserSchema>();
}
