import { type AxiosInstance } from 'axios';
import { OpenApiSpec } from '..';
import { ApiAdmin, Methods, type Schema, type Tag } from '../apiadmin';
import { capitalizeFirstLetter } from '../../utils';
import {
  ResourceTypes,
  type Queryparams,
  type ResourceDataBuilder,
  type ResourceData,
  Resource
} from '../resources';

export function openapi(
  spec: OpenApiSpec.OpenAPI,
  axios: AxiosInstance
): ApiAdmin {
  const schema = new ApiAdmin(
    {
      info: spec.info,
      tags:
        spec.tags !== undefined
          ? spec.tags.map((tag): Tag => {
              return { name: tag.name, description: tag.description };
            })
          : [],
      resources: {}
    },
    axios
  );

  const paths = Object.keys(spec.paths);

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

      if (method === null || operation?.['x-admin'] === undefined) {
        continue;
      }

      resourceData.method = method;
      resourceData.summary = operation.summary;
      resourceData.description = operation.description;
      resourceData.tags = operation.tags ?? [];
      resourceData.types = operation['x-admin'].types as ResourceTypes[];
      resourceData.resource = operation['x-admin'].resourceName;
      resourceData.resource = operation['x-admin'].resourceName;
      resourceData.group = operation['x-admin'].groupName;

      resourceData.metadata = Object.entries(operation['x-admin'])
        .map(([key, value]) => {
          if (
            key === 'types' ||
            key === 'resourceName' ||
            key === 'groupName'
          ) {
            return undefined;
          }
          return { key, value };
        })
        .filter((x) => x !== undefined);

      if (
        resourceData.group === undefined &&
        resourceData.resource === undefined
      ) {
        continue;
      }

      if (resourceData.group !== undefined) {
        resourceData.resource = resourceData.group;
      } else {
        resourceData.group = resourceData.resource;
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

          references = operation['x-admin']?.references?.list;
        } else if (type === ResourceTypes.SEARCH) {
          references = operation['x-admin']?.references?.search;
        }

        const localPath = resourceData.localPaths?.[type] ?? '';

        const localResourceData: ResourceData = {
          key: resourceData.key ?? '',
          tags: resourceData.tags ?? [],
          group: resourceData.group ?? '',
          resource: resourceData.resource ?? '',
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

        const resource = new Resource(localResourceData, axios);

        if (schema.resources[resource.group] === undefined) {
          schema.resources[resource.group] = { [resource.type]: resource };
        } else {
          switch (resource.type) {
            case ResourceTypes.LIST:
              schema.resources[resource.group].list = resource;
              break;
            case ResourceTypes.SEARCH:
              schema.resources[resource.group].search = resource;
              break;
            case ResourceTypes.CREATE:
              schema.resources[resource.group].create = resource;
              break;
            case ResourceTypes.READ:
              schema.resources[resource.group].read = resource;
              break;
            case ResourceTypes.UPDATE:
              schema.resources[resource.group].update = resource;
              break;
            case ResourceTypes.DELETE:
              schema.resources[resource.group].delete = resource;
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
