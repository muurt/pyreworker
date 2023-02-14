import {
  Modal,
  MessageActionRow,
  ModalActionRowComponent,
  TextInputComponent,
  MessageEmbed,
} from "discord.js";
import { colors } from "../../config/colors";
export const addRoleEvent = async (interaction) => {
  try {
    if (interaction.customId !== "menu-add-role") {
      return;
    } else if (!interaction.member.permissions.has("MANAGE_ROLES")) {
      const noPermissionsEmbed = new MessageEmbed()
        .setTitle("ERROR!")
        .setAuthor({
          name: `${interaction.user.username}#${interaction.user.discriminator}`,
          iconURL: interaction.user.displayAvatarURL(),
        })
        .setColor(colors.black)
        .setDescription("You don't have the required permission(s).")
        .setFooter({
          text: "© Pyreworks",
          iconURL: interaction.client.user?.displayAvatarURL(),
        });
      return interaction.reply({
        embeds: [noPermissionsEmbed],
        ephemeral: true,
      });
    } else {
      const modal = new Modal()
        .setCustomId("add-role-to-menu")
        .setTitle("Add a role to the select menu.")
        .addComponents(
          new MessageActionRow<ModalActionRowComponent>().addComponents(
            new TextInputComponent()
              .setCustomId("role")
              .setLabel("Enter the role's ID.")
              .setStyle("SHORT")
              // eslint-disable-next-line prettier/prettier, quotes
              .setPlaceholder("The ID/Name")
              .setRequired(true)
          ),

          new MessageActionRow<ModalActionRowComponent>().addComponents(
            new TextInputComponent()
              .setCustomId("description")
              .setLabel("Add a description explaining the role.")
              .setPlaceholder("This role's awesome!")
              .setStyle("SHORT")
              .setRequired(false)
          )
        );
      await interaction.showModal(modal);
    }
  } catch (err) {
    console.log(err);
  }
};
