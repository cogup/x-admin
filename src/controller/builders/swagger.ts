import { type AxiosInstance } from 'axios';
import { ApiAdmin } from '../xadmin';

export function swagger(spec: any, axios: AxiosInstance): ApiAdmin {
  const schema = new ApiAdmin(
    {
      info: spec.data.info,
      tags: spec.data.tags,
      resources: {}
    },
    axios
  );

  return schema;
}
