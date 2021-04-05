import { Room } from 'colyseus';
import BattleSchema from '../schemas/BattleSchema';

export default class BattleRoom extends Room<BattleSchema> { }
