import { List, Typography, theme } from 'antd';
import React from 'react';
import { Switch } from 'antd';
import styled from 'styled-components';

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

enum ItemType {
  SEARCH = 'search',
  LIST = 'list',
  READ = 'read',
  CREATE = 'create',
  UPDATE = 'update',
  delete = 'delete'
}

interface AdjustListItemProps {
  item: Item;
  onChangeItem: (
    type: ItemType,
    path: string,
    method: string,
    checked: boolean
  ) => void;
}

const { Text, Title } = Typography;

const AdjustListItem = ({
  item,
  onChangeItem
}: AdjustListItemProps): React.ReactElement => {
  const { token } = theme.useToken();

  return (
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
              backgroundColor: token.colorInfoBg,
              color: token.colorInfoText,
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
};

export default AdjustListItem;
