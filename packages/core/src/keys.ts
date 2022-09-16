import {BindingKey, CoreBindings} from '@loopback/core';
import {LocalCoreComponent} from './component';

/**
 * Binding keys used by this component.
 */
export namespace LocalCoreComponentBindings {
  export const COMPONENT = BindingKey.create<LocalCoreComponent>(
    `${CoreBindings.COMPONENTS}.LocalCoreComponent`,
  );
}
