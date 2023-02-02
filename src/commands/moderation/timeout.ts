import { SlashCommandBuilder } from "@discordjs/builders";
import { MessageEmbed, Permissions } from "discord.js";
import { commandInt } from "../../interfaces/commandInt";
import { errorHandler } from "../../utils/errorHandler";
import { colors } from "../../config/colors";
import { logHandler } from "../../utils/logHandler";

// * The timeout command.

export const timeout: commandInt = {
  data: new SlashCommandBuilder()
    .setName("timeout")
    .setDescription("Timeout a user.")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The the user you want to timeout.")
        .setRequired(true)
    )
    .addNumberOption((option) =>
      option
        .setName("duration")
        .setDescription("The duration of the timeout.")
        .setRequired(true)
        .addChoices(
          {
            name: "5 mins",
            value: 300000,
          },
          {
            name: "10 mins",
            value: 600000,
          },
          {
            name: "1 hour",
            value: 3600000,
          },
          {
            name: "6 hours",
            value: 21600000,
          },
          {
            name: "12 hours",
            value: 43200000,
          },
          {
            name: "1 day",
            value: 86400000,
          },
          {
            name: "3 days",
            value: 259200000,
          },
          {
            name: "1 week",
            value: 604800000,
          },
          {
            name: "2 weeks",
            value: 1210000000,
          },
          {
            name: "3 weeks",
            value: 1814000000,
          },
          {
            name: "1 month",
            value: 2628000000,
          }
        )
    )
    .addStringOption((option) =>
      option
        .setName("reason")
        .setDescription("The reason for the timeout.")
        .setRequired(false)
    ) as SlashCommandBuilder,
  name: "timeout",
  description: "Timeout a user.",
  usage: "/kick <user> <duration> <reason?>",
  permissions: ["MODERATE_MEMBERS"],
  run: async (interaction) => {
    try {
      await interaction.deferReply();

      const { user } = interaction;
      const reasonOption =
        interaction.options.getString("reason") || "No reason provided.";
      const userOption = interaction.options.getUser("user");
      const durationOption = interaction.options.getNumber("duration");
      let durationText;

      if (
        !interaction.guild?.me?.permissions.has(
          Permissions.FLAGS.MODERATE_MEMBERS
        )
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

      if (!userOption || !durationOption) {
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
      switch (durationOption.toString()) {
        case "300000":
          durationText = "5 mins";
          break;
        case "600000":
          durationText = "10 mins";
          break;
        case "3600000":
          durationText = "1 hour";
          break;
        case "21600000":
          durationText = "6 hours";
          break;
        case "43200000":
          durationText = "12 hours";
          break;
        case "86400000":
          durationText = "1 day";
          break;
        case "259200000":
          durationText = "3 days";
          break;
        case "604800000":
          durationText = "1 week";
          break;
        case "1210000000":
          durationText = "2 weeks";
          break;
        case "1814000000":
          durationText = "3 weeks";
          break;
        case "2628000000":
          durationText = "1 month";
          break;
        default:
          durationText = "Unknown";
      }

      /* eslint-disable  @typescript-eslint/no-explicit-any */
      const memberPermissions: any = interaction.member?.permissions;
      if (!memberPermissions.has(Permissions.FLAGS.MODERATE_MEMBERS)) {
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
        const wantedUser = interaction.guild.members.cache.get(userOption.id);
        await wantedUser?.timeout(durationOption, reasonOption);
      } catch (err) {
        const errorEmbed = new MessageEmbed()
          .setTitle("ERROR!")
          .setAuthor({
            name: `${user.username}#${user.discriminator}`,
            iconURL: user.displayAvatarURL(),
          })
          .setColor(colors.black)
          .setDescription(
            "Couldn't timeout the user, they most likely have a higher role hierarchy."
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
        `A user with the tag ${userOption.tag} (${userOption.id}) has been timed out by ${user.tag} (${user.id}) for the reason "${reasonOption}" and for ${durationText}.`
      );

      const successEmbed = new MessageEmbed()
        .setTitle("SUCCESS!")
        .setAuthor({
          name: `${user.username}#${user.discriminator}`,
          iconURL: user.displayAvatarURL(),
        })
        .setColor(colors.orange)
        .setDescription("Successfully timed out the user.")
        .addFields(
          {
            name: "User",
            value: `${userOption.username}#${userOption.discriminator}`,
          },
          { name: "ID", value: userOption.id },
          { name: "Reason", value: reasonOption },
          { name: "Duration", value: durationText }
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
