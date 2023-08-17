import { AdminData } from './xadmin';

// Info Object
export interface Info {
  title: string;
  version: string;
  description?: string;
  termsOfService?: string;
  contact?: Contact;
  license?: License;
}

export interface PropieriesReferences {
  query?: Record<string, string>;
  params?: Record<string, string>;
  body?: Record<string, string>;
  headers?: Record<string, string>;
}

export interface Contact {
  name?: string;
  url?: string;
  email?: string;
}

export interface License {
  name: string;
  url?: string;
}

// Server Object
export interface Server {
  url: string;
  description?: string;
  variables?: Record<string, ServerVariable>;
}

export interface ServerVariable {
  enum?: string[];
  default: string;
  description?: string;
}

// Paths Object
export type Paths = Record<string, PathItem>;

export interface PathItem {
  get?: Operation;
  put?: Operation;
  post?: Operation;
  delete?: Operation;
  options?: Operation;
  head?: Operation;
  patch?: Operation;
  trace?: Operation;
  servers?: Server[];
  parameters?: Array<Parameter | Reference>;
}

// Operation Object
export interface Operation {
  tags?: string[];
  summary?: string;
  description?: string;
  externalDocs?: ExternalDocumentation;
  operationId?: string;
  parameters?: Array<Parameter | Reference>;
  requestBody?: RequestBody | Reference;
  responses: Responses;
  callbacks?: Record<string, Callback>;
  deprecated?: boolean;
  security?: SecurityRequirement[];
  servers?: Server[];
}

export interface ExternalDocumentation {
  description?: string;
  url: string;
}

// Parameter Object
export interface Parameter {
  name: string;
  in: 'query' | 'header' | 'path' | 'cookie';
  description?: string;
  required?: boolean;
  deprecated?: boolean;
  allowEmptyValue?: boolean;
  style?: string;
  explode?: boolean;
  allowReserved?: boolean;
  schema?: Schema | Reference;
  example?: any;
  examples?: Record<string, Example | Reference>;
}

// RequestBody Object
export interface RequestBody {
  description?: string;
  content: Record<string, MediaType>;
  required?: boolean;
}

// MediaType Object
export interface MediaType {
  schema?: Schema | Reference;
  example?: any;
  examples?: Record<string, Example | Reference>;
  encoding?: Record<string, Encoding>;
}

// Encoding Object
export interface Encoding {
  contentType?: string;
  encodingHeaders?: Record<string, Header | Reference>; // Renomeado para encodingHeaders
  style?: string;
  explode?: boolean;
  allowReserved?: boolean;
}

// Schema Object
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
  allOf?: Array<Schema | Reference>;
  oneOf?: Array<Schema | Reference>;
  anyOf?: Array<Schema | Reference>;
  not?: Schema | Reference;
  items?: Schema | Reference;
  properties?: Record<string, Schema | Reference>;
  additionalProperties?: boolean | Schema | Reference;
  description?: string;
  format?: string;
  default?: any;
  nullable?: boolean;
  discriminator?: Discriminator;
  readOnly?: boolean;
  writeOnly?: boolean;
  example?: any;
  externalDocs?: ExternalDocumentation;
  deprecated?: boolean;
  xml?: XML;
}

// Discriminator Object
export interface Discriminator {
  propertyName: string;
  mapping?: Record<string, string>;
}

// XML Object
export interface XML {
  name?: string;
  namespace?: string;
  prefix?: string;
  attribute?: boolean;
  wrapped?: boolean;
}

// Reference Object
export interface Reference {
  $ref: string;
}

// Response Object
export type Responses = Record<string, Response | Reference>;

export interface Response {
  description: string;
  responseHeaders?: Record<string, Header | Reference>;
  content?: Record<string, MediaType>;
  links?: Record<string, Link | Reference>;
}

// Header Object
export interface Header {
  description?: string;
  required?: boolean;
  deprecated?: boolean;
  allowEmptyValue?: boolean;
  style?: string;
  explode?: boolean;
  allowReserved?: boolean;
  schema?: Schema | Reference;
  example?: any;
  examples?: Record<string, Example | Reference>;
}

// Example Object
export interface Example {
  summary?: string;
  description?: string;
  value?: any;
  externalValue?: string;
}

// Link Object
export interface Link {
  operationRef?: string;
  operationId?: string;
  parameters?: Record<string, any>;
  requestBody?: any;
  description?: string;
  server?: Server;
}

// Callback Object
export type Callback = Record<string, PathItem>;

// Components Object
export interface Components {
  schemas?: Record<string, Schema | Reference>;
  responses?: Record<string, Response | Reference>;
  parameters?: Record<string, Parameter | Reference>;
  examples?: Record<string, Example | Reference>;
  requestBodies?: Record<string, RequestBody | Reference>;
  headers?: Record<string, Header | Reference>;
  securitySchemes?: Record<string, SecurityScheme | Reference>;
  links?: Record<string, Link | Reference>;
  callbacks?: Record<string, Callback | Reference>;
}

// Security Scheme Object
export interface SecurityScheme {
  type: 'apiKey' | 'http' | 'oauth2' | 'openIdConnect';
  description?: string;
  name?: string;
  in?: 'query' | 'header' | 'cookie';
  scheme?: string;
  bearerFormat?: string;
  flows?: OAuthFlows;
  openIdConnectUrl?: string;
}

// OAuth Flows Object
export interface OAuthFlows {
  implicit?: OAuthFlow;
  password?: OAuthFlow;
  clientCredentials?: OAuthFlow;
  authorizationCode?: OAuthFlow;
}

// OAuth Flow Object
export interface OAuthFlow {
  authorizationUrl?: string;
  tokenUrl?: string;
  refreshUrl?: string;
  scopes: Record<string, string>;
}

// Security Requirement Object
export type SecurityRequirement = Record<string, string[]>;

// Tag Object
export interface Tag {
  name: string;
  description?: string;
  externalDocs?: ExternalDocumentation;
}

// OpenAPI Object
export interface OpenAPI {
  openapi: string;
  info: Info;
  servers?: Server[];
  paths: Paths;
  components?: Components;
  security?: SecurityRequirement[];
  tags?: Tag[];
  externalDocs?: ExternalDocumentation;
  'x-admin'?: AdminData;
}

export function isReference(
  obj: unknown
): obj is
  | Reference
  | Body
  | Response
  | Link
  | Header
  | string
  | Example
  | Parameter
  | Schema {
  return (
    obj !== undefined &&
    typeof obj === 'object' &&
    obj !== null &&
    '$ref' in obj
  );
}
