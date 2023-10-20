import { openapi, type ApiAdmin } from './xadmin';
import axios, { type AxiosInstance } from 'axios';
import { ResourceTypes, type Resource } from './resources';
import { notification } from 'antd';
export { ResourceTypes } from './resources';
export type { Resource } from './resources';
export { ApiAdmin, Methods } from './xadmin';
export type { Schema, ApiParams, Params } from './xadmin';
import * as OpenApiSpec from './openapi';

enum OriginalSchemaTypes {
  OPENAPI = 'openapi',
  SWAGGER = 'swagger',
  UNKNOWN = 'unknown'
}

export interface ControllerData {
  docUrl?: string;
  specification?: string;
}

export class ControllerBuilder {
  docUrl?: string;
  axios: AxiosInstance;
  originalSchema: OriginalSchemaTypes | null;
  apiAdminData: OpenApiSpec.OpenAPI | null;
  specification?: string;

  constructor(data: ControllerData) {
    this.docUrl = data.docUrl;
    this.axios = axios.create();
    this.originalSchema = OriginalSchemaTypes.UNKNOWN;
    this.apiAdminData = null;
    this.specification = data.specification;
  }

  async builder(): Promise<Controller> {
    try {
      if (this.docUrl !== undefined) {
        const response = await this.axios.get(this.docUrl);

        if ('openapi' in response.data) {
          this.originalSchema = OriginalSchemaTypes.OPENAPI;
          this.apiAdminData = response.data as OpenApiSpec.OpenAPI;
        } else {
          throw new Error('Swagger not supported yet, use OpenAPI 3 schema.');
        }

        return new Controller(this);
      } else if (this.specification !== undefined) {
        const response = JSON.parse(this.specification);

        if ('openapi' in response) {
          this.originalSchema = OriginalSchemaTypes.OPENAPI;
          this.apiAdminData = response as OpenApiSpec.OpenAPI;
        } else {
          throw new Error('Swagger not supported yet, use OpenAPI 3 schema.');
        }

        return new Controller(this);
      }

      throw new Error('Controller data is not defined');
    } catch (error) {
      notification.error({
        message: `Can't fetch API data: ${error}`
      });
      throw new Error("Can't fetch API data");
    }
  }
}

export class Controller {
  docUrl?: string;
  server: string;
  originalSchema: OriginalSchemaTypes;
  apiAdmin: ApiAdmin;
  groups: string[];
  resources: Resource[];
  specification?: string;
  constructor(data: ControllerBuilder) {
    this.docUrl = data.docUrl;
    this.specification = data.specification;

    if (data.originalSchema) {
      this.originalSchema = data.originalSchema;
    } else {
      throw new Error('Original schema is not defined');
    }

    if (data.apiAdminData !== null) {
      this.apiAdmin = openapi(data.apiAdminData);
      this.server = this.apiAdmin.server ?? '';
    } else {
      throw new Error('Schema is not defined');
    }

    this.groups = this.getAllGroupsName();
    this.resources = this.getAllResources();
  }

  getDocFullUrl(): string | undefined {
    return this.docUrl;
  }

  getSpecification(): string | undefined {
    return this.specification;
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

  getResourceSafe(
    groupName: string,
    resourceType: ResourceTypes
  ): Resource | null {
    try {
      return this.getResource(groupName, resourceType);
    } catch (error) {
      console.warn(error);
      return null;
    }
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
