import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Application } from "express";

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Documentation",
      version: "1.0.0",
      description: "API documentation for your project",
    },
    servers: [
      {
        url: "http://localhost:3010", // URL de l'API
      },
    ],
  },
  apis: ["./routes/*.route.ts"], // chemin vers les routes
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

export const setupSwagger = (app: Application) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
  console.log("Swagger docs available at http://localhost:3010/api-docs");
};
