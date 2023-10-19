import React, { useEffect } from 'react';
import { List, Skeleton, Switch } from 'antd';
import { StepProps } from '../components/Steps';
import styled from 'styled-components';
import { OpenAPI, Operation, PathItem } from '../controller/openapi';
import demo from './demo.json';
import { Methods, ResourceTypes } from '../controller';
import { AdminData } from '../controller/xadmin';

const SwitchCustom = styled(Switch)`
  margin: 0.2em 0;
`;

export interface Item {
  method: string;
  path: string;
  summary?: string;
  description?: string;
  search: boolean;
  list: boolean;
  read: boolean;
  create: boolean;
  update: boolean;
  delete: boolean;
}

export interface ItemGroup {
  [key: string]: Item;
}

export interface Items {
  [key: string]: ItemGroup;
}

const extractOperation = (
  op: PathItem,
  method: Methods
): Operation | undefined => {
  if (method === Methods.GET && op.get !== undefined) {
    return op.get;
  }

  if (method === Methods.POST && op.post !== undefined) {
    return op.post;
  }

  if (method === Methods.PUT && op.put !== undefined) {
    return op.put;
  }

  if (method === Methods.DELETE && op.delete !== undefined) {
    return op.delete;
  }

  if (method === Methods.PATCH && op.patch !== undefined) {
    return op.patch;
  }

  return undefined;
};

const resourceIs = (
  spec: OpenAPI,
  resourceType: ResourceTypes,
  method: Methods,
  path: string
): boolean => {
  if (
    spec['x-admin'] !== undefined &&
    spec['x-admin']?.resources !== undefined &&
    spec['x-admin']?.resources[path] !== undefined &&
    spec['x-admin']?.resources[path][method] !== undefined &&
    spec['x-admin']?.resources[path][method].types?.indexOf(resourceType) !== -1
  ) {
    return true;
  }

  return false;
};

const getList = (spec: OpenAPI): Item[] => {
  const list: Item[] = [];

  Object.keys(spec.paths).forEach((path) => {
    const pathItem = spec.paths[path];
    Object.keys(pathItem).forEach((method) => {
      const methodType = method as Methods;
      const operation = extractOperation(pathItem, methodType);

      if (operation === undefined) {
        return;
      }

      const item: Item = {
        method,
        path,
        summary: operation.summary,
        description: operation.description,
        search: resourceIs(spec, ResourceTypes.SEARCH, methodType, path),
        list: resourceIs(spec, ResourceTypes.LIST, methodType, path),
        read: resourceIs(spec, ResourceTypes.READ, methodType, path),
        create: resourceIs(spec, ResourceTypes.CREATE, methodType, path),
        update: resourceIs(spec, ResourceTypes.UPDATE, methodType, path),
        delete: resourceIs(spec, ResourceTypes.DELETE, methodType, path)
      };
      list.push(item);
    });
  });

  return list;
};

const specification = demo as OpenAPI;

enum ItemType {
  SEARCH = 'search',
  LIST = 'list',
  READ = 'read',
  CREATE = 'create',
  UPDATE = 'update',
  delete = 'delete'
}

const AdjustTemplates = (props: StepProps): React.ReactElement => {
  const [loading, setLoading] = React.useState<boolean>(false);
  const [xAdminData, setXAdminData] = React.useState<AdminData>();
  const [list, setList] = React.useState<Item[]>([]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    props.setData({ url: e.target.value });
  };

  useEffect(() => {
    setList(getList(specification));
    setXAdminData(specification['x-admin']);
  }, []);

  // save on xAdminData
  const onChangeItem = (
    itemType: ItemType,
    itemMethod: string,
    itemPath: string,
    checked: boolean
  ) => {
    if (xAdminData === undefined) {
      return;
    }

    if (xAdminData.resources === undefined) {
      xAdminData.resources = {};
    }

    if (xAdminData.resources[itemPath] === undefined) {
      xAdminData.resources[itemPath] = {};
    }

    if (xAdminData.resources[itemPath][itemMethod] === undefined) {
      xAdminData.resources[itemPath][itemMethod] = {
        types: []
      };
    }

    if (xAdminData.resources[itemPath][itemMethod].types === undefined) {
      xAdminData.resources[itemPath][itemMethod].types = [];
    }

    if (checked) {
      xAdminData.resources[itemPath][itemMethod].types?.push(itemType);
    } else {
      const index =
        xAdminData.resources[itemPath][itemMethod].types?.indexOf(itemType);
      if (index !== undefined && index !== -1) {
        xAdminData.resources[itemPath][itemMethod].types?.splice(index, 1);
      }
    }

    setXAdminData({ ...xAdminData });
  };

  return (
    <List
      className="demo-loadmore-list"
      itemLayout="horizontal"
      dataSource={list}
      renderItem={(item) => (
        <List.Item>
          <Skeleton avatar title={false} loading={loading} active>
            <List.Item.Meta
              title={item.method + ' ' + item.path}
              description={item.description}
            />
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <SwitchCustom
                key={0}
                size="small"
                defaultChecked={item.create}
                checkedChildren="Create"
                unCheckedChildren="No create"
                onChange={(checked) =>
                  onChangeItem(ItemType.CREATE, item.path, item.method, checked)
                }
              />
              <SwitchCustom
                key={0}
                size="small"
                defaultChecked={item.read}
                checkedChildren="Read"
                unCheckedChildren="No read"
                onChange={(checked) =>
                  onChangeItem(ItemType.READ, item.path, item.method, checked)
                }
              />
              <SwitchCustom
                key={0}
                size="small"
                defaultChecked={item.update}
                checkedChildren="Update"
                unCheckedChildren="No update"
                onChange={(checked) =>
                  onChangeItem(ItemType.UPDATE, item.path, item.method, checked)
                }
              />
              <SwitchCustom
                key={0}
                size="small"
                defaultChecked={item.delete}
                checkedChildren="Delete"
                unCheckedChildren="No delete"
                onChange={(checked) =>
                  onChangeItem(ItemType.delete, item.path, item.method, checked)
                }
              />
              <SwitchCustom
                key={0}
                size="small"
                defaultChecked={item.list}
                checkedChildren="List"
                unCheckedChildren="No list"
                onChange={(checked) =>
                  onChangeItem(ItemType.LIST, item.path, item.method, checked)
                }
              />
              <SwitchCustom
                key={0}
                size="small"
                defaultChecked={item.search}
                checkedChildren="Search"
                unCheckedChildren="No search"
                onChange={(checked) =>
                  onChangeItem(ItemType.SEARCH, item.path, item.method, checked)
                }
              />
            </div>
          </Skeleton>
        </List.Item>
      )}
    />
  );
};

export default AdjustTemplates;
