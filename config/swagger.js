const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Library Management System API',
      version: '1.0.0',
      description: 'A simple API for managing a library system',
    },
    servers: [
        {
            url: 'https://lms-cas-test.up.railway.app/'
        },
      {
        url: 'http://localhost:8000',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./routes/*.js', './models/*.js'], // files containing annotations
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
