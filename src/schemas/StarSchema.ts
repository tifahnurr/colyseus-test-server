import { Schema, type } from '@colyseus/schema';
import { Vector2DSchema } from './Util';

export default class StarSchema extends Schema {
  @type('boolean')
  isSpawned!: boolean;

  @type('boolean')
  isDespawned!: boolean;

  @type('uint16')
  id!: number;

  @type(Vector2DSchema)
  position = new Vector2DSchema();
}
