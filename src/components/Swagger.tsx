import React from 'react';
import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';
import { Controller } from '../controller';

interface SwaggerUIProps {
  constroller: Controller;
}

const SwaggerUIComponent = ({
  constroller
}: SwaggerUIProps): React.ReactElement => {
  return <SwaggerUI url={constroller.getDocFullUrl()} />;
};

export default SwaggerUIComponent;
