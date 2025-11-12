import swaggorJSdoc from 'swagger-jsdoc';
import swaggorUI from 'swagger-ui-express';
import path from 'path';

const options = {
  definition: {
    openapi: '3.0.0', // Swagger version
    info: {
      title: 'Tour management (Tourista) API Documentation',
      version: '1.0.0',
      description: 'API documentation for Tourista',
    },
    servers: [
      {
        url: 'http://localhost:5002', // server URL
      },
    ],
  },

  apis: [
    path.join(__dirname, '../routes/*.ts'),
    path.join(__dirname, '../modules/**/*.ts'),
  ],
};

const swaggerSpec = swaggorJSdoc(options);

export { swaggorUI, swaggerSpec };
