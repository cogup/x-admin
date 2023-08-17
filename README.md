# X-Admin: Documentation and Usage Guide

Welcome to the documentation for X-Admin, a React-based interface that simplifies the process of creating admin panels for APIs that have OpenAPI 3 documentation available. With X-Admin, you can effortlessly generate admin interfaces for your APIs by including a simple configuration parameter in your OpenAPI documentation.

## Getting Started

### Prerequisites

To use X-Admin, you'll need the following:

- A React application where you want to integrate the admin interface.
- An API with OpenAPI 3 documentation available.
- Basic knowledge of React and OpenAPI.

## Configuration

### 1. Add the `x-admin` Parameter to OpenAPI Documentation

To enable X-Admin for your API, simply add the `x-admin` parameter to your OpenAPI 3 documentation. This parameter will hold the configuration for your admin interface. Here's an example of how to use it:

```json
{
  "openapi": "3",
  "info": {
    "title": "My API"
  },
  "x-admin": {
    "resources": {
      "/api/comments": {
        "get": {
          "types": ["list", "search"],
          "resourceName": "Comments"
        },
        "post": {
          "types": ["create"],
          "resourceName": "Comment"
        }
      },
      // ... (other resource paths and their configurations)
    }
  },
  // ... (other API details)
} 
```

## 2. Admin Configuration Parameters

The `x-admin` parameter accepts the following configuration parameters:

- Resource Paths and Methods: Within the `resources` object, you define each resource path and its associated HTTP methods. For each method, you define the `types`, `resourceName`, and other relevant information.

- `types`: An array of strings representing CRUD operations ("create", "read", "update", "delete", "list", "search").

- `resourceName`: A string representing the name of the resource.

Here's an example of how you might use the `x-admin` parameter with correct formatting:

```json
{
  "openapi": "3",
  "info": {
    "title": "My API"
  },
  "x-admin": {
    "resources": {
      "/api/comments": {
        "get": {
          "types": ["list", "search"],
          "resourceName": "Comments"
        },
        "post": {
          "types": ["create"],
          "resourceName": "Comment"
        }
      },
      // ... (other resource paths and their configurations)
    }
  },
  // ... (other API details)
}
```

## Usage

After configuring your API's OpenAPI documentation, you can integrate X-Admin into your React application using the provided package.

### 1. Install Dependencies

Make sure you have the necessary dependencies installed in your project by running the following command:

```bash
npm install
```

### 2. Import and Use X-Admin Components

1. Import the necessary components from `x-admin`.

2. Use the imported components to generate the admin interfaces based on the provided configuration.

```jsx
import React from 'react';
import { AdminPanel, AdminResourceList, AdminResourceEdit } from 'x-admin';

function App() {
  return (
    <div>
      <h1>X-Admin Example</h1>
      <AdminPanel>
        <AdminResourceList resource="/api/comments" />
        <AdminResourceEdit resource="/api/comments" />
      </AdminPanel>
    </div>
  );
}

export default App;
```

## License

X-Admin is available under either the Apache License 2.0, as stated in the [LICENSE](https://raw.githubusercontent.com/cogup/x-admin/main/LICENSE) file.

## Conclusion

Congratulations! You now have a powerful tool at your disposal to quickly create admin interfaces for APIs with OpenAPI 3 documentation. With X-Admin, you can focus on building your application's functionality while letting the admin panel practically build itself. If you encounter any issues or need further assistance, feel free to consult the official documentation or seek help from the community.

For more information and advanced usage, please refer to the [X-Admin documentation](https://github.com/cogup/x-admin).

Happy coding!
