import { EventEmitter } from 'events';

class MyEventEmitter extends EventEmitter {}

export const eventEmitter = new MyEventEmitter();
