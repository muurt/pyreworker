import {
  MessageActionRow,
  MessageEmbed,
  MessageSelectMenu,
  MessageSelectOptionData,
} from "discord.js";
import { colors } from "../../config/colors";

export const removeRoleEvent = async (interaction) => {
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

  const roleList = interaction.message.embeds[0].fields[0].value;
  const roles: MessageSelectOptionData[] = [];

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
