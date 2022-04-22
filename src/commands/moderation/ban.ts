import { SlashCommandBuilder } from "@discordjs/builders";
import { MessageEmbed, Permissions } from "discord.js";
import { commandInt } from "../../interfaces/commandInt";
import { errorHandler } from "../../utils/errorHandler";
import { colors } from "../../config/colors";
import { logHandler } from "../../utils/logHandler";

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
    .addNumberOption(
      (option) =>
        option
          .setName("deletedays")
          .setDescription("Days of messages to delete.")
          .setRequired(false)
          .addChoice("1 Day", 1)
          .addChoice("2 Days", 2)
          .addChoice("3 Days", 3)
          .addChoice("4 Days", 4)
          .addChoice("5 Days", 5)
          .addChoice("6 Days", 6)
          .addChoice("7 Days", 7)
      // there's probably a better looking way to do this but fuck it.
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
          .setColor(colors.black)
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
          .setColor(colors.black)
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
          .setColor(colors.black)
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
          days: numberOption,
        });
      } catch (err) {
        const errorEmbed = new MessageEmbed()
          .setTitle("ERROR!")
          .setAuthor({
            name: `${user.username}#${user.discriminator}`,
            iconURL: user.displayAvatarURL(),
          })
          .setColor(colors.black)
          .setDescription(
            "Couldn't ban the user, most likely they has higher role hierarchy."
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

      logHandler.log(
        "warn",
        `A user with the tag ${userOption.tag} (${userOption.id}) has been banned by ${user.tag} (${user.id}) for the reason "${reasonOption}" and their messages were deleted for ${numberOption} days.`
      );

      const successEmbed = new MessageEmbed()
        .setTitle("SUCCESS!")
        .setAuthor({
          name: `${user.username}#${user.discriminator}`,
          iconURL: user.displayAvatarURL(),
        })
        .setColor(colors.orange)
        .setDescription("Successfully banned the user.")
        .addField("User", `${userOption.username}#${userOption.discriminator}`)
        .addField("ID", userOption.id)
        .addField("Reason", reasonOption)
        .addField("Days of deleted messages", `${numberOption} Days`)
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
