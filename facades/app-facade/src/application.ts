import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {ServiceMixin} from '@loopback/service-proxy';
import path from 'path';
import {AuthenticationComponent} from 'loopback4-authentication';
import {
  AuthorizationBindings,
  AuthorizationComponent,
} from 'loopback4-authorization';
import {
  CoreComponent,
  SECURITY_SCHEME_SPEC,
  BearerVerifierBindings,
  BearerVerifierComponent,
  BearerVerifierConfig,
  BearerVerifierType,
  SecureSequence,
  SFCoreBindings,
} from '@sourceloop/core';
import compression from 'compression';
export {ApplicationConfig};

export class AppFacadeApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);
    this.api({
      openapi: '3.0.0',
      paths: {},
      info: {
        title: 'Chat Facade app',
        version: '1.0',
      },
      components: {
        securitySchemes: SECURITY_SCHEME_SPEC,
      },
    });
    this.component(CoreComponent);
    const expressMiddlewares =
      this.getSync(SFCoreBindings.EXPRESS_MIDDLEWARES) ?? [];
    expressMiddlewares.push(compression({level: 1, memLevel: 9}));
    // Set up the custom sequence
    this.sequence(SecureSequence);

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);

    this.component(AuthenticationComponent);
    this.bind(BearerVerifierBindings.Config).to({
      type: BearerVerifierType.facade,
    } as BearerVerifierConfig);
    this.component(BearerVerifierComponent);
    this.bind(AuthorizationBindings.CONFIG).to({
      allowAlwaysPaths: ['/explorer'],
    });
    this.component(AuthorizationComponent);
  
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
