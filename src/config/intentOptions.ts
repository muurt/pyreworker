import { IntentsString } from "discord.js";

/*
 * ➞ IntentOptions.ts
 * Exports an "IntentsString" object which is a list of intents
 * that are defined in the Client object
 ! This is all the possible intents
 */

export const intentOptions: IntentsString[] = [
  "GUILDS",
  "GUILD_MEMBERS",
  "GUILD_BANS",
  "GUILD_EMOJIS_AND_STICKERS",
  "GUILD_INTEGRATIONS",
  "GUILD_INVITES",
  "GUILD_MESSAGE_REACTIONS",
  "GUILD_MESSAGE_TYPING",
  "GUILD_MESSAGES",
  "GUILD_PRESENCES",
  "GUILD_SCHEDULED_EVENTS",
  "GUILD_VOICE_STATES",
  "GUILD_WEBHOOKS",
  "DIRECT_MESSAGE_REACTIONS",
  "DIRECT_MESSAGE_TYPING",
  "DIRECT_MESSAGES",
];
