/* eslint-disable @typescript-eslint/no-explicit-any */
import { validateEnv } from "./utils/validateEnv";
import { Client, Message, Interaction } from "discord.js";
import { connectDatabase } from "./database/database";
import { onReady } from "./events/onReady";
import { onInteraction } from "./events/onInteraction";
import { intentOptions } from "./config/intentOptions";
import { onMessageCreate } from "./events/onMessageCreate";

const client = new Client({ intents: intentOptions });
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const main = async () => {
  validateEnv();

  client.on("ready", onReadyHandler);
  client.on("messageCreate", onMessageCreateHandler);
  // Sam was here :)
  client.on("interactionCreate", async (interaction) => {
    await onInteractionHandler(interaction);
  });

  await connectDatabase();
  await client.login(process.env.botToken as string);
};

// * Deploy commands and set status.

const onReadyHandler = async (client: Client) => {
  await onReady(client);
};

// * Handle interactions (Including buttons, slash commands, context menus, ETC).

const onInteractionHandler = async (interaction: Interaction) => {
  await onInteraction(interaction);
};

// * Start the automod.

const onMessageCreateHandler = async (message: Message) => {
  await onMessageCreate(message);
};

// * Initialises the bot and connect to the database.

main();
