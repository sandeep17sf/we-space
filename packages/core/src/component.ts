import {
  Application,
  injectable,
  Component,
  config,
  ContextTags,
  CoreBindings,
  inject,
} from '@loopback/core';
import {LocalCoreComponentBindings} from './keys'
import {DEFAULT__LOCAL_CORE_OPTIONS, LocalCoreComponentOptions} from './types';

// Configure the binding for LocalCoreComponent
@injectable({tags: {[ContextTags.KEY]: LocalCoreComponentBindings.COMPONENT}})
export class LocalCoreComponent implements Component {
  constructor(
    @inject(CoreBindings.APPLICATION_INSTANCE)
    private application: Application,
    @config()
    private options: LocalCoreComponentOptions = DEFAULT__LOCAL_CORE_OPTIONS,
  ) {}
}
