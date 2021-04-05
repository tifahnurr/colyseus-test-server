import { Schema, type } from '@colyseus/schema';
import { Vector2DSchema } from './Util';

export default class PlayerSchema extends Schema {
  @type('uint16')
  id!: number;

  @type(Vector2DSchema)
  position = new Vector2DSchema();
}
