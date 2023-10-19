import axios from 'axios';
import * as OpenApiSpec from '../openapi';
import {
  AdminData,
  AdminResourceData,
  ApiAdmin,
  Methods,
  type Schema,
  type Tag
} from '../xadmin';
import { capitalizeFirstLetter } from '../../utils';
import {
  ResourceTypes,
  type Queryparams,
  type ResourceDataBuilder,
  type ResourceData,
  Resource
} from '../resources';

function getAdminInfo(
  path: string,
  method: Methods,
  adminData: AdminData | undefined
): AdminResourceData | undefined {
  if (
    adminData !== undefined &&
    adminData.resources !== undefined &&
    adminData.resources[path] !== undefined &&
    adminData.resources[path][method] !== undefined
  ) {
    {
      return adminData.resources[path][method] as AdminResourceData;
    }
  } else {
    return undefined;
  }
}

function listAllGroupsByPath(
  adminData: AdminData | undefined
): Record<string, string> {
  const groups: Record<string, string> = {};

  if (adminData !== undefined && adminData.resources !== undefined) {
    Object.keys(adminData.resources).forEach((path): void => {
      const resource = adminData.resources[path];

      if (
        groups[path] === undefined &&
        ((resource.get && resource.get.types?.includes(ResourceTypes.LIST)) ||
          (resource.post &&
            resource.post.types?.includes(ResourceTypes.CREATE)))
      ) {
        const pathSplit = path.split('/');
        const groupName = pathSplit[pathSplit.length - 1];
        groups[path] = groupName;
      } else if (
        groups[path] === undefined &&
        ((resource.get && resource.get.types?.includes(ResourceTypes.READ)) ||
          (resource.put &&
            resource.put.types?.includes(ResourceTypes.UPDATE)) ||
          (resource.delete &&
            resource.post.types?.includes(ResourceTypes.DELETE)))
      ) {
        const pathSplit = path.replace('/{id}', '').split('/');
        const groupName = pathSplit[pathSplit.length - 1];
        groups[path] = groupName;
      }
    });
  }

  return groups;
}

export function openapi(spec: OpenApiSpec.OpenAPI): ApiAdmin {
  const server = spec.servers?.[0].url ?? '';
  const schema = new ApiAdmin({
    info: spec.info,
    tags:
      spec.tags !== undefined
        ? spec.tags.map((tag): Tag => {
            return { name: tag.name, description: tag.description };
          })
        : [],
    resources: {}
  });
  const api = axios.create({
    baseURL: server
  });
  const paths = Object.keys(spec.paths);
  const groupsPath = listAllGroupsByPath(spec['x-admin']);

  for (let i = 0; i < paths.length; i++) {
    const path = paths[i];
    const pathItem = spec.paths[path];

    const pathMethods = Object.keys(pathItem);
    for (let i = 0; i < pathMethods.length; i++) {
      const resourceData: ResourceDataBuilder = {
        contentType: 'application/json',
        apiPath: path
      };
      const [operation, method] =
        pathMethods[i] === 'get'
          ? [pathItem.get, Methods.GET]
          : pathMethods[i] === 'post'
          ? [pathItem.post, Methods.POST]
          : pathMethods[i] === 'put'
          ? [pathItem.put, Methods.PUT]
          : pathMethods[i] === 'delete'
          ? [pathItem.delete, Methods.DELETE]
          : pathMethods[i] === 'patch'
          ? [pathItem.patch, Methods.PATCH]
          : [null, null];

      if (method === null || operation === undefined) {
        continue;
      }

      const adminResourceData = getAdminInfo(path, method, spec['x-admin']);

      if (adminResourceData === undefined) {
        continue;
      }

      resourceData.method = method;
      resourceData.summary = operation.summary;
      resourceData.description = operation.description;
      resourceData.tags = operation.tags ?? [];
      resourceData.types = adminResourceData.types as ResourceTypes[];

      resourceData.metadata = Object.entries(adminResourceData)
        .map(([key, value]) => {
          if (key === 'types' || key === 'groupName') {
            return undefined;
          }
          return { key, value };
        })
        .filter((x) => x !== undefined);

      if (adminResourceData.groupName === undefined) {
        if (groupsPath[path] !== undefined) {
          resourceData.resource = groupsPath[path];
        } else {
          console.warn(
            `Group name not found for path ${path}, please add a group name to the path or add a group name to the resource`
          );
          continue;
        }
      } else {
        resourceData.resource = adminResourceData.groupName;
      }

      if (resourceData.types === undefined) {
        continue;
      }

      resourceData.types.forEach((type) => {
        if (resourceData.localPaths === undefined) {
          resourceData.localPaths = { [type]: fixPathToRoute(path, type) };
        } else {
          resourceData.localPaths[type] = fixPathToRoute(path, type);
        }
      });

      const responseKeys = Object.keys(operation.responses);

      if (responseKeys[0] === undefined) {
        continue;
      }

      const responseKey = responseKeys[0];
      const statusCode = parseInt(responseKey);
      const methodOperation = operation.responses[responseKey];
      const response = methodOperation as OpenApiSpec.Response;

      resourceData.statusCode = statusCode;

      if (response.content === undefined) {
        continue;
      }

      const resourceSchema = response.content[resourceData.contentType].schema;

      if (
        resourceSchema === undefined ||
        OpenApiSpec.isReference(resourceSchema)
      ) {
        const reference = resourceSchema as OpenApiSpec.Reference;
        resourceData.response = resolveReference(spec, reference.$ref);
      } else if (resourceSchema !== undefined) {
        const converted = tryConvertToSchema(resourceSchema);

        if (converted !== undefined) {
          resourceData.response = converted;
        }
      }

      if (
        operation.requestBody === undefined ||
        OpenApiSpec.isReference(operation.requestBody) ||
        OpenApiSpec.isReference(
          operation.requestBody?.content[resourceData.contentType]
        )
      ) {
        resourceData.request = undefined;
      } else {
        resourceData.request = operation.requestBody?.content[
          resourceData.contentType
        ].schema as Schema;
      }

      resourceData.key = `${resourceData.method.toString()}:${
        resourceData.contentType
      }:${path}`;

      // Operation Parameters
      if (operation.parameters != null) {
        const params: Queryparams = {};
        const paramsList: string[] = [];

        for (let i = 0; i < operation.parameters.length; i++) {
          const operationContent = operation.parameters[i];

          if (OpenApiSpec.isReference(operationContent)) {
            continue;
          }

          const parameter = operationContent as OpenApiSpec.Parameter;

          if (typeof parameter.name === 'string') {
            if (
              parameter.schema == null ??
              OpenApiSpec.isReference(parameter.schema)
            ) {
              continue;
            }

            if (
              parameter.schema === undefined ||
              OpenApiSpec.isReference(parameter.schema)
            ) {
              continue;
            }

            const paramSchema: OpenApiSpec.Schema =
              parameter.schema as OpenApiSpec.Schema;

            params[parameter.name] = {
              type: paramSchema.type ?? 'string',
              description: parameter.description,
              required: parameter.required ?? false,
              name: parameter.name
            };
            paramsList.push(parameter.name);
          }
        }

        resourceData.queryparams = params;
        resourceData.queryparamsList = paramsList;
      }

      resourceData.types.forEach((type) => {
        let references;
        if (type === ResourceTypes.LIST) {
          if (resourceData.response?.type !== 'object') {
            throw new Error(
              `Invalid schema for ${method} ${path} to list view, needs to be an object with a data property that is an array`
            );
          }

          references = adminResourceData?.references?.list;
        } else if (type === ResourceTypes.SEARCH) {
          references = adminResourceData?.references?.search;
        }

        const localPath = resourceData.localPaths?.[type] ?? '';

        const localResourceData: ResourceData = {
          key: resourceData.key ?? '',
          tags: resourceData.tags ?? [],
          resourceName: resourceData.resource ?? '',
          type,
          template: resourceData.template,
          statusCode: resourceData.statusCode ?? 200,
          request: resourceData.request,
          response: resourceData.response,
          summary: resourceData.summary,
          description: resourceData.description,
          queryparams: resourceData.queryparams,
          contentType: resourceData.contentType,
          body: resourceData.body,
          apiPath: resourceData.apiPath,
          localPath,
          method: resourceData.method ?? Methods.ANY,
          queryparamsList: resourceData.queryparamsList ?? [],
          label: capitalizeFirstLetter(resourceData.resource ?? ''),
          metadata: resourceData.metadata,
          references,
          defaultValue: resourceData.defaultValue
        };

        const resource = new Resource(localResourceData, api);

        if (schema.resources[resource.resourceName] === undefined) {
          schema.resources[resource.resourceName] = {
            [resource.type]: resource
          };
        } else {
          switch (resource.type) {
            case ResourceTypes.LIST:
              schema.resources[resource.resourceName].list = resource;
              break;
            case ResourceTypes.SEARCH:
              schema.resources[resource.resourceName].search = resource;
              break;
            case ResourceTypes.CREATE:
              schema.resources[resource.resourceName].create = resource;
              break;
            case ResourceTypes.READ:
              schema.resources[resource.resourceName].read = resource;
              break;
            case ResourceTypes.UPDATE:
              schema.resources[resource.resourceName].update = resource;
              break;
            case ResourceTypes.DELETE:
              schema.resources[resource.resourceName].delete = resource;
              break;
          }
        }
      });
    }
  }

  return schema;
}

function resolveReference(spec: OpenApiSpec.OpenAPI, ref: string): any {
  const parts = ref.split('/');
  if (parts.length === 4 && parts[0] === '#' && parts[1] === 'components') {
    const componentType = parts[2];
    const componentName = parts[3];
    return (spec.components as any)[componentType][componentName];
  } else {
    throw new Error(`Invalid reference: ${ref}`);
  }
}

function fixPathToRoute(path: string, type: string): string {
  return path.replace(/\{/g, ':').replace(/\}/g, '') + `/${type}`;
}

function tryConvertToSchemaMap(
  schemas: Array<OpenApiSpec.Schema | OpenApiSpec.Reference>
): Schema[] {
  const newSchemas: OpenApiSpec.Schema[] = [];

  schemas.forEach((item): void => {
    if (!OpenApiSpec.isReference(item)) {
      newSchemas.push(item);
    }
  });

  return newSchemas.map(convertOpenApiSchemaToSchema);
}

function tryConvertToSchema(
  schema: OpenApiSpec.Schema | OpenApiSpec.Reference
): Schema | undefined {
  return OpenApiSpec.isReference(schema)
    ? undefined
    : convertOpenApiSchemaToSchema(schema);
}

function convertOpenApiSchemaToSchema(
  openApiSchema: OpenApiSpec.Schema
): Schema {
  const schema: Schema = {
    ...openApiSchema,
    required: undefined, // TODO; precisa resolver isso. Aparentemente ele não esta defindo required para nenhuma propriedade
    allOf: undefined,
    oneOf: undefined,
    anyOf: undefined,
    not: undefined,
    items: undefined,
    properties: undefined,
    additionalProperties: undefined
  };

  if (openApiSchema.allOf != null) {
    schema.allOf = tryConvertToSchemaMap(openApiSchema.allOf);
  }

  if (openApiSchema.oneOf != null) {
    schema.oneOf = tryConvertToSchemaMap(openApiSchema.oneOf);
  }
  if (openApiSchema.anyOf != null) {
    schema.anyOf = tryConvertToSchemaMap(openApiSchema.anyOf);
  }

  if (openApiSchema.not != null) {
    schema.not = tryConvertToSchema(openApiSchema.not);
  }

  if (openApiSchema.items != null) {
    schema.items = tryConvertToSchema(openApiSchema.items);
  }

  if (openApiSchema.properties != null) {
    schema.properties = {};

    Object.keys(openApiSchema.properties).forEach((key): void => {
      const prop =
        openApiSchema.properties != null ? openApiSchema.properties[key] : null;

      if (prop == null) {
        return;
      }

      const converted = tryConvertToSchema(prop);

      if (converted != null && schema.properties != null) {
        schema.properties[key] = converted;
      }
    });
  }

  if (
    openApiSchema.additionalProperties !== undefined &&
    typeof openApiSchema.additionalProperties !== 'boolean'
  ) {
    schema.additionalProperties = tryConvertToSchema(
      openApiSchema.additionalProperties
    );
  } else if (typeof openApiSchema.additionalProperties === 'boolean') {
    schema.additionalProperties = openApiSchema.additionalProperties;
  }

  return schema;
}
