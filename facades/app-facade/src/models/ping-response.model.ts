import {model, property} from '@loopback/repository';

/**
 * The model class is generated from OpenAPI schema - PingResponse
 * PingResponse
 */
@model({name: 'PingResponse'})
export class PingResponse {
  constructor(data?: Partial<PingResponse>) {
    if (data != null && typeof data === 'object') {
      Object.assign(this, data);
    }
  }

  /**
   *
   */
  @property({jsonSchema: {
  type: 'string',
}})
  greeting?: string;

  /**
   *
   */
  @property({jsonSchema: {
  type: 'string',
}})
  date?: string;

  /**
   *
   */
  @property({jsonSchema: {
  type: 'string',
}})
  url?: string;

  /**
   *
   */
  @property({jsonSchema: {
  type: 'object',
  properties: {
    'Content-Type': {
      type: 'string',
    },
  },
  additionalProperties: true,
}})
  headers?: {
  'Content-Type'?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [additionalProperty: string]: any;
};

}

export interface PingResponseRelations {
  // describe navigational properties here
}

export type PingResponseWithRelations = PingResponse & PingResponseRelations;


