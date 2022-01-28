import { SlashCommandBuilder } from "@discordjs/builders";
import { MessageEmbed } from "discord.js";
import { CommandInt } from "../interfaces/CommandInt";
import { getBioData } from "../modules/getBioData";
import { errorHandler } from "../utils/errorHandler";
import { colors } from "../config/colors";

export const viewbio: CommandInt = {
  data: new SlashCommandBuilder()
    .setName("viewbio")
    .setDescription("Shows your bio.")
    .addStringOption((option) =>
      option
        .setName("id")
        .setDescription("The id of the user you want to view their bio.")
        .setRequired(false)
    ) as SlashCommandBuilder,
  run: async (interaction) => {
    try {
      await interaction.deferReply();
      const { user } = interaction;
      const id = interaction.options.getString("id");
      let targetBio;
      if (id) {
        targetBio = await getBioData(id);
      } else {
        targetBio = await getBioData(user.id);
      }

      if (!targetBio) {
        const notExists /*fuck english (again)*/ = new MessageEmbed()
          .setTitle("ERROR!")
          .setAuthor({
            name: `${user.username}#${user.discriminator}`,
            iconURL: user.displayAvatarURL(),
          })
          .setColor(colors.BLACK)
          .setDescription(
            "There was an error with the database lookup (most likely the user doesn't exist). Please try again later."
          )
          .setFooter({
            text: "© Pyreworks",
            iconURL: interaction.client.user?.displayAvatarURL(),
          });
        await interaction.editReply({
          embeds: [notExists],
        });
        return;
      }

      const success = new MessageEmbed()
        .setAuthor({
          name: `${user.username}#${user.discriminator}`,
          iconURL: user.displayAvatarURL(),
        })
        .setColor(colors.ORANGE)
        .setTitle("SUCCESS")
        .setDescription(`${targetBio.description}`)
        .setTimestamp()
        .setFooter({
          text: "© Pyreworks",
          iconURL: interaction.client.user?.displayAvatarURL(),
        });

      await interaction.editReply({ embeds: [success] });
    } catch (err) {
      errorHandler("viewbio command", err);
    }
  },
};
