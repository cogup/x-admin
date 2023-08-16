import { type AxiosInstance } from 'axios';
import { type OpenApiSpec } from './index';
import { type Resource } from './resources';
export { openapi } from './builders/openapi';
export { swagger } from './builders/swagger';

export class ApiAdmin {
  info: {
    title: string;
    description?: string;
  };

  tags: Tag[] | undefined;
  resources: Record<string, Resources>;
  axios: AxiosInstance;

  constructor(data: SchemaData, axios: AxiosInstance) {
    this.info = data.info;
    this.tags = data.tags;
    this.resources = data.resources;
    this.axios = axios;
  }
}

export interface SchemaData {
  info: {
    title: string;
    description?: string;
  };
  tags: Tag[] | undefined;
  resources: Record<string, Resources>;
}

export interface Resources {
  create?: Resource;
  read?: Resource;
  update?: Resource;
  delete?: Resource;
  list?: Resource;
  search?: Resource;
}

export interface Schema {
  title?: string;
  multipleOf?: number;
  maximum?: number;
  exclusiveMaximum?: number;
  minimum?: number;
  exclusiveMinimum?: number;
  maxLength?: number;
  minLength?: number;
  pattern?: string;
  maxItems?: number;
  minItems?: number;
  uniqueItems?: boolean;
  maxProperties?: number;
  minProperties?: number;
  required?: boolean;
  enum?: any[];
  type?: 'string' | 'number' | 'integer' | 'boolean' | 'array' | 'object';
  allOf?: Schema[];
  oneOf?: Schema[];
  anyOf?: Schema[];
  not?: Schema;
  items?: Schema;
  properties?: Record<string, Schema>;
  additionalProperties?: boolean | Schema;
  description?: string;
  format?: string;
  default?: any;
  nullable?: boolean;
  discriminator?: OpenApiSpec.Discriminator;
  readOnly?: boolean;
  writeOnly?: boolean;
  example?: any;
  externalDocs?: OpenApiSpec.ExternalDocumentation;
  deprecated?: boolean;
  xml?: OpenApiSpec.XML;
  'x-admin-type'?: string;
}

export enum Methods {
  GET = 'get',
  POST = 'post',
  PUT = 'put',
  DELETE = 'delete',
  PATCH = 'patch',
  ANY = 'any'
}

export type Params = Record<string, string | number | boolean | any>;

export interface ApiParams {
  body?: Record<string, any>;
  params?: Record<string, any>;
  query?: Record<string, any>;
}

export enum PropieryReferencesType {
  QUERY = 'query',
  PARAMS = 'params',
  BODY = 'body',
  HEADERS = 'headers'
}

export interface Tag {
  name: string;
  description: string | undefined;
}

export enum AdminTagNames {
  Type,
  Resource,
  Group,
  Unknown
}

export interface AdminTag {
  name: AdminTagNames;
  value?: string;
}
