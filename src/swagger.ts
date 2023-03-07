import swaggerJSDoc from "swagger-jsdoc";

export const swaggerOptions = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Persona Express API with Swagger",
        version: "0.1.0",
        description:
          "This is a simple CRUD API application made with Express and documented with Swagger",
        license: {
          name: "MIT",
          url: "https://spdx.org/licenses/MIT.html",
        },
        contact: {
          name: "Persona",
          url: "http://146.56.145.39",
          email: "awesomedev3@gmail.com",
        },
      },
      servers: [
        {
            url: "http://localhost:4000",
        },
        {
          url: "http://146.56.145.39:4000",
        },
      ],
    },
    apis: ["./models/users.js"],
  };
