import { SlashCommandBuilder } from "@discordjs/builders";
import { MessageEmbed } from "discord.js";
import { CommandInt } from "../interfaces/CommandInt";
import { errorHandler } from "../utils/errorHandler";
import { getBioData } from "../modules/getBioData";
import { updateBioData } from "../modules/updateBioData";
import { colors } from "../config/colors";

export const editbio: CommandInt = {
  data: new SlashCommandBuilder()
    .setName("editbio")
    .setDescription("Edit your bio.")
    .addStringOption((option) =>
      option.setName("bio").setDescription("The new bio.").setRequired(true)
    ) as SlashCommandBuilder,
  run: async (interaction) => {
    try {
      await interaction.deferReply();
      const { user } = interaction;
      const text = interaction.options.getString("bio");

      if (!text) {
        const noArg = new MessageEmbed()
          .setTitle("ERROR!")
          .setAuthor({
            name: `${user.username}#${user.discriminator}`,
            iconURL: user.displayAvatarURL(),
          })
          .setColor(colors.BLACK)
          .setDescription("The bio arugment is required.")
          .setFooter({
            text: "© Pyreworks",
            iconURL: interaction.client.user?.displayAvatarURL(),
          });
        await interaction.editReply({
          embeds: [noArg],
        });
        return;
      }

      await getBioData(user.id).then(async (targetBioData) => {
        if (!targetBioData) {
          const notExists /*fuck english*/ = new MessageEmbed()
            .setTitle("ERROR!")
            .setAuthor({
              name: `${user.username}#${user.discriminator}`,
              iconURL: user.displayAvatarURL(),
            })
            .setColor(colors.BLACK)
            .setDescription(
              "You don't have a database entry, please create yours using `/bio`."
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
        updateBioData(user.id, text);
      });

      const success = new MessageEmbed()
        .setTitle("SUCCESS!")
        .setAuthor({
          name: `${user.username}#${user.discriminator}`,
          iconURL: user.displayAvatarURL(),
        })
        .setColor(colors.ORANGE)
        .setDescription("You've successfully updated your bio.")
        .setFooter({
          text: "© Pyreworks",
          iconURL: interaction.client.user?.displayAvatarURL(),
        });

      await interaction.editReply({
        embeds: [success],
      });
    } catch (err) {
      errorHandler("editbio command", err);
    }
  },
};
