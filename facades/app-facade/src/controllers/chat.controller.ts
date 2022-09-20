// Uncomment these imports to begin using these cool features!

import { inject } from "@loopback/core";
import { UserProvider } from "../services";

// import {inject} from '@loopback/core';


export class ChatController {
  constructor(
    @inject('services.User')
    protected userService: UserProvider,
  ) {}
}
