import React, { useEffect, useState } from 'react';
import { AutoComplete, Input, notification } from 'antd';
import {
  ResourceTypes,
  type Resource,
  type Controller,
  type Params
} from '../controller';
import { Link } from 'react-router-dom';

interface RelationshipInputProps {
  resource: Resource;
  onChange: (value: any) => void;
  controller: Controller;
  defaultValue?: string;
  disabled?: boolean;
}

export default function RelationshipInput({
  resource,
  onChange,
  controller,
  defaultValue,
  disabled
}: RelationshipInputProps): React.ReactElement {
  const [options, setOptions] = useState([]);
  const [valueFormatted, setValueFormatted] = useState<string>();
  const resourceView = controller.getResource(
    resource.resourceName,
    ResourceTypes.READ
  );
  const url =
    defaultValue !== undefined && defaultValue !== null
      ? resourceView?.getLocalPath({
          params: { id: defaultValue }
        })
      : resourceView?.getLocalPath();

  useEffect((): void => {
    if (defaultValue !== undefined && defaultValue !== null) {
      fetchFirstData(defaultValue).catch((error) => {
        notification.error({
          message: `Error fetching related data: ${error}`
        });
      });
    } else {
      setValueFormatted('');
    }
  }, []);

  const fetchFirstData = async (id: string): Promise<void> => {
    try {
      const response = await resourceView.call({ params: { id } });
      const data = response.data;
      const value = formatLabel(data);

      setValueFormatted(value);
    } catch (_error) {
      notification.error({
        message: `Error fetching related data (${resourceView.getApiPath()}):`
      });
    }
  };

  const formatLabel = (data: Params): string => {
    return `(${data[resource.metadata?.id || 'id'] as string}) ${getLabel(
      data
    )}`;
  };

  const getLabel = (item: Params): string => {
    const label =
      item.name ??
      item.title ??
      item.label ??
      item.username ??
      item.nickname ??
      item.slug ??
      item.email ??
      item.first_name ??
      item.last_name;

    if (label === undefined) {
      const propsName = Object.keys(item);
      for (const key in propsName) {
        const name = propsName[key];
        if (name !== 'id' && name !== 'createdAt' && name !== 'updatedAt') {
          return item[name];
        }
      }

      if ('id' in item) {
        return item.id as string;
      }

      return '';
    }

    return label as string;
  };

  const handleSearch = async (search: string): Promise<void> => {
    try {
      const response = await resource.call({
        query: { search }
      });
      const opts = response.data.data.map((item: Params): Params => {
        return {
          value: formatLabel(item),
          label: formatLabel(item)
        };
      });

      setOptions(opts);
    } catch (error) {
      notification.error({
        message: `Error fetching related data (${resource.getApiPath()}): ${error}`
      });
    }
  };

  const handlerChange = (value: string): void => {
    setValueFormatted(value);

    const regex = /\((\d+)\)/;
    const match = regex.exec(value);

    if (match != null) {
      const num = parseInt(match[1]);
      onChange(num);
    }
  };

  if (valueFormatted === undefined) {
    return (
      <Input
        defaultValue={defaultValue}
        onChange={(e): void => {
          onChange(e.target.value);
        }}
      />
    );
  }

  return (
    <>
      <AutoComplete
        defaultValue={valueFormatted}
        onChange={handlerChange}
        style={{ width: 200 }}
        onSearch={(value) => {
          handleSearch(value).catch((error) => {
            notification.error({
              message: `Error fetching related data: ${error}`
            });
          });
        }}
        placeholder={`Search ${resource.resourceName}`}
        options={options}
        disabled={disabled}
      />
      {defaultValue && (
        <Link
          to={url}
          style={{
            marginLeft: '0.5em'
          }}
        >
          more
        </Link>
      )}
    </>
  );
}
