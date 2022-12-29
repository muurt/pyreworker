import {
  SlashCommandBuilder,
  SlashCommandSubcommandsOnlyBuilder,
} from "@discordjs/builders";
import { CommandInteraction, PermissionString } from "discord.js";

/**
 * An interface for a command.
 * @interface commandInt
 */
export interface commandInt {
  /**
   * The data for the command.
   * @type {SlashCommandBuilder | SlashCommandSubcommandsOnlyBuilder}
   */
  data: SlashCommandBuilder | SlashCommandSubcommandsOnlyBuilder;
  /**
   * The name of the command.
   * @type {string}
   */
  name: string;
  /**
   * The description of the command.
   * @type {string}
   */
  description: string;
  /**
   * The usage instructions for the command.
   * @type {string}
   */
  usage: string;
  /**
   * The permissions required to run the command.
   * @type {PermissionString[]}
   */
  permissions?: PermissionString[];
  /**
   * The function that runs the command.
   * @param {CommandInteraction} interaction - The interaction data for the command.
   * @returns {Promise<void>} - A promise that resolves when the command is finished running.
   */
  run: (interaction: CommandInteraction) => Promise<void>;
}
