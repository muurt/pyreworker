import { SlashCommandBuilder } from "@discordjs/builders";
import { MessageEmbed } from "discord.js";
import { commandInt } from "../interfaces/commandInt";
import { errorHandler } from "../utils/errorHandler";
import { colors } from "../config/colors";
import { commandList } from "./_commandList";

/*
 * ➞ Help
 * ➞ command | OPTIONAL - The command to get info about
 * ➞ Permissions | NONE
 * If the option is given, provide info about
 * a command such as { usage, permissions, description, name }
 * If not, provide the universal help menu
 */

export const help: commandInt = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Provides information on using this bot.")
    .addStringOption((option) =>
      option.setName("command").setDescription("The command to get info on.")
    ) as SlashCommandBuilder,
  name: "help",
  description: "View the help menu (or) info about a certain command.",
  usage: "/help <command?>",
  run: async (interaction) => {
    try {
      const { user } = interaction;
      const commandOption = interaction.options.getString("command");
      await interaction.deferReply();
      const commandData: {
        name: string;
        description: string;
        usage: string;
        permissions?: string[];
      }[] = [];
      commandList.forEach((command) =>
        commandData.push({
          name: command.name,
          description: command.description,
          usage: command.usage,
          permissions: command.permissions,
        })
      );
      if (!commandOption) {
        const helpEmbed = new MessageEmbed()
          .setTitle("HELP")
          .setDescription(
            "This is the help menu, do /help (command) for more info."
          );
        commandData.forEach((command) => {
          const commandName = command.name;
          const commandDescription = command.description;
          helpEmbed.addField(`**${commandName}**`, commandDescription);
        });

        helpEmbed
          .setColor(colors.orange)
          .setAuthor({
            name: `${user.username}#${user.discriminator}`,
            iconURL: user.displayAvatarURL(),
          })
          .setFooter({
            text: "© Pyreworks",
            iconURL: interaction.client.user?.displayAvatarURL(),
          });
        interaction.editReply({ embeds: [helpEmbed] });
        return;
      }
      const optionFormatted = commandOption
        .toLowerCase()
        .replace(/(,|;|\s)\s*/g, "");
      let exists = false;
      commandData.forEach((command) => {
        if (command.name.toLowerCase() === optionFormatted) {
          exists = true;
          const { name, description, permissions, usage } = command;
          const dataEmbed = new MessageEmbed()
            .setTitle(name)
            .setAuthor({
              name: `${user.username}#${user.discriminator}`,
              iconURL: user.displayAvatarURL(),
            })
            .setColor(colors.orange)
            .setDescription(description)
            .addField("Usage", usage)
            .setFooter({
              text: "© Pyreworks",
              iconURL: interaction.client.user?.displayAvatarURL(),
            });
          if (permissions !== undefined) {
            dataEmbed.addField("Permissions", permissions.toString());
          }
          interaction.editReply({ embeds: [dataEmbed] });
        }
      });
      if (!exists) {
        const doesntExistEmbed = new MessageEmbed()
          .setTitle("ERROR!")
          .setAuthor({
            name: `${user.username}#${user.discriminator}`,
            iconURL: user.displayAvatarURL(),
          })
          .setColor(colors.black)
          .setDescription(`That command (${optionFormatted}) doesn't exist!.`)
          .setFooter({
            text: "© Pyreworks",
            iconURL: interaction.client.user?.displayAvatarURL(),
          });
        interaction.editReply({ embeds: [doesntExistEmbed] });
      }
    } catch (err) {
      errorHandler("help command", err);
    }
  },
};
