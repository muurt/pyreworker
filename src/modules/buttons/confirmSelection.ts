/* eslint-disable @typescript-eslint/no-explicit-any */
import { Modal, MessageActionRow, TextInputComponent } from "discord.js";

export const confirmSelectionEvent = async (interaction) => {
  if (!interaction.member.permissions.has("MANAGE_ROLES")) {
    return interaction.reply({
      content: `❌ - You do not have the \`MANAGE_ROLES\` permission.`,
      ephemeral: true,
    });
  }

  const modal = new Modal()
    .setCustomId("menu-role-channel")
    .setTitle("One Last Thing")
    .addComponents(
      new MessageActionRow<any>().addComponents(
        new TextInputComponent()
          .setCustomId("channel")
          .setLabel("What channel must I send the select menu to?")
          .setPlaceholder(`#${interaction.channel.name}`)
          .setStyle("SHORT")
          .setRequired(false)
      ),

      new MessageActionRow<any>().addComponents(
        new TextInputComponent()
          .setCustomId("title")
          .setLabel("Add a title to the menu roles message.")
          .setPlaceholder("Self Assignable Roles")
          .setStyle("SHORT")
          .setRequired(false)
      ),

      new MessageActionRow<any>().addComponents(
        new TextInputComponent()
          .setCustomId("description")
          .setLabel("Add a description to the menu roles message")
          .setPlaceholder(
            "Select some roles to add them to your profile, and this could include perks or access to channels."
          )
          .setStyle("PARAGRAPH")
          .setRequired(false)
      ),

      new MessageActionRow<any>().addComponents(
        new TextInputComponent()
          .setCustomId("color")
          .setLabel("Set the color of the embed. Must be Hex code.")
          .setPlaceholder("#ff00ff")
          .setStyle("SHORT")
          .setRequired(false)
      )
    );

  await interaction.showModal(modal);
};
