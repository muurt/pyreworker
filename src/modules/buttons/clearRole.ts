/* eslint-disable @typescript-eslint/no-explicit-any */
import { ButtonInteraction, CacheType, MessageEmbed } from "discord.js";

export const clearRoleEvent = async (
  interaction: ButtonInteraction<CacheType>
) => {
  // The available roles in the select menu
  const selectMenu = interaction.message.components![0];
  const roles = selectMenu?.options;

  // All of the user's roles
  const memberRoles = interaction.member.roles;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let failedAttempt = false;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  for (const { value: roleId, label: roleName } of roles) {
    // Check what roles the user has from roles list in the select menu
    const hasRole = memberRoles.cache.get(roleId) ? true : false;

    if (hasRole) {
      // User has role so we can remove it
      memberRoles.remove(roleId).catch(() => (failedAttempt = true));
    }
  }

  const embed = new MessageEmbed()
    .setAuthor({
      name: `${interaction.member.user.username}'s roles`,
      iconURL: interaction.member.displayAvatarURL(),
    })
    .setDescription(`Your roles have been successfully cleared!`)
    .setColor(interaction.message.embeds[0].data.color)
    .setTimestamp();

  interaction.reply({ embeds: [embed], ephemeral: true });
};
