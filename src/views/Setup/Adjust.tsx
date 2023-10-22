import React, { useEffect, useRef } from 'react';
import {
  AutoComplete,
  Button,
  Divider,
  Input,
  InputRef,
  Layout,
  List,
  Row,
  Select,
  Space,
  Switch,
  Typography,
  theme
} from 'antd';
import { StepProps } from '../../components/Steps';
import styled from 'styled-components';
import { OpenAPI, Operation, PathItem } from '../../controller/openapi';
import { Methods, ResourceTypes } from '../../controller';
import { AdminData } from '../../controller/xadmin';
import { PlusOutlined } from '@ant-design/icons';

const { Text, Title } = Typography;

const SwitchCustom = styled(Switch)`
  margin: 0.5em;
  width: 90px;
`;

export interface Item {
  key: string;
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
        key: `${method}-${path}`,
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

enum ItemType {
  SEARCH = 'search',
  LIST = 'list',
  READ = 'read',
  CREATE = 'create',
  UPDATE = 'update',
  delete = 'delete'
}

const getDefaultServerUrl = (spec: OpenAPI): string | undefined => {
  if (spec.servers !== undefined) {
    return spec.servers[0].url;
  }

  return undefined;
};

const loadServersUrl = (specification: OpenAPI): string[] => {
  const urls: string[] = [];

  if (specification.servers !== undefined) {
    specification.servers.forEach((server) => {
      if (server.url !== undefined) {
        urls.push(server.url);
      }
    });
  }

  return urls;
};

const Adjust = (props: StepProps): React.ReactElement => {
  const [xAdminData, setXAdminData] = React.useState<AdminData>();
  const [list, setList] = React.useState<Item[]>([]);
  const [specification, setSpecification] = React.useState<OpenAPI>(
    props.currentData.specification.specification
  );
  const [serversUrl, setServersUrl] = React.useState<string[]>(
    loadServersUrl(props.currentData.specification.specification)
  );
  const [newUrl, setNewUrl] = React.useState<string>('');

  const defaultUrl = getDefaultServerUrl(
    props.currentData.specification.specification
  );
  const {
    token: { colorInfoBg, colorInfoText }
  } = theme.useToken();

  props.nextBottom(true);

  useEffect(() => {
    setList(getList(specification));
    setXAdminData(specification['x-admin']);
  }, []);

  useEffect(() => {
    if (xAdminData !== undefined) {
      props.setData({ ...specification, 'x-admin': xAdminData });
    }
  }, [xAdminData]);

  // save on xAdminData
  const onChangeItem = (
    itemType: ItemType,
    itemPath: string,
    itemMethod: string,
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

  const onChangeApiURL = (url: string) => {
    setSpecification({
      ...specification,
      servers: [
        {
          url
        }
      ]
    });
  };

  const renderList = (item: Item) => (
    <List.Item
      key={item.key}
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            width: '100%'
          }}
        >
          <Title level={5}>{item.summary}</Title>
          <div>
            <Text code>{item.method.toUpperCase()}</Text>{' '}
            <Text>{item.path}</Text>
          </div>
          <Text
            type="secondary"
            style={{
              padding: '0.5rem',
              backgroundColor: colorInfoBg,
              color: colorInfoText,
              margin: '0.5rem 0 0 0',
              width: '100%',
              textAlign: 'justify',
              borderRadius: '0.5rem',
              display: 'block',
              maxWidth: 624
            }}
          >
            {item.description}
          </Text>
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: '1rem'
          }}
        >
          <SwitchCustom
            size="default"
            defaultChecked={item.create}
            checkedChildren="Create"
            unCheckedChildren="No create"
            onChange={(checked) =>
              onChangeItem(ItemType.CREATE, item.path, item.method, checked)
            }
          />
          <SwitchCustom
            size="default"
            defaultChecked={item.read}
            checkedChildren="Read"
            unCheckedChildren="No read"
            onChange={(checked) =>
              onChangeItem(ItemType.READ, item.path, item.method, checked)
            }
          />
          <SwitchCustom
            size="default"
            defaultChecked={item.update}
            checkedChildren="Update"
            unCheckedChildren="No update"
            onChange={(checked) =>
              onChangeItem(ItemType.UPDATE, item.path, item.method, checked)
            }
          />
          <SwitchCustom
            size="default"
            defaultChecked={item.delete}
            checkedChildren="Delete"
            unCheckedChildren="No delete"
            onChange={(checked) =>
              onChangeItem(ItemType.delete, item.path, item.method, checked)
            }
          />
          <SwitchCustom
            size="default"
            defaultChecked={item.list}
            checkedChildren="List"
            unCheckedChildren="No list"
            onChange={(checked) =>
              onChangeItem(ItemType.LIST, item.path, item.method, checked)
            }
          />
          <SwitchCustom
            size="default"
            defaultChecked={item.search}
            checkedChildren="Search"
            unCheckedChildren="No search"
            onChange={(checked) =>
              onChangeItem(ItemType.SEARCH, item.path, item.method, checked)
            }
          />
        </div>
      </div>
    </List.Item>
  );

  const inputRef = useRef<InputRef>(null);

  const addItem = (
    e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>
  ) => {
    e.preventDefault();
    setServersUrl([...serversUrl, newUrl]);
    setNewUrl('');
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  const onChangeNewUrl = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewUrl(event.target.value);
  };

  return (
    <>
      <Space
        direction="vertical"
        style={{
          width: '100%'
        }}
      >
        <Title level={4}>API URL</Title>
        <Select
          style={{ width: 300 }}
          placeholder="Set API URL"
          defaultValue={defaultUrl}
          onSelect={onChangeApiURL}
          dropdownRender={(menu) => (
            <>
              {menu}
              <Divider style={{ margin: '8px 0' }} />
              <Space style={{ padding: '0 8px 4px' }}>
                <Input
                  type="url"
                  placeholder="Enter a new url"
                  ref={inputRef}
                  value={newUrl}
                  onChange={onChangeNewUrl}
                  onKeyDown={(e) => e.stopPropagation()}
                />
                <Button type="text" icon={<PlusOutlined />} onClick={addItem}>
                  Add item
                </Button>
              </Space>
            </>
          )}
          options={serversUrl.map((item) => ({ label: item, value: item }))}
        />
      </Space>
      <Divider plain />
      <Title level={4}>Templates</Title>
      <List
        className="demo-loadmore-list"
        itemLayout="horizontal"
        dataSource={list}
        renderItem={renderList}
      />
    </>
  );
};

export default Adjust;
