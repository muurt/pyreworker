import { validateEnv } from "./utils/validateEnv";
import { Client } from "discord.js";
import { connectDatabase } from "./database/database";
import { onReady } from "./events/onReady";
import { onInteraction } from "./events/onInteraction";
import { intentOptions } from "./config/intentOptions";
import { onMessageCreate } from "./events/onMessageCreate";

(async () => {
  validateEnv();

  const client = new Client({ intents: intentOptions });

  client.on("ready", async () => await onReady(client));

  client.on(
    "interactionCreate",
    async (interaction) => await onInteraction(interaction)
  );

  client.on("messageCreate", async (message) => await onMessageCreate(message));

  await connectDatabase();

  await client.login(process.env.botToken as string);
})();
