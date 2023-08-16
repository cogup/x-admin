// Info Object
interface Info {
  title: string;
  version: string;
  description?: string;
  termsOfService?: string;
  contact?: Contact;
  license?: License;
}

interface Contact {
  name?: string;
  url?: string;
  email?: string;
}

interface License {
  name: string;
  url?: string;
}

// Host Object
type Host = string;

// BasePath Object
type BasePath = string;

// Schemes Object
type Schemes = Array<'http' | 'https' | 'ws' | 'wss'>;

// Consumes Object
type Consumes = string[];

// Produces Object
type Produces = string[];

// Paths Object
type Paths = Record<string, PathItem>;

interface PathItem {
  get?: Operation;
  put?: Operation;
  post?: Operation;
  delete?: Operation;
  options?: Operation;
  head?: Operation;
  patch?: Operation;
  parameters?: Array<Parameter | Reference>;
}

// Operation Object
interface Operation {
  tags?: string[];
  summary?: string;
  description?: string;
  externalDocs?: ExternalDocumentation;
  operationId?: string;
  consumes?: string[];
  produces?: string[];
  parameters?: Array<Parameter | Reference>;
  responses: Responses;
  schemes?: Schemes;
  deprecated?: boolean;
  security?: SecurityRequirement[];
}

interface ExternalDocumentation {
  description?: string;
  url: string;
}

// Parameter Object
interface Parameter {
  name: string;
  in: 'query' | 'header' | 'path' | 'formData' | 'body';
  description?: string;
  required?: boolean;
  type?: string;
  format?: string;
  allowEmptyValue?: boolean;
  items?: Items;
  collectionFormat?: string;
  default?: any;
  maximum?: number;
  exclusiveMaximum?: boolean;
  minimum?: number;
  exclusiveMinimum?: boolean;
  maxLength?: number;
  minLength?: number;
  pattern?: string;
  maxItems?: number;
  minItems?: number;
  uniqueItems?: boolean;
  enum?: any[];
  multipleOf?: number;
  schema?: Schema;
}

// Items Object
interface Items {
  type?: string;
  format?: string;
  items?: Items;
  collectionFormat?: string;
  default?: any;
  maximum?: number;
  exclusiveMaximum?: boolean;
  minimum?: number;
  exclusiveMinimum?: boolean;
  maxLength?: number;
  minLength?: number;
  pattern?: string;
  maxItems?: number;
  minItems?: number;
  uniqueItems?: boolean;
  enum?: any[];
  multipleOf?: number;
}

// Schema Object
interface Schema {
  type?: 'string' | 'number' | 'integer' | 'boolean' | 'array' | 'object';
  properties?: Record<string, Schema | Reference>;
  items?: Schema | Reference;
  additionalProperties?: boolean | Schema | Reference;
  // ... outros campos do objeto Schema
}

// Reference Object
interface Reference {
  $ref: string;
}

// Response Object
type Responses = Record<string, Response | Reference>;

interface Response {
  description: string;
  schema?: Schema | Reference;
  headers?: Record<string, Header>;
  examples?: Record<string, any>;
}

// Header Object
interface Header {
  description?: string;
  type: string;
  format?: string;
  items?: Items;
  collectionFormat?: string;
  default?: any;
  maximum?: number;
  exclusiveMaximum?: boolean;
  minimum?: number;
  exclusiveMinimum?: boolean;
  maxLength?: number;
  minLength?: number;
  pattern?: string;
  maxItems?: number;
  minItems?: number;
  uniqueItems?: boolean;
  enum?: any[];
  multipleOf?: number;
}

// Security Definition Object
type SecurityDefinitions = Record<string, SecurityScheme>;

interface SecurityScheme {
  type: 'basic' | 'apiKey' | 'oauth2';
  description?: string;
  name?: string;
  in?: 'query' | 'header';
  flow?: 'implicit' | 'password' | 'application' | 'accessCode';
  authorizationUrl?: string;
  tokenUrl?: string;
  scopes?: Scopes;
}

type Scopes = Record<string, string>;

// Security Requirement Object
type SecurityRequirement = Record<string, string[]>;

// Tags Object
interface Tag {
  name: string;
  description?: string;
  externalDocs?: ExternalDocumentation;
}

// Swagger Object
export interface Swagger {
  swagger: string;
  info: Info;
  host?: Host;
  basePath?: BasePath;
  schemes?: Schemes;
  consumes?: Consumes;
  produces?: Produces;
  paths: Paths;
  definitions?: Record<string, Schema | Reference>;
  parameters?: Record<string, Parameter | Reference>;
  responses?: Record<string, Response | Reference>;
  securityDefinitions?: SecurityDefinitions;
  security?: SecurityRequirement[];
  tags?: Tag[];
  externalDocs?: ExternalDocumentation;
}
