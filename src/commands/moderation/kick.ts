import { SlashCommandBuilder } from "@discordjs/builders";
import { MessageEmbed, Permissions } from "discord.js";
import { commandInt } from "../../interfaces/commandInt";
import { errorHandler } from "../../utils/errorHandler";
import { colors } from "../../config/colors";
import { logHandler } from "../../utils/logHandler";

// * The kick command.

export const kick: commandInt = {
  data: new SlashCommandBuilder()
    .setName("kick")
    .setDescription("Kick a user.")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The the user you want to kick.")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("reason")
        .setDescription("The reason for the kick.")
        .setRequired(false)
    ) as SlashCommandBuilder,
  name: "kick",
  description: "Kick a user.",
  usage: "/kick <user> <reason?>",
  permissions: ["KICK_MEMBERS"],
  run: async (interaction) => {
    try {
      await interaction.deferReply();

      const { user } = interaction;
      const reasonOption =
        interaction.options.getString("reason") || "No reason provided.";
      const userOption = interaction.options.getUser("user");

      if (
        !interaction.guild?.me?.permissions.has(Permissions.FLAGS.KICK_MEMBERS)
      ) {
        const noBotPermsEmbed = new MessageEmbed()
          .setTitle("ERROR!")
          .setAuthor({
            name: `${user.username}#${user.discriminator}`,
            iconURL: user.displayAvatarURL(),
          })
          .setColor(colors.black)
          .setDescription("The bot doesn't have permissions to kick.")
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
      if (!memberPermissions.has(Permissions.FLAGS.KICK_MEMBERS)) {
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
        await interaction?.guild?.members.kick(userOption);
      } catch (err) {
        const errorEmbed = new MessageEmbed()
          .setTitle("ERROR!")
          .setAuthor({
            name: `${user.username}#${user.discriminator}`,
            iconURL: user.displayAvatarURL(),
          })
          .setColor(colors.black)
          .setDescription(
            "Couldn't kick the user, they most likely have a higher role hierarchy."
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
        `A user with the tag ${userOption.tag} (${userOption.id}) has been kicked by ${user.tag} (${user.id}) for the reason "${reasonOption}".`
      );

      const successEmbed = new MessageEmbed()
        .setTitle("SUCCESS!")
        .setAuthor({
          name: `${user.username}#${user.discriminator}`,
          iconURL: user.displayAvatarURL(),
        })
        .setColor(colors.orange)
        .setDescription("Successfully kicked the user.")
        .addFields(
          {
            name: "User",
            value: `${userOption.username}#${userOption.discriminator}`,
          },
          { name: "ID", value: userOption.id },
          { name: "Reason", value: reasonOption }
        )
        .setFooter({
          text: "© Pyreworks",
          iconURL: interaction.client.user?.displayAvatarURL(),
        });

      await interaction.editReply({
        embeds: [successEmbed],
      });
    } catch (err) {
      errorHandler("kick command", err);
    }
  },
};
