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
import { onGuildBanRemove } from "./events/onGuildBanRemove";
import { onGuildUpdate } from "./events/onGuildUpdate";
import { onGuildInviteCreate } from "./events/onGuildInviteCreate";
import { onGuildInviteDelete } from "./events/onGuildInviteDelete";
import { onMessageDelete } from "./events/onMessageDelete";
import { onMessageUpdate } from "./events/onMessageUpdate";
import { onStageInstanceDelete } from "./events/onStageInstanceDelete";
import { onStageInstanceUpdate } from "./events/onStageInstanceUpdate";
import { onStageInstanceCreate } from "./events/onStageInstanceCreate";
import { onThreadCreate } from "./events/onThreadCreate";
import { onThreadDelete } from "./events/onThreadDelete";
import { onThreadMembersUpdate } from "./events/onThreadMembersUpdate";
import { onThreadUpdate } from "./events/onThreadUpdate";
import { onGuildBanAdd } from "./events/onGuildBanAdd";

export const client = new Client({ intents: intentOptions });

const main = async () => {
  validateEnv();

  // * Ready event.
  client.on("ready", async (client) => {
    await onReadyHandler(client);
  });

  // * Message events.
  client.on("messageCreate", onMessageCreateHandler);
  client.on("messageDelete", onMessageDelete);
  client.on("messageUpdate", onMessageUpdate);

  // * Guild events.
  client.on("guildMemberAdd", onMemberCreate);
  client.on("guildMemberRemove", onMemberRemove);
  client.on("guildMemberUpdate", onMemberUpdate);
  client.on("guildBanAdd", onGuildBanAdd);
  client.on("guildBanRemove", onGuildBanRemove);
  client.on("guildUpdate", onGuildUpdate);

  // * Channel events.
  client.on("channelCreate", onChannelCreate);
  client.on("channelDelete", onChannelDelete);
  client.on("channelUpdate", onChannelUpdate);

  // * Invite events.
  client.on("inviteCreate", onGuildInviteCreate);
  client.on("inviteDelete", onGuildInviteDelete);

  // * Stage events.
  client.on("stageInstanceCreate", onStageInstanceCreate);
  client.on("stageInstanceDelete", onStageInstanceDelete);
  client.on("stageInstanceUpdate", onStageInstanceUpdate);

  // * Thread events.
  client.on("threadCreate", onThreadCreate);
  client.on("threadDelete", onThreadDelete);
  client.on("threadMembersUpdate", onThreadMembersUpdate);
  client.on("threadUpdate", onThreadUpdate);

  // * On interaction event.
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
