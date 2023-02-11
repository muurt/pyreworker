/* eslint-disable @typescript-eslint/no-explicit-any */
import { MessageActionRow, MessageButton, MessageEmbed } from "discord.js";

export const removeRoleFromMenu = async (interaction) => {
  if (!interaction.member.permissions.has("MANAGE_ROLES")) {
    return interaction.reply({
      content: `❌ - You do not have the \`MANAGE_ROLES\` permission.`,
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

  // eslint-disable-next-line prefer-const
  let roleList: number[] = [];
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
