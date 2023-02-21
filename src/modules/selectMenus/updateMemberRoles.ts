import { MessageEmbed } from "discord.js";
import { colors } from "../../config/colors";

export const updateMemberRoles = async (interaction) => {
  const selectedRoleIds = interaction.values;
  const selectMenuRoleIds =
    interaction.message.components[0].components[0].options;

  let newRoles = ``;
  let removedRoles = ``;

  let permissionError = false;

  // Remove all non-selected roles
  for (const menuRole of selectMenuRoleIds) {
    if (interaction.member._roles.includes(menuRole.value)) {
      // User has the role
      const role = interaction.guild.roles.cache.get(menuRole.value);
      if (!role) {
        return;
      }

      if (!selectedRoleIds.includes(menuRole.value)) {
        // Remove Role
        await interaction.member.roles.remove(role).catch(() => {
          permissionError = true;
        });
        if (removedRoles === ``) {
          removedRoles = ` • <@&${role.id}>`;
        } else {
          removedRoles += `\n • <@&${role.id}>`;
        }
      } else {
        // "Add" Role
        if (newRoles === ``) {
          newRoles = ` • <@&${role.id}>`;
        } else {
          newRoles += `\n • <@&${role.id}>`;
        }
      }
    } else {
      // User does not have the role
      const role = interaction.guild.roles.cache.get(menuRole.value);
      if (!role) {
        return;
      }

      if (selectedRoleIds.includes(menuRole.value)) {
        // Add Role

        await interaction.member.roles.add(role).catch(() => {
          permissionError = true;
        });
        if (newRoles === ``) {
          newRoles = ` • <@&${role.id}>`;
        } else {
          newRoles += `\n • <@&${role.id}>`;
        }
      } else {
        // "Remove" Role
        if (removedRoles === ``) {
          removedRoles = ` • <@&${role.id}>`;
        } else {
          removedRoles += `\n • <@&${role.id}>`;
        }
      }
    }
  }

  let description = ``;
  if (newRoles !== ``) {
    description += `\`\`\` ➕ - Selected Roles \`\`\`${newRoles}\n`;
  }

  if (removedRoles !== ``) {
    description += `\n\`\`\` ✖ - Removed Roles \`\`\`${removedRoles}`;
  }

  const embed = new MessageEmbed()
    .setTitle("SUCCESS")
    .setDescription(description)
    .setColor(colors.success);

  if (permissionError) {
    // Bot has insufficient permissions

    const noPermissionsEmbed = new MessageEmbed()
      .setTitle("ERROR!")
      .setAuthor({
        name: `${interaction.user.username}#${interaction.user.discriminator}`,
        iconURL: interaction.user.displayAvatarURL(),
      })
      .setColor(colors.error)
      .setDescription("I don't have the required permissions to do that.")
      .setFooter({
        text: "© Pyreworks",
        iconURL: interaction.client.user?.displayAvatarURL(),
      });
    return interaction.reply({
      embeds: [noPermissionsEmbed],
      ephemeral: true,
    });
  } else {
    // Successfully added/removed roles

    interaction.reply({
      embeds: [embed],
      ephemeral: true,
    });
  }
};
