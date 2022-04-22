import { SlashCommandBuilder } from "@discordjs/builders";
import { MessageEmbed } from "discord.js";
import { commandInt } from "../../interfaces/commandInt";
import { getBioData } from "../../modules/getBioData";
import { errorHandler } from "../../utils/errorHandler";
import { colors } from "../../config/colors";

export const viewbio: commandInt = {
  data: new SlashCommandBuilder()
    .setName("viewbio")
    .setDescription("Shows your bio.")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user you want to view their bio.")
        .setRequired(false)
    ) as SlashCommandBuilder,
  name: "viewbio",
  description: "View your (or someone else) bio.",
  usage: "/bio <id?>",
  run: async (interaction) => {
    try {
      await interaction.deferReply();
      const { user } = interaction;
      const userOption = interaction.options.getUser("user");
      let targetData;
      if (userOption) {
        targetData = await getBioData(userOption.id);
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
            "There was an error with the database lookup (most likely the user doesn't have a database entry)."
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
        .setDescription(
          `**${userOption ? userOption.username : user.username}'s bio** \n${
            targetData.description
          }`
        )

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
