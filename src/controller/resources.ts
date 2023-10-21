import { type AxiosInstance } from 'axios';
import {
  type ApiParams,
  Methods,
  AdminResourceReferencesType,
  type Params,
  type Schema,
  AdminResourceReferences
} from './xadmin';

export class Resource implements ResourceData {
  key: string;
  tags: string[];
  resourceName: string;
  type: ResourceTypes;
  template?: string;
  statusCode: number;
  request?: Schema;
  response?: Schema;
  summary?: string;
  description?: string;
  queryparams?: Queryparams;
  contentType: string;
  body?: Params;
  apiPath: string;
  localPath: string;
  method: Methods;
  axios: AxiosInstance;
  queryparamsList: string[];
  label: string;
  references?: AdminResourceReferences;
  defaultValue?: any;
  metadata?: Record<string, any>;

  constructor(data: ResourceData, axios: AxiosInstance) {
    this.key = data.key;
    this.tags = data.tags;
    this.resourceName = data.resourceName;
    this.type = data.type;
    this.statusCode = data.statusCode;
    this.contentType = data.contentType;
    this.apiPath = data.apiPath;
    this.localPath = data.localPath;
    this.method = data.method;
    this.axios = axios;
    this.queryparamsList = data.queryparamsList;
    this.label = data.label;
    this.references = data.references;
    this.metadata = data.metadata;

    if (data.template !== undefined) {
      this.template = data.template;
    }

    if (data.request !== undefined) {
      this.request = data.request;
    }

    if (data.response !== undefined) {
      this.response = data.response;
    }

    if (data.summary !== undefined) {
      this.summary = data.summary;
    }

    if (data.description !== undefined) {
      this.description = data.description;
    }

    if (data.queryparams !== undefined) {
      this.queryparams = data.queryparams;
    }

    if (data.body !== undefined) {
      this.body = data.body;
    }
  }

  fixBody(body: Record<string, any> | undefined): Record<string, any> | null {
    if (body === undefined) {
      return null;
    }

    const newBody: Record<string, any> = {};

    for (const key in body) {
      const item = this.getPropertyReferencesType(
        AdminResourceReferencesType.BODY,
        key
      );

      if (
        this.request?.properties !== undefined &&
        this.request?.properties[item] === undefined
      ) {
        continue;
      }

      newBody[item] = body[key];
    }

    return newBody;
  }

  async call(data?: ApiParams): Promise<any> {
    const path = this.getApiPath(data);
    const method = this.method.toLowerCase();
    const config = {
      headers: {
        'Content-Type': this.contentType
      }
    };

    if (method === Methods.GET) {
      return await this.axios.get(path, config);
    } else if (method === Methods.POST) {
      return await this.axios.post(path, this.fixBody(data?.body), config);
    } else if (method === Methods.PUT) {
      return await this.axios.put(path, this.fixBody(data?.body), config);
    } else if (method === Methods.DELETE) {
      return await this.axios.delete(path, config);
    } else if (method === Methods.PATCH) {
      return await this.axios.patch(path, this.fixBody(data?.body), config);
    }
  }

  getPropertyReferencesType(
    type: AdminResourceReferencesType,
    property: string
  ): string {
    if (this.references == null) {
      return property;
    }

    if (
      type === AdminResourceReferencesType.QUERY &&
      this.references?.query !== undefined &&
      this.references.query[property] !== undefined
    ) {
      return this.references.query[property] as string;
    }

    return property;
  }

  getApiPath(data?: ApiParams | null, validParams = true): string {
    let apiPath = this.apiPath;

    if (data?.params !== undefined) {
      for (const key in data?.params) {
        const item = this.getPropertyReferencesType(
          AdminResourceReferencesType.PARAMS,
          key
        );
        const regex = new RegExp(`{${item}}`, 'g');
        const value = data.params[item];

        if (
          typeof value !== 'string' &&
          typeof value !== 'number' &&
          typeof value !== 'boolean'
        ) {
          if (value == null) {
            throw new Error(`Value for ${item} is null or undefined`);
          } else if (Array.isArray(value)) {
            throw new Error(
              `Value for ${item} is an array: ${value.join(', ')}`
            );
          } else if (typeof value === 'object') {
            throw new Error(
              `Value for ${item} is an object: ${JSON.stringify(value)}`
            );
          } else {
            throw new Error(`Value for ${item} has an unknown type`);
          }
        }

        apiPath = apiPath.replace(regex, value.toString());
      }
    } else if (validParams && apiPath.includes('{')) {
      throw new Error(
        'Local path contains a parameter but no parameters were provided'
      );
    }

    if (data !== undefined) {
      if (data?.query !== undefined) {
        apiPath += `?${this.resolveQueryParams(data?.query, validParams)}`;
      }
    }

    return apiPath;
  }

  getLocalPath(data?: ApiParams | null): string {
    let localPath = this.localPath;

    if (data?.params !== undefined) {
      for (const key in data?.params) {
        const item = this.getPropertyReferencesType(
          AdminResourceReferencesType.PARAMS,
          key
        );
        const regex = new RegExp(`:${key}`, 'g');
        const value = data.params[key];

        if (
          typeof value !== 'string' &&
          typeof value !== 'number' &&
          typeof value !== 'boolean'
        ) {
          if (value == null) {
            throw new Error(`Value for ${item} is null or undefined`);
          } else if (Array.isArray(value)) {
            throw new Error(
              `Value for ${item} is an array: ${value.join(', ')}`
            );
          } else if (typeof value === 'object') {
            throw new Error(
              `Value for ${item} is an object: ${JSON.stringify(value)}`
            );
          } else {
            throw new Error(`Value for ${item} has an unknown type`);
          }
        }

        localPath = localPath.replace(regex, value.toString());
      }
    }

    if (data?.query !== undefined) {
      localPath += `?${this.resolveQueryParams(data.query)}`;
    }

    return localPath;
  }

  private resolveQueryParams(data: Params, valideParams = false): string {
    let queryparams = '';

    for (const key in data) {
      const item = this.getPropertyReferencesType(
        AdminResourceReferencesType.QUERY,
        key
      );
      const value = data[key];

      if (!valideParams || this.queryparams?.[item] != null) {
        if (
          !valideParams ||
          this.queryparams?.[item].type === 'string' ||
          this.queryparams?.[item].type === 'integer' ||
          this.queryparams?.[item].type === 'boolean' ||
          this.queryparams?.[item].type === 'array' ||
          this.queryparams?.[item].type === 'object'
        ) {
          if (
            valideParams &&
            this.queryparams?.[item].type === 'array' &&
            Array.isArray(value)
          ) {
            if (value.length > 0) {
              value.forEach((item): void => {
                queryparams += `${item as string}=${item as string}&`;
              });
            }
          } else if (
            valideParams &&
            this.queryparams?.[item].type === 'boolean' &&
            typeof value === 'boolean'
          ) {
            queryparams += `${item}=${value ? 'true' : 'false'}&`;
          } else {
            queryparams += `${item}=${value as string}&`;
          }
        } else {
          throw new Error(
            `Value for ${item} is not a queryparams resource: ${
              value as string
            }`
          );
        }
      } else {
        throw new Error(
          `Value for ${item} is not a valid queryparam: ${value as string}`
        );
      }
    }

    return queryparams;
  }
}

export interface ResourceData {
  key: string;
  tags: string[];
  resourceName: string;
  type: ResourceTypes;
  template?: string;
  statusCode: number;
  request?: Schema;
  response?: Schema;
  summary?: string;
  description?: string;
  queryparams?: Queryparams;
  contentType: string;
  body?: Params;
  apiPath: string;
  localPath: string;
  method: Methods;
  queryparamsList: string[];
  label: string;
  references?: AdminResourceReferences;
  defaultValue?: any;
  metadata?: Record<string, any>;
}

export enum ResourceTypes {
  LIST = 'list',
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  READ = 'read',
  SEARCH = 'search'
}

export type Queryparams = Record<string, Queryparam>;

export interface Queryparam {
  name: string;
  type: string;
  description?: string;
  required: boolean;
}

export interface ResourceDataBuilder {
  key?: string;
  tags?: string[];
  resource?: string;
  types?: ResourceTypes[];
  template?: string;
  statusCode?: number;
  request?: Schema;
  response?: Schema;
  summary?: string;
  description?: string;
  queryparams?: Queryparams;
  contentType: string;
  body?: Record<string, Params>;
  apiPath: string;
  localPaths?: Record<string, string>;
  method?: Methods;
  queryparamsList?: string[];
  defaultValue?: any;
  metadata?: Record<string, any>;
  [key: string]: unknown;
}

export function getAllResourceTypes(): string[] {
  return Object.keys(ResourceTypes);
}

export function isResourceType(type: string): boolean {
  return type in ResourceTypes;
}
