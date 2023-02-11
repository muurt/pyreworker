/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prefer-const */
import { MessageActionRow, MessageSelectMenu } from "discord.js";

export const removeRoleEvent = async (interaction) => {
  if (!interaction.member.permissions.has("MANAGE_ROLES")) {
    return interaction.reply({
      content: `❌ - You do not have the \`MANAGE_ROLES\` permission.`,
      ephemeral: true,
    });
  }

  let roleList = interaction.message.embeds[0].fields[0].value;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let roles: any[] = [];

  for (const role of roleList.split(`\n`)) {
    const roleId = role.split(" - ")[0].replace(/[<@&>]/g, "");
    const description = role.split(" - ")[1];

    const r = interaction.guild.roles.cache.find(
      (_role: { id: unknown }) => _role.id === roleId
    );
    if (!r) {
      return;
    }

    if (description) {
      let RoleDisc = "";
      for (let i = 1; i < description.length - 1; i++) {
        RoleDisc += description[i];
      }

      roles.push({
        label: r.name,
        description: RoleDisc,
        value: r.id,
      });
    } else {
      roles.push({
        label: r.name,
        value: r.id,
      });
    }
  }

  // let max = roles.length;
  const menu = new MessageActionRow().addComponents(
    new MessageSelectMenu()
      .setCustomId("remove-role-from-menu")
      .setMinValues(0)
      .setMaxValues(1)
      .setPlaceholder(`Please select a role to remove.`)
      .setOptions(roles)
  );

  interaction.update({ components: [menu] });
};
