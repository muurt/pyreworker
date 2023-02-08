/* eslint-disable @typescript-eslint/no-explicit-any */
import { validateEnv } from "./utils/validateEnv";
import { Client, Message, Interaction } from "discord.js";
import { connectDatabase } from "./database/database";
import { onReady } from "./events/onReady";
import { onInteraction } from "./events/onInteraction";
import { intentOptions } from "./config/intentOptions";
import { onMessageCreate } from "./events/onMessageCreate";
import { onMemberCreate } from "./events/onMemberCreate";
import { onMemberRemove } from "./events/onMemberRemove";
import { onMemberUpdate } from "./events/onMemberUpdate";
import { onChannelCreate } from "./events/onChannelCreate";
import { onChannelDelete } from "./events/onChannelDelete";
import { onChannelUpdate } from "./events/onChannelUpdate";
// import { onGuildBanAdd } from "./events/onGuildBanAdd";
// import { onGuildBanRemove } from "./events/onGuildBanRemove";
import { onGuildEmojiCreate } from "./events/onGuildEmojiCreate";
import { onGuildEmojiDelete } from "./events/onGuildEmojiDelete";
import { onGuildEmojiUpdate } from "./events/onGuildEmojiUpdate";
import { onRoleCreate } from "./events/onRoleCreate";
import { onRoleDelete } from "./events/onRoleDelete";
import { onRoleUpdate } from "./events/onRoleUpdate";
import { onGuildUpdate } from "./events/onGuildUpdate";
import { onGuildInviteCreate } from "./events/onGuildInviteCreate";
import { onGuildInviteDelete } from "./events/onGuildInviteDelete";
import { onMessageDelete } from "./events/onMessageDelete";
import { onMessageUpdate } from "./events/onMessageUpdate";

const client = new Client({ intents: intentOptions });
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const main = async () => {
  validateEnv();

  client.on("ready", onReadyHandler);
  client.on("messageCreate", onMessageCreateHandler);
  // Sam was here :)
  client.on("guildMemberAdd", onMemberCreate);
  client.on("guildMemberRemove", onMemberRemove);
  client.on("guildMemberUpdate", onMemberUpdate);
  client.on("channelCreate", onChannelCreate);
  client.on("channelDelete", onChannelDelete);
  client.on("channelUpdate", onChannelUpdate);
  // client.on("guildBanAdd", onGuildBanAdd);
  // client.on("guildBanRemove", onGuildBanRemove); doesn't work  for some reason.
  client.on("guildEmojiCreate", onGuildEmojiCreate);
  client.on("guildEmojiDelete", onGuildEmojiDelete);
  client.on("guildEmojiUpdate", onGuildEmojiUpdate);
  client.on("roleCreate", onRoleCreate);
  client.on("roleDelete", onRoleDelete);
  client.on("roleUpdate", onRoleUpdate);
  client.on("guildUpdate", onGuildUpdate);
  client.on("inviteCreate", onGuildInviteCreate);
  client.on("inviteDelete", onGuildInviteDelete);
  client.on("messageDelete", onMessageDelete);
  client.on("messageUpdate", onMessageUpdate);
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
