import { Schema, type } from '@colyseus/schema';

export class Vector2DSchema extends Schema {
  @type('number')
  x!: number;

  @type('number')
  y!: number;
}

export class Velocity extends Schema {
  @type('number')
  x!: number;

  @type('number')
  y!: number;
}

export default {
  Vector2DSchema,
  Velocity
};

