import { MessageActionRow, MessageButton, MessageEmbed } from "discord.js";
import { colors } from "../../config/colors";

export const addRoleModalEvent = async (interaction) => {
  if (!interaction.member.permissions.has("MANAGE_ROLES")) {
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
  }

  const roleNameOrId = interaction.fields.getTextInputValue("role");
  const description = interaction.fields.getTextInputValue("description");
  let role = interaction.guild.roles.cache.find(
    (r: { name: string }) => r.name.toLowerCase() === roleNameOrId.toLowerCase()
  );

  if (!role) {
    role = await interaction.guild.roles.cache.find(
      (r: { id: unknown }) => r.id === roleNameOrId
    );
  }

  if (!role) {
    return interaction.reply({
      content: `Can't find a role with that ID/Name`,
      ephemeral: true,
    });
  }

  const oldEmbed = interaction.message.embeds[0];
  let roleList = oldEmbed.fields[0]?.value ? oldEmbed.fields[0].value : "";

  if (roleList.split(`\n`).length < 1) {
    roleList = `<@&${role.id}>${
      description !== "" ? ` - *${description}*` : ""
    }`;
  } else {
    // Check for duplicates
    for (const line of roleList.split(`\n`)) {
      const roleId = line.split(" - ")[0].replace(/[<@&>]/g, "");
      if (role.id === roleId) {
        return interaction.reply({
          content: `That role is a duplicate, you can't add it!`,
          ephemeral: true,
        });
      }
    }

    roleList =
      roleList +
      `\n<@&${role.id}>${description !== "" ? ` - *${description}*` : ""}`;
  }

  const embed = new MessageEmbed()
    .setTitle(oldEmbed.title)
    .setDescription(oldEmbed.description)
    .setColor(oldEmbed.color)
    .setFooter(oldEmbed.footer)
    .addFields({
      name: "Role List",
      value: roleList,
    });

  let reachedMax = false;
  if (roleList.split(`\n`).length === 15) {
    reachedMax = true;
    embed.setFooter({
      text: "You have reached the max number of roles!",
    });
  }

  const buttons = new MessageActionRow().addComponents(
    new MessageButton()
      .setCustomId("menu-add-role")
      .setLabel("Add Role")
      .setStyle("SUCCESS")
      .setEmoji("➕")
      .setDisabled(reachedMax),

    new MessageButton()
      .setCustomId("menu-remove-role")
      .setStyle("DANGER")
      .setLabel("Remove Role")
      .setEmoji("✖"),

    new MessageButton()
      .setCustomId("menu-confirm-role")
      .setStyle("PRIMARY")
      .setLabel("Confirm Selection")
      .setEmoji("✔")
  );

  interaction.update({ embeds: [embed], components: [buttons] });
};
