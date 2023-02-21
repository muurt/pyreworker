import { MessageActionRow, MessageButton, MessageEmbed } from "discord.js";
import { colors } from "../../config/colors";

export const removeRoleFromMenu = async (interaction) => {
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

  const oldEmbed = interaction.message.embeds[0];
  const oldRoleList = oldEmbed.fields[0].value.split(`\n`);
  const embed = new MessageEmbed()
    .setTitle(oldEmbed.title)
    .setDescription(oldEmbed.description)
    .setColor(oldEmbed.color)
    .setFooter(oldEmbed.footer);

  const roleList: number[] = [];
  for (const line of oldRoleList) {
    const roleId = line.split(" - ")[0].replace(/[<@&>]/g, "");

    if (interaction.values[0] === roleId) {
      continue;
    }

    roleList.push(line);
  }

  let disabled = false;
  if (+roleList < 1) {
    disabled = true;
  } else {
    embed.addFields({
      name: "Menu Roles",
      value: roleList.join(`\n`),
    });
  }

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
      .setDisabled(disabled),

    new MessageButton()
      .setCustomId("menu-confirm-role")
      .setStyle("PRIMARY")
      .setLabel("Confirm Selection")
      .setEmoji("✔")
      .setDisabled(disabled)
  );

  interaction.update({ embeds: [embed], components: [buttons] });
};
