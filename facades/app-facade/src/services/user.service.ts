import {inject, Provider} from '@loopback/core';
import {getService} from '@loopback/service-proxy';
import {UserDataSource} from '../datasources';

export interface User {
  // this is where you define the Node.js methods that will be
  // mapped to REST/SOAP/gRPC operations as stated in the datasource
  // json file.
}

export class UserProvider implements Provider<User> {
  constructor(
    // user must match the name property in the datasource json file
    @inject('datasources.user')
    protected dataSource: UserDataSource = new UserDataSource(),
  ) {}

  value(): Promise<User> {
    return getService(this.dataSource);
  }
}
