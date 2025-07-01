# Flutry

<p align="center">
  <img src="assets/logo.png" alt="Flutry Logo" width="150" />
</p>

<p align="center">
  <a href="https://opensource.org/licenses/MIT">
    <img src="https://img.shields.io/badge/license-MIT-green.svg" alt="License" />
  </a>
</p>

This project is an advanced, flexible, and easily extensible REST API environment built on Node.js and TypeScript. The goal of the API is to provide a universal backend solution featuring automatic routing, model management, support for multiple databases, and security features.

---

## Table of Contents

- [Key Features](#key-features)
- [Technology Stack](#technology-stack)
- [Functionality](#functionality)
- [API Endpoints](#api-endpoints)
- [Authentication and Security](#authentication-and-security)
- [Error Handling](#error-handling)
- [Performance and Limitations](#performance-and-limitations)
- [Installation and Running](#installation-and-running)
- [Developer Tools and Future Development](#developer-tools-and-future-development)
- [License](#license)

---

## Key Features

- **Automatic Routing and Model Handling**: The API automatically manages routes and data models, making it quick and easy to extend.
- **Multiple Database Support**: Supports Sequelize (relational databases).
- **Security**: JWT-based authentication and encryption solutions.
- **Flexible Web Server Choice**: Support for Express.js and Fastify, selectable as needed.
- **Error Handling**: Automatic 404 and 500 error handling to ensure server stability.
- **Rate Limiting**: Built-in rate limit protection for Express.js; Fastify support is under development.
- **Easy Extensibility**: Anything you develop—new endpoints, models, or middleware—can be integrated into the system.

---

## Technology Stack

- **Backend**: Node.js, TypeScript
- **Web Server**: Express.js, Fastify (selectable)
- **Databases**: Sequelize (relational databases)
- **Authentication**: JWT (JSON Web Token)
- **Rate Limiting**: express-rate-limit (for Express)
- **Other**: Automatic routing and model generation

---

## Functionality

This API is not just a simple REST service, but a complex environment that:

- Can handle any data model defined by the developer.
- Automatically creates the corresponding endpoints.
- Provides secure access with JWT tokens and encryption.
- Automatically handles errors and nonexistent routes.
- Supports multiple database engines, making it flexible for various projects.
- Supports different web servers, allowing easy switching between Express and Fastify.

---

## API Endpoints

- **Default Health Check Endpoint**:  
  `GET /health`  
  Returns the server status to indicate whether the API is available.

- **Error Handling Endpoints**:
  - `404 Not Found`: When a nonexistent route is requested.
  - `500 Internal Server Error`: When an unexpected server error occurs.

---

## Authentication and Security

- **JWT-Based Authentication**: The API supports JSON Web Token authentication, a secure and widely-used method.
- **Encryption**: The system includes built-in encryption mechanisms, with the option to integrate custom solutions.
- **Flexible Extensibility**: Core features and infrastructure are built on a stable, external npm package that should not be modified. Instead, the system is designed to allow easy integration of custom authentication, authorization, or other business logic without altering the foundations. This ensures the project remains adaptable while maintaining stability and updatability.

---

## Error Handling

- **Automatic 404 Handling**: The API automatically returns a 404 response when a nonexistent route is called.
- **Automatic 500 Handling**: In the case of unexpected server errors, the API returns a 500 status code and prevents server crashes.
- **Stability**: The purpose of error handling is to ensure the server remains accessible even in the event of critical failures.

---

## Performance and Limitations

- **Rate Limiting**: Express.js-based servers include built-in rate limiting protection to prevent excessive requests and safeguard the API from overload. The rate limiting settings can be found in `/src/utils/ratelimit.ts`.
- **For Fastify**: Rate limiting is still under development and will be available soon.
- **Caching**: Currently, there is no built-in caching, but the system can easily be extended with such a feature.

---

## Installation and Running

```bash
npm install -g @flutry/cli
flutry new my-app
cd my-app
yarn install
yarn dev
```

OR

```bash
npx @flutry/cli new my-app
yarn install
yarn dev
```

You can find the detailed documentation of the CLI at the [Flutry CLI Documentation](https://flutry.com/docs/package/cli) page.

---

## Developer Tools and Future Development

- Currently, there is no Swagger or OpenAPI documentation available. However, our [website documentation](https://flutry.com/docs) contains detailed descriptions and code examples to help with using and integrating the API.
- SDKs or Postman collections are not yet available, but thanks to the system’s automatic routing, it can be easily tested with any HTTP client.
- Fastify rate limiting is under development and will be available soon.

---

## License (MIT)

This project is free to use and modify according to your own needs.  
If you share it publicly, please credit the author and the source.

---

If you have any questions or suggestions, feel free to reach out!

---

Thank you for using this system!
