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
          .setColor(colors.black)
          .setDescription("Tickets channel doesn't exist (or ID is wrong).")
          .addField("Channel ID", "840144613477580822")
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
          .setColor(colors.black)
          .setDescription("Tickets channel isn't a text channel.")
          .addField("Channel ID", "840144613477580822")
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
          .setColor(colors.white)
          .setDescription("Create a ticket!")
          .setImage(
            "https://cdn.discordapp.com/attachments/775774648720687144/967706670274863135/Example_Banner2.png"
          )
          .addField(
            "<:cart:967707022655127642> | Order",
            "Create this type of ticket if you want to order something from us."
          )
          .addField(
            "<:gear:967707003705237524> | Support",
            "Create this type of ticket if you need to access our support team."
          )
          .addField(
            "<:application:967707003562647552> | Application",
            "Create this type of ticket if you want to apply for a position at Pyreworks."
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
          .setColor(colors.black)
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

      logHandler.log(
        "warn",
        `A user with the tag ${user.tag} (${user.id}) tried to set up tickets.`
      );
      const successEmbed = new MessageEmbed()
        .setTitle("SUCCESS!")
        .setAuthor({
          name: `${user.username}#${user.discriminator}`,
          iconURL: user.displayAvatarURL(),
        })
        .setColor(colors.orange)
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