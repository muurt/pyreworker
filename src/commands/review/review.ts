/* eslint-disable @typescript-eslint/no-explicit-any */
import { SlashCommandBuilder } from "@discordjs/builders";
import { MessageEmbed } from "discord.js";
import { commandInt } from "../../interfaces/commandInt";
import { errorHandler } from "../../utils/errorHandler";
import { colors } from "../../config/colors";
import { searchTheEmbed } from "../../modules/searchTheEmbed";
import { sendReviewMessage } from "../../utils/sendReviewMessage";

export const review: commandInt = {
  data: new SlashCommandBuilder()
    .setName("review")
    .setDescription("Post a review for a service you've bought.")
    .addNumberOption((option) =>
      option
        .setName("rating")
        .setDescription("Select the number of stars you'd want to give.")
        .setRequired(true)
        .addChoices(
          {
            name: "One Star",
            value: 1,
          },
          {
            name: "Two Stars",
            value: 2,
          },
          {
            name: "Three Stars",
            value: 3,
          },
          {
            name: "Four Stars",
            value: 4,
          },
          {
            name: "Five Stars",
            value: 5,
          }
        )
    )
    .addStringOption((option) =>
      option
        .setName("description")
        .setDescription("The description of your review.")
        .setRequired(true)
    ) as SlashCommandBuilder,
  name: "review",
  description: "Post a review for a service you've bought.",
  usage: "/review <rating> <ticket> <description>",
  run: async (interaction: any) => {
    const { options } = interaction;

    const rating = options.getNumber("rating");
    const description = options.getString("description");
    const ticketChannel = interaction.channel.name.toString();
    const firstMessage = await interaction.channel.messages.fetch({
      limit: 1,
    }); // doesn't work.

    try {
      if (!ticketChannel?.startsWith("odr-")) {
        const failEmbed = new MessageEmbed()
          .setColor(colors.error)
          .setTitle("ERROR!")
          .setDescription(`Please make sure you are in a ticket channel.`);
        await interaction.reply({
          embeds: [failEmbed],
          ephemeral: true,
        });
        return;
      } else {
        const successEmbed = new MessageEmbed()
          .setColor(colors.success)
          .setTitle("SUCCESS!")
          .setDescription(`Your review has been posted!`);
        await interaction.reply({
          embeds: [successEmbed],
          ephemeral: true,
        });
      }

      const reviewEmbed = new MessageEmbed()
        .setColor(colors.success)
        .setTitle("Review")
        .setDescription(`${interaction.user} has posted a review!`);

      // Checking the rating.
      switch (rating) {
        case 1:
          reviewEmbed.addField("Rating", "⭐", false);
          break;
        case 2:
          reviewEmbed.addField("Rating", "⭐⭐", false);
          break;
        case 3:
          reviewEmbed.addField("Rating", "⭐⭐⭐", false);
          break;
        case 4:
          reviewEmbed.addField("Rating", "⭐⭐⭐⭐", false);
          break;
        case 5:
          reviewEmbed.addField("Rating", "⭐⭐⭐⭐⭐", false);
          break;
        default:
          reviewEmbed.addField("Rating", "⭐⭐⭐⭐⭐", false);
          break;
      }

      // Checking for the service type.
      if (searchTheEmbed(firstMessage, "prebuilt-bot-order")) {
        reviewEmbed.addField("Service", "```Prebuilt Bot Order```", false);
      }

      if (searchTheEmbed(firstMessage, "custom-bot-order")) {
        reviewEmbed.addField("Service", "```Custom Bot Order````", false);
      } // this doesnt work rn.

      reviewEmbed.addField("Description", `\`\`\`${description}\`\`\``, false);
      reviewEmbed.setFooter({
        text: "© Pyreworks",
        iconURL: interaction.client.user?.displayAvatarURL(),
      });
      await sendReviewMessage(interaction.client, reviewEmbed);
    } catch (err) {
      const otherErrEmbed = new MessageEmbed()
        .setColor(colors.error)
        .setTitle("ERROR!")
        .setDescription(
          `Your review could not be posted, Error has been logged to console and will be rectified shortly.`
        );
      await interaction.channel.send({
        embeds: [otherErrEmbed],
        ephemeral: true,
      });
      errorHandler("review command", err);
    }
  },
};
// will upgrade the command with modal menus soon :)
// (because im too dumb)
