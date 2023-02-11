/* eslint-disable @typescript-eslint/no-explicit-any */
import { MessageEmbed } from "discord.js";

export const updateMemberRoles = async (interaction) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const clientRole = interaction.guild.members.cache.get(
    interaction.client.user.id
  ).roles.highest;
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
          removedRoles = ` - <@&${role.id}>`;
        } else {
          removedRoles += `\n - <@&${role.id}>`;
        }
      } else {
        // "Add" Role
        if (newRoles === ``) {
          newRoles = ` - <@&${role.id}>`;
        } else {
          newRoles += `\n - <@&${role.id}>`;
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
          newRoles = ` - <@&${role.id}>`;
        } else {
          newRoles += `\n - <@&${role.id}>`;
        }
      } else {
        // "Remove" Role
        if (removedRoles === ``) {
          removedRoles = ` - <@&${role.id}>`;
        } else {
          removedRoles += `\n - <@&${role.id}>`;
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

  const color = interaction.message.embeds[0].color || process.env.COLOR;
  const embed = new MessageEmbed()
    .setTitle("🔧 - I have updated your roles!")
    .setDescription(description)
    .setColor(color);

  if (permissionError) {
    // Bot has insufficient permissions

    const noPermEmbed = new MessageEmbed()
      .setTitle("❌ - Missing Permissions!")
      .setColor(0xff0000)
      .setDescription(
        `Please make sure that I have the \`Manage Roles\` permission and that one of my roles are higher than the role I'm trying to give to you.`
      );

    interaction.reply({
      embeds: [noPermEmbed],
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
