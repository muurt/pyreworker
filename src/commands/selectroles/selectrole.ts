import { SlashCommandBuilder } from "@discordjs/builders";
import { MessageActionRow, MessageButton, MessageEmbed } from "discord.js";
import { commandInt } from "../../interfaces/commandInt";
import { errorHandler } from "../../utils/errorHandler";
import { colors } from "../../config/colors";
import {} from "dotenv";

export const selectrole: commandInt = {
  data: new SlashCommandBuilder()
    .setName("selectrole")
    .setDescription("Create a new Role Select menu."),
  name: "selectrole",
  description: "Create a new Role Select menu.",
  usage: "/selectrole",
  // eslint-disable-next-line
  run: async (interaction: any) => {
    try {
      await interaction.deferReply();
      if (!interaction.memberPermissions?.has("MANAGE_ROLES")) {
        return interaction.followUp({
          content: "You do not have permission to use this command.",
          ephemeral: true,
        });
      }
      const embed = new MessageEmbed()
        .setTitle("Menu Select Roles")
        .setColor(colors.orange)
        .setDescription(
          `Start by adding some roles to the select menu! 
        
        \nClick "Confirm" once you are satisfied.`
        )
        .setFooter({
          text: "© Pyreworks",
          iconURL: interaction.client.user?.displayAvatarURL(),
        });
      const buttons = new MessageActionRow().addComponents(
        new MessageButton()
          .setCustomId("menu-add-role")
          .setLabel("Add Role")
          .setStyle("SUCCESS")
          .setEmoji("➕"),

        new MessageButton()
          .setCustomId("menu-remove-role")
          .setStyle("DANGER")
          .setLabel("Remove Role")
          .setEmoji("✖")
          .setDisabled(true),

        new MessageButton()
          .setCustomId("menu-confirm-role")
          .setStyle("PRIMARY")
          .setLabel("Confirm")
          .setEmoji("✔")
          .setDisabled(true)
      );

      interaction.followUp({ embeds: [embed], components: [buttons] });
    } catch (err) {
      errorHandler("selectrole", err);
    }
  },
};
