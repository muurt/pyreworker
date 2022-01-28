import * as Sentry from "@sentry/node";
import { RewriteFrames } from "@sentry/integrations";
import { validateEnv } from "./utils/validateEnv";
import { Client } from "discord.js";
import { connect } from "./database/database";
import { onReady } from "./events/onReady";
import { onInteraction } from "./events/onInteraction";
import { IntentOptions } from "./config/IntentOptions";

(async () => {
  validateEnv();

  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    tracesSampleRate: 1.0,
    integrations: [
      new RewriteFrames({
        root: global.__dirname,
      }),
    ],
  });

  const WORKER = new Client({ intents: IntentOptions });

  WORKER.on("ready", async () => await onReady(WORKER));

  WORKER.on(
    "interactionCreate",
    async (interaction) => await onInteraction(interaction)
  );

  await connect();

  await WORKER.login(process.env.BOT_TOKEN as string);
})();
