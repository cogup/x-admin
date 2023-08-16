import { openapi, swagger, type ApiAdmin } from './apiadmin';
import axios, { type AxiosInstance } from 'axios';
import { type Resource, type ResourceTypes } from './resources';
import { notification } from 'antd';
export { ResourceTypes } from './resources';
export type { Resource } from './resources';
export { ApiAdmin, Methods } from './apiadmin';
export type { Schema, ApiParams, Params } from './apiadmin';
export * as OpenApiSpec from './openapi';

enum OriginalSchemaTypes {
  OPENAPI = 'openapi',
  SWAGGER = 'swagger',
  UNKNOWN = 'unknown'
}

export interface ControllerData {
  host: string;
  docsPath: string;
}

export class ControllerBuilder {
  host: string;
  axios: AxiosInstance;
  originalSchema: OriginalSchemaTypes | null;
  apiAdmin: ApiAdmin | null;
  docsPath: string = '/documentation/json';

  constructor(data: ControllerData) {
    this.host = data.host;
    this.axios = axios.create({
      baseURL: this.host
    });
    this.originalSchema = OriginalSchemaTypes.UNKNOWN;
    this.apiAdmin = null;
    this.docsPath = data.docsPath;
  }

  async builder(): Promise<Controller> {
    try {
      const response = await this.axios.get(this.docsPath);

      if ('openapi' in response.data) {
        this.originalSchema = OriginalSchemaTypes.OPENAPI;
        this.apiAdmin = openapi(response.data, this.axios);
      } else {
        throw new Error('Swagger not supported yet, use OpenAPI 3 schema.');
      }

      return new Controller(this);
    } catch (error) {
      notification.error({
        message: `Can't fetch API data: ${error}`
      });
      throw new Error("Can't fetch API data");
    }
  }
}

export class Controller {
  host: string;
  axios: AxiosInstance;
  originalSchema: OriginalSchemaTypes;
  apiAdmin: ApiAdmin;
  groups: string[];
  resources: Resource[];
  docsPath: string = '/documentation/json';

  constructor(data: ControllerBuilder) {
    this.host = data.host;
    this.axios = data.axios;

    if (data.originalSchema) {
      this.originalSchema = data.originalSchema;
    } else {
      throw new Error('Original schema is not defined');
    }

    if (data.apiAdmin != null) {
      this.apiAdmin = data.apiAdmin;
    } else {
      throw new Error('Schema is not defined');
    }

    this.groups = this.getAllGroupsName();
    this.resources = this.getAllResources();
    this.docsPath = data.docsPath;
  }

  getDocFullUrl(): string {
    return `${this.host}${this.docsPath}`;
  }

  getResource(groupName: string, resourceType: ResourceTypes): Resource {
    if (this.apiAdmin.resources[groupName] === undefined) {
      throw new Error(`Resource ${groupName} ${resourceType}  not found`);
    }

    const resource = this.apiAdmin.resources[groupName][resourceType];

    if (resource === undefined) {
      throw new Error(`Resource ${groupName} ${resourceType}  not found`);
    }

    return resource;
  }

  findResourceByLocalPath(
    localPath: string,
    resourceType: ResourceTypes
  ): Resource | null {
    const resources = Object.values(this.apiAdmin.resources);
    for (let i = 0; i < resources.length; i++) {
      const resource = resources[i][resourceType];
      if (resource != null && resource.localPath === localPath) {
        return resource;
      }
    }
    return null;
  }

  pluralToSingle(plural: string): string {
    if (plural.endsWith('ies')) {
      return plural.slice(0, -3) + 'y';
    } else if (plural.endsWith('s')) {
      return plural.slice(0, -1);
    } else {
      return plural;
    }
  }

  resolveResourceName(name: string): string {
    const resourceNameSingular = this.pluralToSingle(name);
    const resourceName =
      resourceNameSingular.charAt(0).toUpperCase() +
      resourceNameSingular.slice(1);
    return resourceName;
  }

  findResourceByLocalPathComplex(localPath: string): Resource | null {
    if (localPath === '/') {
      return null;
    }
    const path = localPath.split('/');
    const resourceName = this.resolveResourceName(path[2]);
    const resourceType = path[path.length - 1] as ResourceTypes;

    try {
      const resource = this.getResource(resourceName, resourceType);

      if (this.getResource(resourceName, resourceType as ResourceTypes)) {
        return resource;
      } else {
        return this.findResourceByLocalPath(localPath, resourceType);
      }
    } catch {
      return this.findResourceByLocalPath(localPath, resourceType);
    }
  }

  getAllGroupsName(): string[] {
    return Object.keys(this.apiAdmin.resources);
  }

  getAllResourcesByGroup(groupName: string): Resource[] {
    const resources: Resource[] = [];
    const group = this.apiAdmin.resources[groupName];
    if (group !== undefined) {
      if (group.create !== undefined) {
        resources.push(group.create);
      }

      if (group.read !== undefined) {
        resources.push(group.read);
      }

      if (group.update !== undefined) {
        resources.push(group.update);
      }

      if (group.delete !== undefined) {
        resources.push(group.delete);
      }

      if (group.list !== undefined) {
        resources.push(group.list);
      }

      if (group.search !== undefined) {
        resources.push(group.search);
      }
    }
    return resources;
  }

  getAllResources(): Resource[] {
    const allResources: Resource[] = [];

    Object.keys(this.apiAdmin.resources).forEach((group) => {
      Object.keys(this.apiAdmin.resources[group]).forEach((resource) => {
        if (this.apiAdmin.resources[group] !== undefined) {
          const resources = this.apiAdmin.resources[group];

          if (resources.create !== undefined) {
            allResources.push(resources.create);
          }

          if (resources.read !== undefined) {
            allResources.push(resources.read);
          }

          if (resources.update !== undefined) {
            allResources.push(resources.update);
          }

          if (resources.delete !== undefined) {
            allResources.push(resources.delete);
          }

          if (resources.list !== undefined) {
            allResources.push(resources.list);
          }

          if (resources.search !== undefined) {
            allResources.push(resources.search);
          }
        }
      });
    });

    return allResources;
  }

  getCurrentResource(localPath: string): Resource | null {
    try {
      const resource = this.findResourceByLocalPathComplex(localPath);
      if (resource === null) {
        return null;
      }
      return resource;
    } catch {
      return null;
    }
  }
}
