import {
  Modal,
  MessageActionRow,
  TextInputComponent,
  MessageEmbed,
} from "discord.js";
import { colors } from "../../config/colors";

export const confirmSelectionEvent = async (interaction) => {
  if (!interaction.member.permissions.has("MANAGE_ROLES")) {
    const noPermissionsEmbed = new MessageEmbed()
      .setTitle("ERROR!")
      .setAuthor({
        name: `${interaction.user.username}#${interaction.user.discriminator}`,
        iconURL: interaction.user.displayAvatarURL(),
      })
      .setColor(colors.error)
      .setDescription("You don't have the required permission(s).")
      .setFooter({
        text: "© Pyreworks",
        iconURL: interaction.client.user?.displayAvatarURL(),
      });
    return interaction.reply({
      embeds: [noPermissionsEmbed],
      ephemeral: true,
    });
  }

  const modal = new Modal()
    .setCustomId("menu-role-channel")
    .setTitle("Before we finish")
    .addComponents(
      new MessageActionRow<TextInputComponent>().addComponents(
        new TextInputComponent()
          .setCustomId("channel")
          .setLabel("Where should I send the embed now?")
          .setPlaceholder(`#${interaction.channel.name}`)
          .setStyle("SHORT")
          .setRequired(false)
      ),

      new MessageActionRow<TextInputComponent>().addComponents(
        new TextInputComponent()
          .setCustomId("title")
          .setLabel("Add a title to the embed.")
          .setPlaceholder("Self Assignable Roles")
          .setStyle("SHORT")
          .setRequired(false)
      ),

      new MessageActionRow<TextInputComponent>().addComponents(
        new TextInputComponent()
          .setCustomId("description")
          .setLabel("Add a description to the menu roles message")
          .setPlaceholder(
            "Select some roles to add them to your profile, and this could include perks or access to channels."
          )
          .setStyle("PARAGRAPH")
          .setRequired(false)
      ),

      new MessageActionRow<TextInputComponent>().addComponents(
        new TextInputComponent()
          .setCustomId("color")
          .setLabel("Set the color of the embed. Must be Hex code.")
          .setPlaceholder(colors.success)
          .setStyle("SHORT")
          .setRequired(false)
      )
    );

  await interaction.showModal(modal);
};
