import { SlashCommandBuilder } from "@discordjs/builders";
import { MessageEmbed } from "discord.js";
import { commandInt } from "../interfaces/commandInt";
import { getBioData } from "../modules/getBioData";
import { errorHandler } from "../utils/errorHandler";
import { colors } from "../config/colors";

/*
 * ➞ Viewbio
 * ➞ id | OPTIONAL - The user to show the bio of
 * ➞ Permissions | NONE
 * If an option was provided, view the respective user bio
 * If not, show the command executer bio
 ? Should there be a filter that restricts adverts and cuss words
 */

export const viewbio: commandInt = {
  data: new SlashCommandBuilder()
    .setName("viewbio")
    .setDescription("Shows your bio.")
    .addStringOption((option) =>
      option
        .setName("id")
        .setDescription("The id of the user you want to view their bio.")
        .setRequired(false)
    ) as SlashCommandBuilder,
  name: "viewbio",
  description: "View your (or someone else) bio.",
  usage: "/bio <id?>",
  run: async (interaction) => {
    try {
      await interaction.deferReply();
      const { user } = interaction;
      const idOption = interaction.options.getString("id");
      let targetData;
      if (idOption) {
        targetData = await getBioData(idOption);
      } else {
        targetData = await getBioData(user.id);
      }

      if (!targetData) {
        const doesntExistEmbed = new MessageEmbed()
          .setTitle("ERROR!")
          .setAuthor({
            name: `${user.username}#${user.discriminator}`,
            iconURL: user.displayAvatarURL(),
          })
          .setColor(colors.black)
          .setDescription(
            "There was an error with the database lookup (most likely the user doesn't exist). Please try again later."
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

      const successEmbed = new MessageEmbed()
        .setAuthor({
          name: `${user.username}#${user.discriminator}`,
          iconURL: user.displayAvatarURL(),
        })
        .setColor(colors.orange)
        .setTitle("SUCCESS")
        .setDescription(`${targetData.description}`)
        .setTimestamp()
        .setFooter({
          text: "© Pyreworks",
          iconURL: interaction.client.user?.displayAvatarURL(),
        });

      await interaction.editReply({ embeds: [successEmbed] });
    } catch (err) {
      errorHandler("viewbio command", err);
    }
  },
};
