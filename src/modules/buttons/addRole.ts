/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Modal,
  MessageActionRow,
  ModalActionRowComponent,
  TextInputComponent,
} from "discord.js";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const addRoleEvent = async (client: any) => {
  client.on("interactionCreate", async (interaction: any) => {
    try {
      if (interaction.customId !== "menu-add-role") {
        return;
      } else if (!interaction.member.permissions.has("MANAGE_ROLES")) {
        return interaction.reply({
          content: `❌ - You do not have the \`MANAGE_ROLES\` permission.`,
          ephemeral: true,
        });
      } else {
        const modal = new Modal()
          .setCustomId("add-role-to-menu")
          .setTitle("Add a Role to the Selection Menu")
          .addComponents(
            new MessageActionRow<ModalActionRowComponent>().addComponents(
              new TextInputComponent()
                .setCustomId("role")
                .setLabel("Enter the role's name or the role's id.")
                // eslint-disable-next-line prettier/prettier
                .setPlaceholder("\"Some random role\" or \"123456789012345678\"")
                .setStyle("SHORT")
                .setRequired(true)
            ),

            new MessageActionRow<ModalActionRowComponent>().addComponents(
              new TextInputComponent()
                .setCustomId("description")
                .setLabel("Add a description explaining the role.")
                .setPlaceholder("This role unlocks cool channels")
                .setStyle("SHORT")
                .setRequired(false)
            )
          );
        await interaction.showModal(modal);
      }
    } catch (err) {
      console.log(err);
    }
  });
};
