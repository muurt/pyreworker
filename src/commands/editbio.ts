import { SlashCommandBuilder } from "@discordjs/builders";
import { MessageEmbed } from "discord.js";
import { commandInt } from "../interfaces/commandInt";
import { errorHandler } from "../utils/errorHandler";
import { getBioData } from "../modules/getBioData";
import { updateBioData } from "../modules/updateBioData";
import { colors } from "../config/colors";

/*
 * ➞ Editbio
 * ➞ bio | The new bio to put on the database entry
 * ➞ Permissions | NONE
 * Edit your bio with a new one, requires you to have a database entry
 ? Should there be a filter that restricts adverts and cuss words
 */

export const editbio: commandInt = {
  data: new SlashCommandBuilder()
    .setName("editbio")
    .setDescription("Edit your bio.")
    .addStringOption((option) =>
      option.setName("bio").setDescription("The new bio.").setRequired(true)
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
          .setDescription("The bio arugment is required.")
          .setFooter({
            text: "© Pyreworks",
            iconURL: interaction.client.user?.displayAvatarURL(),
          });
        await interaction.editReply({
          embeds: [noArgumentsEmbed],
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
        .setDescription("You've successfully updated your bio.")
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
