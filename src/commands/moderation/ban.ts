import { SlashCommandBuilder } from "@discordjs/builders";
import { MessageEmbed, Permissions } from "discord.js";
import { commandInt } from "../../interfaces/commandInt";
import { errorHandler } from "../../utils/errorHandler";
import { colors } from "../../config/colors";
import { logHandler } from "../../utils/logHandler";

// * The ban command.

export const ban: commandInt = {
  data: new SlashCommandBuilder()
    .setName("ban")
    .setDescription("Ban a user.")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The the user you want to ban.")
        .setRequired(true)
    )
    .addNumberOption((option) =>
      option
        .setName("deletedays")
        .setDescription("Days of messages to delete.")
        .setRequired(false)
        .addChoices(
          {
            name: "1 Day",
            value: 86400,
          },
          {
            name: "2 Days",
            value: 172800,
          },
          {
            name: "3 Days",
            value: 259200,
          },
          {
            name: "4 Days",
            value: 345600,
          },
          {
            name: "5 Days",
            value: 432000,
          },
          {
            name: "6 Days",
            value: 518400,
          },
          {
            name: "7 Days",
            value: 604800,
          }
        )
    )
    .addStringOption((option) =>
      option
        .setName("reason")
        .setDescription("The reason for the ban.")
        .setRequired(false)
    ) as SlashCommandBuilder,
  name: "ban",
  description: "Ban a user.",
  usage: "/ban <user> <reason?> <deletedays?>",
  permissions: ["BAN_MEMBERS"],
  run: async (interaction) => {
    try {
      await interaction.deferReply();

      const { user } = interaction;
      const reasonOption =
        interaction.options.getString("reason") || "No reason provided.";
      const userOption = interaction.options.getUser("user");
      const numberOption = interaction.options.getNumber("deletedays") || 0;

      if (
        !interaction.guild?.me?.permissions.has(Permissions.FLAGS.BAN_MEMBERS)
      ) {
        const noBotPermsEmbed = new MessageEmbed()
          .setTitle("ERROR!")
          .setAuthor({
            name: `${user.username}#${user.discriminator}`,
            iconURL: user.displayAvatarURL(),
          })
          .setColor(colors.error)
          .setDescription("The bot doesn't have permissions to ban.")
          .setFooter({
            text: "© Pyreworks",
            iconURL: interaction.client.user?.displayAvatarURL(),
          });
        await interaction.editReply({
          embeds: [noBotPermsEmbed],
        });
        return;
      }

      if (!userOption) {
        const noArgumentsEmbed = new MessageEmbed()
          .setTitle("ERROR!")
          .setAuthor({
            name: `${user.username}#${user.discriminator}`,
            iconURL: user.displayAvatarURL(),
          })
          .setColor(colors.error)
          .setDescription("The message argument is required.")
          .setFooter({
            text: "© Pyreworks",
            iconURL: interaction.client.user?.displayAvatarURL(),
          });
        await interaction.editReply({
          embeds: [noArgumentsEmbed],
        });
        return;
      }

      /* eslint-disable  @typescript-eslint/no-explicit-any */
      const memberPermissions: any = interaction.member?.permissions;
      if (!memberPermissions.has(Permissions.FLAGS.BAN_MEMBERS)) {
        const noPermissionsEmbed = new MessageEmbed()
          .setTitle("ERROR!")
          .setAuthor({
            name: `${user.username}#${user.discriminator}`,
            iconURL: user.displayAvatarURL(),
          })
          .setColor(colors.error)
          .setDescription("You don't have the required permission(s).")
          .setFooter({
            text: "© Pyreworks",
            iconURL: interaction.client.user?.displayAvatarURL(),
          });
        await interaction.editReply({
          embeds: [noPermissionsEmbed],
        });
        return;
      }

      try {
        await interaction?.guild?.members.ban(userOption, {
          reason: reasonOption,
          deleteMessageSeconds: numberOption,
        });
      } catch (err) {
        const errorEmbed = new MessageEmbed()
          .setTitle("ERROR!")
          .setAuthor({
            name: `${user.username}#${user.discriminator}`,
            iconURL: user.displayAvatarURL(),
          })
          .setColor(colors.error)
          .setDescription(
            "Couldn't ban the user, they most likely have a higher role hierarchy."
          )
          .setFooter({
            text: "© Pyreworks",
            iconURL: interaction.client.user?.displayAvatarURL(),
          });
        await interaction.editReply({
          embeds: [errorEmbed],
        });
        return;
      }

      logHandler.info(
        `warn | A user with the tag ${userOption.tag} (${userOption.id}) has been banned by ${user.tag} (${user.id}) for the reason "${reasonOption}" and their messages were deleted for ${numberOption} days.`
      );

      const successEmbed = new MessageEmbed()
        .setTitle("SUCCESS!")
        .setAuthor({
          name: `${user.username}#${user.discriminator}`,
          iconURL: user.displayAvatarURL(),
        })
        .setColor(colors.success)
        .setDescription("Successfully banned the user.")
        .addFields(
          {
            name: "User",
            value: `${userOption.username}#${userOption.discriminator}`,
          },
          { name: "ID", value: `${userOption.id}` },
          { name: "Reason", value: reasonOption },
          { name: "Days of deleted messages", value: `${numberOption} Days` }
        )
        .setFooter({
          text: "© Pyreworks",
          iconURL: interaction.client.user?.displayAvatarURL(),
        });

      await interaction.editReply({
        embeds: [successEmbed],
      });
    } catch (err) {
      errorHandler("ban command", err);
    }
  },
};
