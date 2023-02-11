/* eslint-disable @typescript-eslint/no-explicit-any */
import { validateEnv } from "./utils/validateEnv";
import { Client, Message, Interaction } from "discord.js";
import { connectDatabase } from "./database/database";
import { onReady } from "./events/onReady";
import { onInteraction } from "./events/onInteraction";
import { intentOptions } from "./config/intentOptions";
import { onMessageCreate } from "./events/onMessageCreate";
import { onMemberCreate } from "./events/onMemberCreate"; // works
import { onMemberRemove } from "./events/onMemberRemove"; // works
import { onMemberUpdate } from "./events/onMemberUpdate"; // works
import { onChannelCreate } from "./events/onChannelCreate"; // works
import { onChannelDelete } from "./events/onChannelDelete"; // works
import { onChannelUpdate } from "./events/onChannelUpdate"; // works
import { onGuildBanRemove } from "./events/onGuildBanRemove"; // works
import { onGuildUpdate } from "./events/onGuildUpdate"; // works
import { onGuildInviteCreate } from "./events/onGuildInviteCreate"; // works
import { onGuildInviteDelete } from "./events/onGuildInviteDelete"; // works
import { onMessageDelete } from "./events/onMessageDelete"; // works
import { onMessageUpdate } from "./events/onMessageUpdate"; // works
import { onStageInstanceDelete } from "./events/onStageInstanceDelete"; // works
import { onStageInstanceUpdate } from "./events/onStageInstanceUpdate"; // works
import { onStageInstanceCreate } from "./events/onStageInstanceCreate"; // works
import { onThreadCreate } from "./events/onThreadCreate"; // works
import { onThreadDelete } from "./events/onThreadDelete"; // works
import { onThreadMembersUpdate } from "./events/onThreadMembersUpdate"; // works
import { onThreadUpdate } from "./events/onThreadUpdate"; // works
import { onGuildBanAdd } from "./events/onGuildBanAdd";
export const client = new Client({ intents: intentOptions });
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const main = async () => {
  validateEnv();

  // Ready event.
  client.on("ready", onReadyHandler);

  // Message events.
  client.on("messageCreate", onMessageCreateHandler);
  client.on("messageDelete", onMessageDelete);
  client.on("messageUpdate", onMessageUpdate);

  // Guild events.
  client.on("guildMemberAdd", onMemberCreate);
  client.on("guildMemberRemove", onMemberRemove);
  client.on("guildMemberUpdate", onMemberUpdate);
  // client.on("guildBanAdd", async (guild: any, user: any) => {
  //   if (onMemberRemove.kicked === true) {
  //     return;
  //   } else {
  //     await onGuildBanAdd(guild, user);
  //   }
  // });
  client.on("guildBanRemove", onGuildBanRemove);
  client.on("guildUpdate", onGuildUpdate);

  // Channel events.
  client.on("channelCreate", onChannelCreate);
  client.on("channelDelete", onChannelDelete);
  client.on("channelUpdate", onChannelUpdate);

  // Invite events.
  client.on("inviteCreate", onGuildInviteCreate);
  client.on("inviteDelete", onGuildInviteDelete);

  // Stage events.
  client.on("stageInstanceCreate", onStageInstanceCreate);
  client.on("stageInstanceDelete", onStageInstanceDelete);
  client.on("stageInstanceUpdate", onStageInstanceUpdate);

  // Thread events.
  client.on("threadCreate", onThreadCreate);
  client.on("threadDelete", onThreadDelete);
  client.on("threadMembersUpdate", onThreadMembersUpdate);
  client.on("threadUpdate", onThreadUpdate);

  // On interaction event.
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
