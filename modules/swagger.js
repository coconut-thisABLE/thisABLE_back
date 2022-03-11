const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');

const options = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'thisABLE API Document',
      version: '1.0.0',
      description: `Google Developer Students Club Team Coconut's project thisABLE`,
    },
    host: '',
    schemes: ['https'],
    basePath: '/',
  },
  apis: [__dirname + '/../api/routes/*.js', __dirname + '/../api/swagger/*'],
};

const specs = swaggerJsDoc(options);

module.exports = {
  swaggerUi,
  specs,
};
