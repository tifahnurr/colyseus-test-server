import { Schema, type } from '@colyseus/schema';
import { Vector2DSchema, Velocity } from './Util';

export default class LaserSchema extends Schema {
  @type('boolean')
  isDespawned!: boolean;

  @type('uint16')
  id!: number;

  @type('uint16')
  playerId!: number;

  @type(Vector2DSchema)
  origin = new Vector2DSchema();

  @type(Velocity)
  velocity = new Velocity();
}
