import { validateEnv } from "./utils/validateEnv";
import { Client } from "discord.js";
import { connectDatabase } from "./database/database";
import { onReady } from "./events/onReady";
import { onInteraction } from "./events/onInteraction";
import { intentOptions } from "./config/intentOptions";

/*
 * ➞ Index.ts
 * The main entry point of the bot
 * This validates the env variables
 * connects the bot to discord and handles events
 */

(async () => {
  validateEnv();

  const client = new Client({ intents: intentOptions });

  client.on("ready", async () => await onReady(client));

  client.on(
    "interactionCreate",
    async (interaction) => await onInteraction(interaction)
  );

  await connectDatabase();

  await client.login(process.env.botToken as string);
})();
