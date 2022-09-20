import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';
import {SocketIoApplication} from '@loopback/socketio';
import debugFactory from 'debug';
import {SocketIoController} from './controllers';
import * as dotenv from "dotenv";
import * as dotenvExt from "dotenv-extended";

const debug = debugFactory('loopback:example:socketio:demo');

export {ApplicationConfig};

export class SocketIoExampleApplication extends BootMixin(SocketIoApplication) {
  constructor(options: ApplicationConfig = {}) {
    dotenv.config();
    dotenvExt.load({
      schema: '.env.example',
      errorOnMissing: true,
      includeProcessEnv: true,
    });
    super(options);

    this.projectRoot = __dirname;

    this.socketServer.use((socket, next) => {
      debug('Global middleware - socket:', socket.id);
      next();
    });

    const ns = this.socketServer.route(SocketIoController);
    ns.use((socket, next) => {
      debug(
        'Middleware for namespace %s - socket: %s',
        socket.nsp.name,
        socket.id,
      );
      next();
    });
  }
}