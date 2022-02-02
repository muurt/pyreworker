import {
  SlashCommandBuilder,
  SlashCommandSubcommandsOnlyBuilder,
} from "@discordjs/builders";
import { CommandInteraction } from "discord.js";

/*
 * ➞ CommandInt.ts
 * The interface for command files
 ! { name, description, usage, permissions? } are for the help command
 ! ? means that the value can be void
 */

export interface commandInt {
  data: SlashCommandBuilder | SlashCommandSubcommandsOnlyBuilder;
  name: string;
  description: string;
  usage: string;
  permissions?: string[];
  run: (interaction: CommandInteraction) => Promise<void>;
}
