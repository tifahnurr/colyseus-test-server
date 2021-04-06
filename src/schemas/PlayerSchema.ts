import { Schema, type } from '@colyseus/schema';
import { Vector2DSchema } from './Util';

export default class PlayerSchema extends Schema {
  @type('boolean')
  isSpawned!: boolean;

  @type('uint16')
  id!: number;

  @type('number')
  angle!: number;

  @type(Vector2DSchema)
  position = new Vector2DSchema();
}
