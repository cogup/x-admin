import React, { useEffect, useState } from 'react';
import { AutoComplete, Input, theme } from 'antd';
import styled from 'styled-components';
import {
  ResourceTypes,
  type Controller,
  type Resource,
  type Params
} from '../controller';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useQuerystring } from '../use';
import { AdminResourceReferencesType } from '../controller/xadmin';

interface StyleProps {
  theme?: Record<string, string>;
  activeSuggestions: boolean;
}

const SearchStyled = styled.div<StyleProps>`
  display: flex;
  flex: 1;
  justify-content: flex-start;
  align-items: center;
  width: 400px;
  margin-left: 2rem;

  .search-input {
    width: 400px;

    ${(props): string => {
      if (props.activeSuggestions === true) {
        return `
            button {
              background-color: ${props.theme.colorPrimary as string};
              svg {
                color: ${props.theme.colorWhite as string};
              }
            }
          `;
      } else {
        return '';
      }
    }}
  }
`;
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
  const [lastResource, setLastResource] = useState<Resource | null>(null);
  const { token: themeToken } = theme.useToken();
  const params = useQuerystring();

  useEffect(() => {
    const resource = controller.getCurrentResource(location.pathname);

    if (
      resource !== null &&
      resource !== undefined &&
      resource === lastResource
    ) {
      return;
    }

    setLastResource(currentResource);
    setCurrentResource(resource);
    setDropdownOpen(false);
    setSuggestionButton(false);
    const searchParam =
      resource?.getPropieriesReferencesType(
        AdminResourceReferencesType.QUERY,
        'searchTerm'
      ) ?? 'q';
    setInputValue(params[searchParam] ?? '');

    const isList =
      resource !== null &&
      (resource.type === ResourceTypes.LIST ||
        resource.type === ResourceTypes.SEARCH);

    if (isList) {
      setAutoSuggestionActive(false);
      setSuggestionButton(true);
      setDropdownOpen(false);
    }
  }, [location.pathname]);

  useEffect(() => {
    const resourcesInners: Record<string, Resource> = {};
    const resources = controller
      .getAllGroupsName()
      .map((groupName) => {
        try {
          const resource = controller.getResource(
            groupName,
            ResourceTypes.SEARCH
          );
          const inner = controller.getResource(groupName, ResourceTypes.READ);

          resourcesInners[groupName] = inner;
          return resource;
        } catch (err) {
          return null;
        }
      })
      .filter((resource): resource is Resource => resource !== null);

    setSearchResourceInner(resourcesInners);

    setSearchResource(resources);
  }, []);

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
          resource.resource === currentResource.resource
        ) {
          return null;
        }

        const data = await resource.call({
          query: { searchTerm: value, pageSize: 3 }
        });
        const moreCount = data.data.meta.totalItems - data.data.meta.length;
        const more = moreCount > 0 ? moreCount : undefined;

        return {
          label: renderTitle(
            resource.label,
            resource.getLocalPath({
              query: { searchTerm: value }
            }),
            more
          ),
          options: data.data.data.map(
            (item: Record<string, string | number>) => {
              const resourceInner = searchResourceInner[resource.resource];
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

    searchAllResource(value).catch((_) => {});

    if (
      currentResource !== null &&
      currentResource.type === ResourceTypes.LIST
    ) {
      navigate(currentResource.getLocalPath({ query: { searchTerm: value } }));
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
          searchAllResource(inputValue).catch((_err) => {});
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
      return `Search ${currentResource?.label}s`;
    }

    return undefined;
  };

  return (
    <SearchStyled theme={themeToken} activeSuggestions={suggestionButton}>
      <AutoComplete
        popupClassName="certain-category-search-dropdown"
        options={result}
        className="search-input"
        onChange={onChange}
        onSelect={handleSelect}
        value={inputValue}
        onBlur={onBlur}
        open={dropdownOpen}
        onFocus={onFocus}
        onKeyUp={onKeyUp}
      >
        <Input.Search
          size="large"
          placeholder="Search..."
          onSearch={onEnterButtonClick}
          enterButton={textButton()}
        />
      </AutoComplete>
    </SearchStyled>
  );
};

export default Search;
