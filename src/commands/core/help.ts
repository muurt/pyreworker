import { SlashCommandBuilder } from "@discordjs/builders";
import { MessageEmbed } from "discord.js";
import { commandInt } from "../../interfaces/commandInt";
import { errorHandler } from "../../utils/errorHandler";
import { colors } from "../../config/colors";
import { commandList } from "../_commandList";

// * Modular help menu.

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
          helpEmbed.addFields({
            name: `**${commandName}**`,
            value: commandDescription,
          });
        });

        helpEmbed
          .setColor(colors.success)
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
      commandData.forEach(async (command) => {
        if (command.name.toLowerCase() === optionFormatted) {
          exists = true;
          const { name, description, permissions, usage } = command;
          const dataEmbed = new MessageEmbed()
            .setTitle(name)
            .setAuthor({
              name: `${user.username}#${user.discriminator}`,
              iconURL: user.displayAvatarURL(),
            })
            .setColor(colors.success)
            .setDescription(description)
            .addFields({ name: "Usage", value: usage })
            .setFooter({
              text: "© Pyreworks",
              iconURL: interaction.client.user?.displayAvatarURL(),
            });
          if (permissions) {
            dataEmbed.addFields({
              name: "Permissions",
              value: permissions.toString(),
            });
          }
          await interaction.editReply({ embeds: [dataEmbed] });
        }
      });
      if (!exists) {
        const doesntExistEmbed = new MessageEmbed()
          .setTitle("ERROR!")
          .setAuthor({
            name: `${user.username}#${user.discriminator}`,
            iconURL: user.displayAvatarURL(),
          })
          .setColor(colors.error)
          .setDescription(`That command (${optionFormatted}) doesn't exist!.`)
          .setFooter({
            text: "© Pyreworks",
            iconURL: interaction.client.user?.displayAvatarURL(),
          });
        await interaction.editReply({ embeds: [doesntExistEmbed] });
      }
    } catch (err) {
      errorHandler("help command", err);
    }
  },
};
