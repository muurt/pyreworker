import {
  SlashCommandBuilder,
  SlashCommandSubcommandsOnlyBuilder,
} from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
export interface commandInt {
  data: SlashCommandBuilder | SlashCommandSubcommandsOnlyBuilder;
  name: string;
  description: string;
  usage: string;
  permissions?: string[];
  run: (interaction: CommandInteraction) => Promise<void>;
}
