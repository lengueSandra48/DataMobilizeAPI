import express, { Application } from "express";
import { setupSwagger } from "../swagger"; // Import the setupSwagger function
import path from "path";
import passport from "passport";
import session from "express-session";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { UserRoute } from "./routes/user.route";
import * as swaggerUi from "swagger-ui-express";
import * as swaggerDoc from "./swagger.json";

// language

import i18next from "i18next";
import Backend from "i18next-fs-backend";
import middleware from "i18next-http-middleware";
import en from "./locales/en/translation.json";
import fr from "./locales/fr/translation.json";
import { ReportRoute } from "./routes/report.route";
import { RoadTypeRoute } from "./routes/roadType.route";
import { IncidentRoute } from "./routes/incident.route";
import { CategoryRoute } from "./routes/category.route";
import {
  CALLBACK_URL,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  SESSION_SECRET,
} from "./startup/config";
import userService from "./services/user.service";

// setup i18next
i18next
  .use(Backend) // Connects the file system backend
  .use(middleware.LanguageDetector) // Enables automatic language detection
  .init({
    backend: {
      loadPath: path.join(
        process.cwd(),
        "src/locales",
        "{{lng}}",
        "{{ns}}.json"
      ), // Path to translation files
    },
    detection: {
      order: ["querystring", "cookie"], // Priority: URL query string first, then cookies
      caches: ["cookie"], // Cache detected language in cookies
    },
    fallbackLng: "fr", // Default language when no language is detected
    preload: ["en", "fr"], // Preload these languages at startup,
    resources: {
      en: en,
      fr: fr,
    },
  });

export const setupRestEndPoint = (app: Application) => {
  // Session setup
  app.use(
    session({
      secret: SESSION_SECRET,
      resave: false,
      saveUninitialized: true,
    })
  );

  // Passport initialization
  app.use(passport.initialize());
  app.use(passport.session());

  // Passport Google OAuth strategy
  passport.use(
    new GoogleStrategy(
      {
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: CALLBACK_URL,
      },
      async (accessToken, refreshToken, profile: any, done) => {
        const user = await userService.create({
          email: profile.emails[0].value,
          googleId: profile.id,
          expoPushToken: null,
          isVerified: true,
          localisation: "fr",
          password: null,
          username: profile.displayName,
        });
        return done(null, user);
      }
    )
  );

  // Serialize and deserialize user
  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser((user: any, done) => {
    done(null, user);
  });

  app.use(middleware.handle(i18next));
  app.use(express.json());
  app.use("/", UserRoute());
  app.use("/", ReportRoute());
  app.use("/", RoadTypeRoute());
  app.use("/", IncidentRoute());
  app.use("/", CategoryRoute());
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDoc));
};
