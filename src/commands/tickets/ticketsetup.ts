import { SlashCommandBuilder } from "@discordjs/builders";
import {
  MessageActionRow,
  MessageButton,
  MessageEmbed,
  Permissions,
} from "discord.js";
import { commandInt } from "../../interfaces/commandInt";
import { errorHandler } from "../../utils/errorHandler";
import { colors } from "../../config/colors";
import { logHandler } from "../../utils/logHandler";

// * The command for setting up tickets.

export const ticketsetup: commandInt = {
  data: new SlashCommandBuilder()
    .setName("ticketsetup")
    .setDescription("Administrative purposes.") as SlashCommandBuilder,
  name: "ticketsetup",
  description: "Administrative purposes.",
  usage: "/ticketsetup",
  permissions: ["ADMINISTRATOR"],
  run: async (interaction) => {
    try {
      await interaction.deferReply();

      const ticketsChannel =
        interaction.client.channels.cache.get("840144613477580822");
      const { user } = interaction;

      if (!ticketsChannel) {
        const noChannelEmbed = new MessageEmbed()
          .setTitle("ERROR!")
          .setAuthor({
            name: `${user.username}#${user.discriminator}`,
            iconURL: user.displayAvatarURL(),
          })
          .setColor(colors.error)
          .setDescription("Tickets channel doesn't exist (or ID is wrong).")
          .addFields({ name: "Channel ID", value: "840144613477580822" })
          .setFooter({
            text: "© Pyreworks",
            iconURL: interaction.client.user?.displayAvatarURL(),
          });
        await interaction.editReply({
          embeds: [noChannelEmbed],
        });
        return;
      }

      if (ticketsChannel.type !== "GUILD_TEXT") {
        const wrongTypeEmbed = new MessageEmbed()
          .setTitle("ERROR!")
          .setAuthor({
            name: `${user.username}#${user.discriminator}`,
            iconURL: user.displayAvatarURL(),
          })
          .setColor(colors.error)
          .setDescription("Tickets channel isn't a text channel.")
          .addFields({ name: "Channel ID", value: "840144613477580822" })
          .setFooter({
            text: "© Pyreworks",
            iconURL: interaction.client.user?.displayAvatarURL(),
          });
        await interaction.editReply({
          embeds: [wrongTypeEmbed],
        });
        return;
      }

      /* eslint-disable  @typescript-eslint/no-explicit-any */
      const memberPermissions: any = interaction.member?.permissions;
      if (!memberPermissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
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
        const buttons = new MessageActionRow().addComponents(
          new MessageButton()
            .setCustomId("order")
            .setLabel("Order")
            .setStyle("DANGER")
            .setEmoji("967707022655127642"),
          new MessageButton()
            .setCustomId("support")
            .setLabel("Support")
            .setStyle("DANGER")
            .setEmoji("967707003705237524"),
          new MessageButton()
            .setCustomId("application")
            .setLabel("Application")
            .setStyle("DANGER")
            .setEmoji("967707003562647552")
        );

        const ticketEmbed = new MessageEmbed()
          .setTitle("Tickets 📩")
          .setColor(colors.success)
          .setDescription("Create a ticket!")
          .setImage(
            "https://cdn.discordapp.com/attachments/775774648720687144/1069660436066209922/Example_Banner.png"
          )
          .addFields(
            {
              name: "<:cart:967707022655127642> | Order",
              value:
                "Create this type of ticket if you want to order something from us.",
            },
            {
              name: "<:gear:967707003705237524> | Support",
              value:
                "Create this type of ticket if you need to access our support team.",
            },
            {
              name: "<:application:967707003562647552> | Application",
              value:
                "Create this type of ticket if you want to apply for a position at Pyreworks.",
            }
          )
          .setAuthor({
            name: "© Pyreworks",
            iconURL: interaction.client.user?.displayAvatarURL(),
          });

        await ticketsChannel.send({
          embeds: [ticketEmbed],
          components: [buttons],
        });
      } catch (err) {
        const errorEmbed = new MessageEmbed()
          .setTitle("ERROR!")
          .setAuthor({
            name: `${user.username}#${user.discriminator}`,
            iconURL: user.displayAvatarURL(),
          })
          .setColor(colors.error)
          .setDescription("Couldn't send the tickets embed.")
          .setFooter({
            text: "© Pyreworks",
            iconURL: interaction.client.user?.displayAvatarURL(),
          });
        await interaction.editReply({
          embeds: [errorEmbed],
        });
        errorHandler("ticketsetup | Sending tickets embed", err);
        return;
      }

      logHandler.info(
        "warn",
        `A user with the tag ${user.tag} (${user.id}) used the ticketsetup command.`
      );
      const successEmbed = new MessageEmbed()
        .setTitle("SUCCESS!")
        .setAuthor({
          name: `${user.username}#${user.discriminator}`,
          iconURL: user.displayAvatarURL(),
        })
        .setColor(colors.success)
        .setDescription("Successfully set up tickets.")
        .setFooter({
          text: "© Pyreworks",
          iconURL: interaction.client.user?.displayAvatarURL(),
        });

      await interaction.editReply({
        embeds: [successEmbed],
      });
    } catch (err) {
      errorHandler("ticketsetup command", err);
    }
  },
};
