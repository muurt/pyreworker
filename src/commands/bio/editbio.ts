import { SlashCommandBuilder } from "@discordjs/builders";
import { MessageEmbed } from "discord.js";
import { commandInt } from "../../interfaces/commandInt";
import { errorHandler } from "../../utils/errorHandler";
import { getBioData } from "../../modules/getBioData";
import { updateBioData } from "../../modules/updateBioData";
import { colors } from "../../config/colors";
import { feedback } from "../../utils/perspectiveFeedback";

export const editbio: commandInt = {
  data: new SlashCommandBuilder()
    .setName("editbio")
    .setDescription("Edit your bio.")
    .addStringOption(
      (option) =>
        option.setName("bio").setDescription("The new bio.").setRequired(true)
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
  name: "editbio",
  description: "Edit your bio.",
  usage: "/editbio <bio>",
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
          .setColor(colors.black)
          .setDescription("The bio argument is required.")
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

      await getBioData(user.id).then(async (targetData) => {
        if (!targetData) {
          const doesntExistEmbed = new MessageEmbed()
            .setTitle("ERROR!")
            .setAuthor({
              name: `${user.username}#${user.discriminator}`,
              iconURL: user.displayAvatarURL(),
            })
            .setColor(colors.black)
            .setDescription(
              "You don't have a database entry, please create yours using `/bio`."
            )
            .setFooter({
              text: "© Pyreworks",
              iconURL: interaction.client.user?.displayAvatarURL(),
            });
          await interaction.editReply({
            embeds: [doesntExistEmbed],
          });
          return;
        }
        updateBioData(user.id, bioOption);
      });

      const successEmbed = new MessageEmbed()
        .setTitle("SUCCESS!")
        .setAuthor({
          name: `${user.username}#${user.discriminator}`,
          iconURL: user.displayAvatarURL(),
        })
        .setColor(colors.orange)
        .setDescription(
          "You've successfully updated your bio. To view it, use `/bio`."
        )
        .setFooter({
          text: "© Pyreworks",
          iconURL: interaction.client.user?.displayAvatarURL(),
        });

      await interaction.editReply({
        embeds: [successEmbed],
      });
    } catch (err) {
      errorHandler("editbio command", err);
    }
  },
};
