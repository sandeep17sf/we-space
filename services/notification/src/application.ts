import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';
import {ServiceMixin} from '@loopback/service-proxy';
import {
  BearerVerifierBindings,
  BearerVerifierComponent,
  BearerVerifierConfig,
  BearerVerifierType,
  CoreComponent,
  SECURITY_SCHEME_SPEC,
  ServiceSequence,
  SFCoreBindings,
} from '@sourceloop/core';
import * as dotenv from 'dotenv';
import * as dotenvExt from 'dotenv-extended';
import {AuthenticationComponent} from 'loopback4-authentication';
import {
  AuthorizationBindings,
  AuthorizationComponent,
} from 'loopback4-authorization';
import path from 'path';
import * as openapi from './openapi.json';
import { NotificationServiceComponent, NotifServiceBindings }  from "@sourceloop/notification-service"
import {
  SocketBindings,
  SocketIOProvider
} from 'loopback4-notifications/socketio';
import { NotificationBindings } from 'loopback4-notifications';
import { MySequence } from './sequence';
export {ApplicationConfig};

export class NotificatonApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    const port = 3000;
    dotenv.config();
    dotenvExt.load({
      schema: '.env.example',
      errorOnMissing: true,
      includeProcessEnv: true,
    });
    options.rest = options.rest ?? {};
    options.rest.basePath = process.env.BASE_PATH ?? '';
    options.rest.port = +(process.env.PORT ?? port);
    options.rest.host = process.env.HOST;
    options.rest.openApiSpec = {
      endpointMapping: {
        [`${options.rest.basePath}/openapi.json`]: {
          version: '3.0.0',
          format: 'json',
        },
      },
    };
    super(options);
     // Set up the custom sequence
     this.sequence(MySequence);

     // Set up default home page
     this.static('/', path.join(__dirname, '../public'));
 
     // Customize @loopback/rest-explorer configuration here
     this.configure(RestExplorerBindings.COMPONENT).to({
       path: '/explorer',
     });
     this.component(RestExplorerComponent);
 
     // add Component for AuthenticationService
     this.component(NotificationServiceComponent);
 
     this.bind(NotifServiceBindings.Config).to({
       useCustomSequence: true,
     });
     this.bind(NotificationBindings.PushProvider).toProvider(SocketIOProvider);
 
     this.bind(SocketBindings.Config).to({
       url: process.env.SOCKETIO_SERVER_URL ?? "",
       defaultPath: 'general-message',
       options: {},
     });
    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };
  }
}
