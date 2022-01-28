import { logHandler } from "./logHandler";

export const validateEnv = (): void => {
  if (!process.env.BOT_TOKEN) {
    logHandler.log("warn", "Missing environment variable | BOT_TOKEN");
    process.exit(1);
  }

  if (!process.env.MONGO_URI) {
    logHandler.log("warn", "Missing environment variable | MONGO_URI");
    process.exit(1);
  }

  if (!process.env.SENTRY_DSN) {
    logHandler.log("warn", "Missing environment variable | SENTRY_DSN");
    process.exit(1);
  }
};
