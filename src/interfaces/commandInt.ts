import {
  SlashCommandBuilder,
  SlashCommandSubcommandsOnlyBuilder,
} from "@discordjs/builders";
import { CommandInteraction, PermissionString } from "discord.js";
export interface commandInt {
  data: SlashCommandBuilder | SlashCommandSubcommandsOnlyBuilder;
  name: string;
  description: string;
  usage: string;
  permissions?: PermissionString[];
  run: (interaction: CommandInteraction) => Promise<void>;
}
