import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Table,
  Row,
  Button,
  Col,
  Popconfirm,
  Tooltip,
  notification
} from 'antd';
import { useIsLaptop, useIsMobile, useQuerystring } from '../use';
import {
  DeleteOutlined,
  EditOutlined,
  QuestionCircleOutlined,
  ReadOutlined
} from '@ant-design/icons';
import styled from 'styled-components';
import { Header } from '../ui';
import { type Resource, type Controller, ResourceTypes } from '../controller';

const WrapperTable = styled(Row)`
  .ant-table-cell {
    max-height: 50px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

const WrapperButtonsMobile = styled(Row)`
  background-color: #fff;
  display: flex;
  justify-content: flex-end;
  padding: 1rem 0;
`;

interface ListItem {
  id: number;
  [key: string]: any;
}

interface ListItemsProps {
  resource: Resource;
  controller: Controller;
}

const ListItems: React.FC<ListItemsProps> = ({
  resource,
  controller
}): React.ReactElement => {
  const [columns, setColumns] = useState<Record<string, any>[]>([]);
  const [data, setData] = useState<ListItem[]>([]);
  const [pagination, setPagination] = useState<{
    current: number;
    pageSize: number;
    total: number;
  }>({
    current: 0,
    pageSize: 0,
    total: 0
  });
  const { page = 1, pageSize = 10 } = useQuerystring();
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const { search = '' } = useQuerystring();
  const [selectedRowData, setSelectedRowData] = useState<ListItem[]>([]);
  const [resourceCreate, setResourceCreate] = useState<Resource | null>(null);
  const [resourceDelete, setResourceDelete] = useState<Resource | null>(null);
  const [resourceUpdate, setResourceUpdate] = useState<Resource | null>(null);
  const [resourceRead, setResourceRead] = useState<Resource | null>(null);
  const isMobile = useIsMobile();
  const isLaptop = useIsLaptop();

  useEffect((): void => {
    const generateColumns = (): void => {
      const properties = resource.response?.properties?.data?.items?.properties;

      if (properties == null) {
        notification.error({
          message:
            "The schema does not contain the 'data' property in the response"
        });
        return;
      }

      const newColumns = Object.keys(properties).map((key) => ({
        title: key.toUpperCase(),
        dataIndex: key,
        key,
        description: properties[key]?.description
      }));

      setColumns(newColumns);
    };

    setResourceCreate(
      controller.getResource(resource.resourceName, ResourceTypes.CREATE)
    );
    setResourceDelete(
      controller.getResource(resource.resourceName, ResourceTypes.DELETE)
    );
    setResourceUpdate(
      controller.getResource(resource.resourceName, ResourceTypes.UPDATE)
    );
    setResourceRead(
      controller.getResource(resource.resourceName, ResourceTypes.READ)
    );

    generateColumns();
  }, [resource.response]);

  useEffect((): void => {
    fetchData().catch((error) => {
      notification.error({
        message: `Error fetching data: ${error}`
      });
    });
  }, [resource, page, pageSize, search]);

  const fetchData = async (): Promise<void> => {
    try {
      setLoading(true);

      const response = await resource.call({
        query: {
          page,
          pageSize,
          search
        }
      });

      if (response.data != null && Array.isArray(response.data.data)) {
        setData(
          response.data.data.map((item: any): void => ({
            ...item,
            key: item[resource.metadata?.id || 'id'],
            ellipsis: {
              showTitle: false
            },
            render: (content: string): React.ReactElement => (
              <Tooltip placement="topLeft" title={content}>
                {content}
              </Tooltip>
            )
          }))
        );
        setPagination({
          current: response.data.meta.page,
          pageSize: response.data.meta.pageSize,
          total: response.data.meta.totalItems
        });
      } else {
        notification.error({
          message:
            'Returned data does not contain an array in the "data" property'
        });
      }

      setLoading(false);
    } catch (error) {
      notification.error({
        message: `Error fetching data: ${error}`
      });
    }
  };

  const removeItemFromData = (id: number): void => {
    setData((prevData): ListItem[] =>
      prevData.filter(
        (item): boolean => item[resource.metadata?.id || 'id'] !== id
      )
    );
  };

  const onDelete = async (id: number): Promise<void> => {
    await handleDelete(id);
    removeItemFromData(id);
  };

  const handleDelete = async (id: number): Promise<void> => {
    try {
      await resourceDelete?.call({ params: { id } });
      notification.success({
        message: `Item with id: ${id} has been deleted.`
      });
    } catch (error) {
      notification.error({
        message: `Error deleting item with id: ${id}, error`
      });
    }
  };

  const onChangePagination = (page: number, pageSize: number): void => {
    navigate(`?page=${page}&pageSize=${pageSize}`);
  };

  const onSelectRow = (
    _record: any,
    _selected: any,
    selectedRows: ListItem[],
    _nativeEvent: any
  ): void => {
    setManySelectedRowData(selectedRows);
  };

  const onSelectAllRows = (
    _selected: any,
    selectedRows: ListItem[],
    _changeRows: any
  ): void => {
    setManySelectedRowData(selectedRows);
  };

  const setManySelectedRowData = (selectedRows: ListItem[]): void => {
    setSelectedRowData(selectedRows.filter((item): boolean => Boolean(item)));
  };

  const deleteAllSelected = async (): Promise<void> => {
    await Promise.all(
      selectedRowData.map(async (item): Promise<void> => {
        await onDelete(item[resource.metadata?.id || 'id']);
      })
    );

    setSelectedRowData([]);
    await fetchData();
  };

  const deleteSingle = async (id: number): Promise<void> => {
    await onDelete(id);
    await fetchData();
  };

  const actionButton = (): React.ReactElement | null => {
    if (resourceDelete != null && selectedRowData.length > 0) {
      return (
        <Popconfirm
          title="Delete the task"
          description="Are you sure you want to delete the selected items?"
          icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
          onConfirm={() => {
            deleteAllSelected().catch((error) => {
              notification.error({
                message: `Error deleting items: ${error}`
              });
            });
          }}
        >
          <Button
            type="primary"
            danger={true}
            icon={<DeleteOutlined style={{ fontSize: '1.0rem' }} />}
          >
            Delete selected
          </Button>
        </Popconfirm>
      );
    }

    if (resourceCreate != null) {
      return (
        <Button type="primary" onClick={onClickCreate}>
          Create new {resourceCreate.resourceName}
        </Button>
      );
    }

    return null;
  };

  const actionButtonMobile = () => (
    <WrapperButtonsMobile>{actionButton()}</WrapperButtonsMobile>
  );

  const onClickCreate = (): void => {
    const to = resourceCreate?.getLocalPath();

    if (to === undefined) {
      return;
    }

    navigate(to);
  };

  const defineColumns = (): React.ReactElement[] => {
    const columnsReferences: {
      id?: any;
      name?: any;
      title?: any;
    } = {};

    const columnsAlt: Record<string, any>[] = [];

    columns.forEach((column) => {
      if (
        column.title === 'ID' ||
        column.title === 'NAME' ||
        column.title === 'TITLE'
      ) {
        switch (column.title) {
          case 'ID':
            columnsReferences.id = column;
            break;

          case 'NAME':
            columnsReferences.name = column;
            break;

          case 'TITLE':
            columnsReferences.title = column;
            break;

          default:
            break;
        }
      } else {
        columnsAlt.push(column);
      }
    });

    const newColumns: Record<string, any>[] = [];

    if (columnsReferences.id !== undefined) {
      newColumns.push(columnsReferences.id);
    }

    if (columnsReferences.name !== undefined) {
      newColumns.push(columnsReferences.name);
    }

    if (columnsReferences.title !== undefined) {
      newColumns.push(columnsReferences.title);
    }

    newColumns.push(...columnsAlt);

    let totalColumnItems = 6;

    if (isMobile) {
      totalColumnItems = 2;
    } else if (isLaptop) {
      totalColumnItems = 3;
    }

    return newColumns.slice(0, totalColumnItems).map((column): any => ({
      ...column,
      ellipsis: {
        showTitle: false
      },
      render: (content: string): React.ReactElement => (
        <Tooltip placement="topLeft" title={content}>
          {content}
        </Tooltip>
      )
    }));
  };

  const onClickEdit = (id: number): void => {
    const to = resourceUpdate?.getLocalPath({ params: { id } });

    if (to === undefined) {
      return;
    }

    navigate(to);
  };

  const onClickRead = (id: number): void => {
    const to = resourceRead?.getLocalPath({ params: { id } });

    if (to === undefined) {
      return;
    }

    navigate(to);
  };

  const defineAction = (): any => {
    return {
      title: 'Action',
      key: 'action',
      fixed: 'right',
      width: 160,
      render: (_: string, record: ListItem): React.ReactElement => (
        <Row justify={'space-between'}>
          {resourceRead != null && (
            <Col>
              <Button
                type="default"
                icon={<ReadOutlined style={{ fontSize: '1.0rem' }} />}
                onClick={() => {
                  onClickRead(record[resource.metadata?.id || 'id']);
                }}
              />
            </Col>
          )}
          {resourceUpdate != null && (
            <Col>
              <Button
                type="dashed"
                icon={<EditOutlined style={{ fontSize: '1.0rem' }} />}
                onClick={() => {
                  onClickEdit(record[resource.metadata?.id || 'id']);
                }}
              />
            </Col>
          )}
          {resourceDelete != null && (
            <Col>
              <Popconfirm
                title="Delete the task"
                description="Are you sure to delete this task?"
                icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                onConfirm={() => {
                  deleteSingle(record[resource.metadata?.id || 'id']).catch(
                    (error) => {
                      notification.error({
                        message: `Error deleting item: ${error}`
                      });
                    }
                  );
                }}
              >
                <Button
                  type="dashed"
                  danger={true}
                  icon={<DeleteOutlined style={{ fontSize: '1.0rem' }} />}
                />
              </Popconfirm>
            </Col>
          )}
        </Row>
      )
    };
  };

  return (
    <Row justify="end">
      <Col>
        <Header
          title={resource.summary ?? resource.resourceName}
          subtitle={resource.apiPath}
          button={isMobile ? null : actionButton()}
          description={resource.description}
          resourceName={resource.resourceName}
          typeName={resource.type}
        />
        <WrapperTable>
          <Table
            columns={[...defineColumns(), defineAction()]}
            dataSource={data}
            pagination={{
              ...pagination,
              onChange: onChangePagination,
              showSizeChanger: true
            }}
            loading={loading}
            rowSelection={{
              selections: true,
              onSelect: onSelectRow,
              onSelectAll: onSelectAllRows
            }}
          />
        </WrapperTable>
        {isMobile && actionButtonMobile()}
      </Col>
    </Row>
  );
};

export default ListItems;
