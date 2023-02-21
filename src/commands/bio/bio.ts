/* eslint-disable no-var */
import { SlashCommandBuilder } from "@discordjs/builders";
import { MessageEmbed } from "discord.js";
import { commandInt } from "../../interfaces/commandInt";
import { getBioData } from "../../modules/getBioData";
import { createBioData } from "../../modules/createBioData";
import { errorHandler } from "../../utils/errorHandler";
import { colors } from "../../config/colors";
import { feedback } from "../../utils/perspectiveFeedback";

// * Create your profile.
// TODO: Scrap this and turn it into a profile feature.

export const bio: commandInt = {
  data: new SlashCommandBuilder()
    .setName("bio")
    .setDescription("Create your bio.")
    .addStringOption(
      (option) =>
        option
          .setName("bio")
          .setDescription("A brief introduction about yourself.")
          .setRequired(true)
      // .addStringOption((option) =>
      //   option
      //     .setName("email")
      //     .setDescription("Your email address.")
      //     .setRequired(true),
      // .addStringOption((option) =>
      //   option
      //     .setName("portfolio")
      //     .setDescription("Your portfolio url.")
      //     .setRequired(true),
      // .addStringOption((option) =>
      //   option
      //     .setName("other links")
      //     .setDescription("Any other links you want to share.")
      //     .setRequired(true)
    ) as SlashCommandBuilder,
  name: "bio",
  description: "Create your bio.",
  usage: "/bio <bio>",
  run: async (interaction) => {
    try {
      await interaction.deferReply();
      const { user } = interaction;
      const bioOption = interaction.options.getString("bio");
      if (!bioOption) {
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

      const feedbackEmbed = await feedback(interaction, bioOption.toString());
      if (feedbackEmbed) {
        await interaction.editReply({
          embeds: [feedbackEmbed],
        });
        return;
      }

      const targetData = await getBioData(user.id);

      if (targetData) {
        const existsEmbed = new MessageEmbed()
          .setTitle("ERROR!")
          .setAuthor({
            name: `${user.username}#${user.discriminator}`,
            iconURL: user.displayAvatarURL(),
          })
          .setColor(colors.error)
          .setDescription(
            "You already have a database entry, please update yours using `/editbio`."
          )
          .setFooter({
            text: "© Pyreworks",
            iconURL: interaction.client.user?.displayAvatarURL(),
          });
        await interaction.editReply({
          embeds: [existsEmbed],
        });
        return;
      }

      const newBioData = await createBioData(user.id, bioOption);

      if (!newBioData) {
        const cannotCreateEmbed = new MessageEmbed()
          .setTitle("ERROR!")
          .setAuthor({
            name: `${user.username}#${user.discriminator}`,
            iconURL: user.displayAvatarURL(),
          })
          .setColor(colors.error)
          .setDescription(
            "There is an error with the database entry creation. Please try again later."
          )
          .setFooter({
            text: "© Pyreworks",
            iconURL: interaction.client.user?.displayAvatarURL(),
          });
        await interaction.editReply({
          embeds: [cannotCreateEmbed],
        });
        return;
      }

      const successEmbed = new MessageEmbed()
        .setTitle("SUCCESS!")
        .setAuthor({
          name: `${user.username}#${user.discriminator}`,
          iconURL: user.displayAvatarURL(),
        })
        .setColor(colors.success)
        .setDescription(
          "You've successfully created your bio. To view it use `/viewbio`."
        )
        .setFooter({
          text: "© Pyreworks",
          iconURL: interaction.client.user?.displayAvatarURL(),
        });

      await interaction.editReply({
        embeds: [successEmbed],
      });
    } catch (err) {
      errorHandler("bio command", err);
    }
  },
};
