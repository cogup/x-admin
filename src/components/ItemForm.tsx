import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Form,
  Button,
  Row,
  Col,
  Spin,
  type FormInstance,
  notification
} from 'antd';
import RelationshipInput from './RelationshipInput';
import { Header, DynamicInput } from '../ui';
import { formatName } from '../utils';
import {
  type Controller,
  type Resource,
  ResourceTypes,
  type Schema
} from '../controller';
import { useIsMobile } from '../use';
import styled from 'styled-components';

const WrapperButtonsMobile = styled(Row)`
  display: flex;
  justify-content: space-between;
`;

function sortResponseKeys(
  schemaKeys: string[],
  throwDown?: string[],
  throwUp?: string[]
): string[] {
  const sortedKeys = schemaKeys.slice();

  if (throwDown != null) {
    const downKeys = sortedKeys.filter((key): boolean =>
      throwDown.includes(key)
    );
    const otherKeys = sortedKeys.filter(
      (key): boolean => !throwDown.includes(key)
    );
    sortedKeys.length = 0;
    sortedKeys.push(...otherKeys, ...downKeys);
  }

  if (throwUp != null) {
    const upKeys = sortedKeys.filter((key): boolean => throwUp.includes(key));
    const otherKeys = sortedKeys.filter(
      (key): boolean => !throwUp.includes(key)
    );
    sortedKeys.length = 0;
    sortedKeys.push(...upKeys, ...otherKeys);
  }

  return sortedKeys;
}

function extractKeys(
  prop?: Record<string, Schema>,
  hidden?: string[]
): string[] {
  const keys = prop !== undefined ? Object.keys(prop) : [];
  const value =
    hidden !== undefined
      ? keys.filter((key): boolean => !hidden.includes(key))
      : keys;

  return value;
}

function joinKeys(
  prop1?: Record<string, Schema>,
  prop2?: Record<string, Schema>,
  hidden?: string[]
): string[] {
  const item1 = extractKeys(prop1, hidden);
  const item2 = extractKeys(prop2, hidden);
  const join = [...item1, ...item2];
  const value = join.filter(
    (valor, index): boolean => join.indexOf(valor) === index
  );

  return value;
}

interface ItemFormProps {
  type: ResourceTypes;
  resource: Resource;
  controller: Controller;
  hidden?: string[];
  throwDown?: string[];
  throwUp?: string[];
}

const ItemForm: React.FC<ItemFormProps> = (
  props: ItemFormProps
): React.ReactElement => {
  const {
    type: formType,
    resource: resourceAction,
    controller,
    hidden,
    throwDown,
    throwUp
  } = props;
  const { id: currentId } = useParams<{ id: string | undefined }>();
  const [result, setResult] = useState<Record<string, any>>({});
  const [relationships, setRelationships] = useState<Record<string, any>>({});
  const [resourceView, setResourceView] = useState<Resource>();
  const [resourceList, setResourceList] = useState<Resource>();
  const [loading, setLoading] = useState<boolean>(false);
  const [schemaKeys, setSchemaKeys] = useState<string[]>([]);
  const formRef = useRef<FormInstance | null>(null);
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  useEffect((): void => {
    const keys = joinKeys(
      resourceAction.response?.properties,
      resourceAction.request?.properties,
      hidden
    );
    const sorted = sortResponseKeys(keys, throwDown, throwUp);
    setSchemaKeys(sorted);
  }, [resourceAction, hidden, throwDown, throwUp]);

  useEffect(() => {
    if (formType === ResourceTypes.UPDATE && resourceView != null) {
      fetchView()
        .catch((error): void => {
          notification.error({
            message: `Error fetching item: ${error}`
          });
        })
        .finally(() => {
          formRef.current?.resetFields();
        });
    }
  }, [currentId, formType, resourceView]);

  useEffect((): void => {
    try {
      setResourceView(
        controller.getResource(resourceAction.group, ResourceTypes.READ)
      );
    } catch (_) {
      setResourceView(undefined);
    }
    try {
      setResourceList(
        controller.getResource(resourceAction.group, ResourceTypes.LIST)
      );
    } catch (_) {}
  }, [controller, resourceAction]);

  useEffect(() => {
    for (const key of schemaKeys) {
      if (key.includes('Id')) {
        const resourceName = key.replace('Id', ''); // Changed
        try {
          const resource = controller.getResource(
            resourceName,
            ResourceTypes.LIST
          );

          setRelationships((prevState) => ({
            ...prevState,
            [key]: resource
          }));
        } catch (error) {
          notification.error({
            message: `Error fetching item: ${error}`
          });
        }
      }
    }
  }, [controller, schemaKeys]);

  const fetchView = async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await resourceView?.call({ params: { id: currentId } });
      setResult(response.data);
      setLoading(false);
    } catch (error) {
      notification.error({
        message: `Error fetching item: ${error}`
      });
    }
  };

  const handleChange = (key: string, value: string): void => {
    setResult((prevState): any => ({
      ...prevState,
      [key]: value
    }));
  };

  const handleSubmit = async (): Promise<void> => {
    try {
      const data = {
        body: result,
        params: currentId !== undefined ? { id: currentId } : {}
      };

      await resourceAction.call(data);

      const path = resourceList?.getLocalPath();

      if (currentId === undefined) {
        notification.success({
          message: 'Item created successfully'
        });
      } else {
        notification.success({
          message: 'Item updated successfully'
        });
      }

      if (path !== undefined) {
        navigate(path);
      }
    } catch (error) {
      notification.error({
        message: `Error submitting item: ${error}`
      });
    }
  };

  const handleCancel = (): void => {
    const path = resourceList?.getLocalPath();

    if (path !== undefined) {
      navigate(path);
    }
  };

  const renderButtons = (): React.ReactElement | null => {
    if (isMobile) {
      return null;
    }

    return (
      <Form.Item>
        <Button type="primary" htmlType="submit" onClick={forceSubmit}>
          Save
        </Button>
        <Button type="default" onClick={handleCancel} style={{ marginLeft: 8 }}>
          Cancel
        </Button>
      </Form.Item>
    );
  };

  const forceSubmit = (): void => {
    formRef.current?.submit();
  };

  const isDisabled = (key: string): boolean => {
    if (resourceAction?.request !== undefined) {
      if (resourceAction.request.properties !== undefined) {
        if (key in resourceAction.request.properties) {
          return false;
        }
      }
    }

    return true;
  };

  const getPropertySchema = (key: string): Schema | null => {
    const requestSchema = resourceAction.request?.properties?.[key];
    const responseSchema = resourceAction.response?.properties?.[key];

    if (requestSchema !== undefined) {
      requestSchema.required = resourceAction.request?.required ?? false;
      return requestSchema;
    } else if (responseSchema !== undefined) {
      responseSchema.required = resourceAction.response?.required ?? false;
      return responseSchema;
    }

    return null;
  };

  const isRequired = (key: string): boolean => {
    const schema = getPropertySchema(key);

    return schema?.required ?? false;
  };

  const getDefaultValue = (key: string): any => {
    if (formType === ResourceTypes.UPDATE) {
      return result[key];
    }

    return resourceAction.request?.properties?.[key]?.default ?? null;
  };

  const renderInput = (key: string): React.ReactNode => {
    if (key in relationships) {
      return (
        <RelationshipInput
          key={key}
          resource={relationships[key]}
          defaultValue={getDefaultValue(key)}
          onChange={(value: any): void => {
            handleChange(key, value);
          }}
          controller={controller}
          disabled={isDisabled(key)}
        />
      );
    } else {
      return (
        <DynamicInput
          key={key}
          label={formatName(key)}
          defaultValue={getDefaultValue(key)}
          onChange={(value: any): void => {
            handleChange(key, value);
          }}
          disabled={isDisabled(key)}
          schema={getPropertySchema(key)}
        />
      );
    }
  };

  const renderInputs = (): React.ReactNode[] => {
    if (schemaKeys.length === 0) {
      return [];
    }

    return schemaKeys
      .map((key): React.ReactNode => {
        if (formType === ResourceTypes.CREATE && isDisabled(key)) {
          return null;
        }

        return (
          <Form.Item
            key={key}
            label={formatName(key)}
            tooltip={resourceAction.request?.properties?.[key]?.description}
            name={key}
            rules={[
              {
                required: isRequired(key),
                message: `Please insert ${key}`
              }
            ]}
          >
            {renderInput(key)}
          </Form.Item>
        );
      })
      .filter((item): React.ReactNode | null => item !== null);
  };

  const renderMobileButtons = (): React.ReactElement | null => {
    if (!isMobile) {
      return null;
    }

    return (
      <WrapperButtonsMobile>
        <Col>
          <Button type="default" onClick={handleCancel}>
            Cancel
          </Button>
        </Col>
        <Col>
          <Button type="primary" htmlType="submit" onClick={forceSubmit}>
            Save
          </Button>
        </Col>
      </WrapperButtonsMobile>
    );
  };

  if (loading) {
    return (
      <Row
        justify={'center'}
        align={'middle'}
        style={{
          height: '100%'
        }}
      >
        <Col>
          <Spin size="large" />
        </Col>
      </Row>
    );
  }

  return (
    <Row>
      <Col style={{ width: '100%' }}>
        <Header
          title={resourceAction.summary ?? resourceAction.resource}
          subtitle={resourceAction.getApiPath(null, false)}
          description={resourceAction.description}
          button={renderButtons()}
          resourceName={resourceAction.resource}
          typeName={resourceAction.type}
        />
        <Row>
          <Col style={{ width: '100%' }}>
            <Form
              onFinish={(_) => {
                handleSubmit().catch((error) => {
                  notification.error({
                    message: `Error submitting form: ${error}`
                  });
                });
              }}
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 14 }}
              layout="horizontal"
              style={{ width: '100%' }}
              ref={formRef}
            >
              {renderInputs()}
            </Form>
          </Col>
        </Row>
        {renderMobileButtons()}
      </Col>
    </Row>
  );
};

export default ItemForm;
