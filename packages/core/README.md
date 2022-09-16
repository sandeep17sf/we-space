# @local/core

[![LoopBack](https://github.com/loopbackio/loopback-next/raw/master/docs/site/imgs/branding/Powered-by-LoopBack-Badge-(blue)-@2x.png)](http://loopback.io/)

## Installation

Install LocalCoreComponent using `npm`;

```sh
$ [npm install | yarn add] @local/core
```

## Basic Use

Configure and load LocalCoreComponent in the application constructor
as shown below.

```ts
import {LocalCoreComponent, LocalCoreComponentOptions, DEFAULT__LOCAL_CORE_OPTIONS} from '@local/core';
// ...
export class MyApplication extends BootMixin(ServiceMixin(RepositoryMixin(RestApplication))) {
  constructor(options: ApplicationConfig = {}) {
    const opts: LocalCoreComponentOptions = DEFAULT__LOCAL_CORE_OPTIONS;
    this.configure(LocalCoreComponentBindings.COMPONENT).to(opts);
      // Put the configuration options here
    });
    this.component(LocalCoreComponent);
    // ...
  }
  // ...
}
```
