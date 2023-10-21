import React, { useEffect, useState } from 'react';
import { AutoComplete, Input, notification, theme } from 'antd';
import {
  ResourceTypes,
  type Controller,
  type Resource,
  type Params
} from '../controller';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useQuerystring } from '../use';
import { AdminResourceReferencesType } from '../controller/xadmin';
import { toPlural } from '../utils';

interface SearchProps {
  controller: Controller;
}

const Search: React.FC<SearchProps> = ({ controller }): React.ReactElement => {
  const [searchResource, setSearchResource] = useState<Resource[]>([]);
  const [searchResourceInner, setSearchResourceInner] = useState<
    Record<string, Resource>
  >({});
  const [result, setResult] = useState<any[]>([]);
  const [inputValue, setInputValue] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const [currentResource, setCurrentResource] = useState<Resource | null>(null);
  const [autoSuggestionActive, setAutoSuggestionActive] =
    useState<boolean>(true);
  const [suggestionButton, setSuggestionButton] = useState<boolean>(false);
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const params = useQuerystring();

  const { token } = theme.useToken();

  useEffect(() => {
    const resourcesInners: Record<string, Resource> = {};
    const resources = controller
      .getAllGroupsName()
      .map((groupName) => {
        const resource = controller.getResourceSafe(
          groupName,
          ResourceTypes.SEARCH
        );

        if (resource === null) {
          return null;
        }

        const inner = controller.getResourceSafe(groupName, ResourceTypes.READ);

        if (inner === null) {
          return null;
        }

        resourcesInners[groupName] = inner;
        return resource;
      })
      .filter((resource): resource is Resource => resource !== null);

    setSearchResourceInner(resourcesInners);

    setSearchResource(resources);
  }, []);

  useEffect(() => {
    const resource = controller.getCurrentResource(location.pathname);

    if (
      resource === null ||
      resource === undefined ||
      resource === currentResource
    ) {
      return;
    }

    setCurrentResource(resource);

    const existSearch =
      resource.type !== ResourceTypes.SEARCH
        ? controller.getResourceSafe(
            resource?.resourceName,
            ResourceTypes.SEARCH
          ) !== null
        : false;

    if (existSearch) {
      setAutoSuggestionActive(false);
      setSuggestionButton(true);
      setDropdownOpen(false);

      const searchParam =
        resource?.getPropertyReferencesType(
          AdminResourceReferencesType.QUERY,
          'search'
        ) ?? 'q';

      setInputValue(params[searchParam] ?? '');
    } else {
      setAutoSuggestionActive(true);
      setDropdownOpen(false);
      setSuggestionButton(false);
    }
  }, [location]);

  function getTitle(resource: Resource, item: Params): string {
    if (resource.metadata !== undefined) {
      if (resource.metadata.search !== undefined) {
        const key = resource.metadata.search[0];
        return item[key];
      }
    }

    return resource.label;
  }

  const searchAllResource = async (value: string): Promise<void> => {
    const result = await Promise.all(
      searchResource.map(async (resource) => {
        if (
          currentResource !== null &&
          currentResource.type === ResourceTypes.LIST &&
          resource.resourceName === currentResource.resourceName
        ) {
          return null;
        }

        const data = await resource.call({
          query: { search: value, limit: 3 }
        });
        const moreCount = data.data.meta.totalItems - data.data.meta.length;
        const more = moreCount > 0 ? moreCount : undefined;

        return {
          label: renderTitle(
            resource.label,
            resource.getLocalPath({
              query: { search: value }
            }),
            more
          ),
          options: data.data.data.map(
            (item: Record<string, string | number>) => {
              const resourceInner = searchResourceInner[resource.resourceName];
              const resourcePathInner = resourceInner.getLocalPath({
                params: { id: item[resource.metadata?.id || 'id'] }
              });
              return renderItem(getTitle(resource, item), resourcePathInner);
            }
          )
        };
      })
    );

    const resultFiltered = result.filter(
      (item) => item !== null && item !== undefined
    );

    setResult(resultFiltered);
  };

  const onChange = (value: string): void => {
    setInputValue(value);

    searchAllResource(value).catch((_) => {
      notification.error({
        message: 'Error',
        description: 'Error on search'
      });
    });

    if (
      currentResource !== null &&
      currentResource.type === ResourceTypes.LIST
    ) {
      navigate(currentResource.getLocalPath({ query: { search: value } }));
    }
  };

  const handleSelect = (value: string, option: any): void => {
    navigate(option.key);
    setInputValue('');
    setResult([]);
  };

  const renderTitle = (
    title: string,
    path: string,
    total?: number
  ): React.ReactElement => (
    <span>
      {title}
      <Link style={{ float: 'right' }} to={path}>
        more {total}
      </Link>
    </span>
  );

  const renderItem = (title: string, path: string): any => ({
    key: path,
    value: title,
    label: (
      <Link
        style={{
          display: 'flex',
          justifyContent: 'space-between'
        }}
        to={path}
      >
        {title}
      </Link>
    )
  });

  const onEnterButtonClick = (e: any, event: any): void => {
    if (
      currentResource !== null &&
      currentResource.type === ResourceTypes.LIST
    ) {
      if (!autoSuggestionActive) {
        if (event.type === 'click' && !suggestionButton) {
          setSuggestionButton(true);
          setDropdownOpen(false);
          searchAllResource(inputValue).catch((_err) => {
            notification.error({
              message: 'Error',
              description: 'Error on search'
            });
          });
        } else if (event.type === 'click' && suggestionButton) {
          setSuggestionButton(false);
          setDropdownOpen(true);
        }
      }
    }
  };

  const onBlur = (e: any): void => {
    if (e.relatedTarget === null) {
      setDropdownOpen(false);
    }
  };

  const onFocus = (e: any): void => {
    if (e.relatedTarget === null && !suggestionButton) {
      setDropdownOpen(true);
    }
  };

  const onKeyUp = (e: any): void => {
    if (!suggestionButton) {
      setDropdownOpen(true);
    }
  };

  const textButton = (): string | undefined => {
    if (suggestionButton) {
      const plural = toPlural(currentResource?.label ?? '').toLowerCase();
      return `in ${plural}`;
    }

    return undefined;
  };

  return (
    <div
      style={{
        display: 'flex',
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        width: '400px',
        marginLeft: '2rem'
      }}
    >
      <AutoComplete
        popupClassName="certain-category-search-dropdown"
        options={result}
        onChange={onChange}
        onSelect={handleSelect}
        value={inputValue}
        onBlur={onBlur}
        open={dropdownOpen}
        onFocus={onFocus}
        onKeyUp={onKeyUp}
        style={{
          width: '400px'
        }}
      >
        <Input.Search
          size="large"
          placeholder="Search..."
          onSearch={onEnterButtonClick}
          enterButton={textButton()}
          style={{
            color: token.colorPrimary
          }}
        />
      </AutoComplete>
    </div>
  );
};

export default Search;
