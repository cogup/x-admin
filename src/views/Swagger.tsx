import React from 'react';
import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';
import { Controller } from '../controller';

interface SwaggerUIProps {
  controller: Controller;
}

const SwaggerUIComponent = ({
  controller
}: SwaggerUIProps): React.ReactElement => {
  return <SwaggerUI spec={controller.getSpecification()} />;
};

export default SwaggerUIComponent;
