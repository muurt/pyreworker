import { SlashCommandBuilder } from "@discordjs/builders";
import { MessageEmbed } from "discord.js";
import { CommandInt } from "../interfaces/CommandInt";
import { getBioData } from "../modules/getBioData";
import { createBioData } from "../modules/createBioData";
import { errorHandler } from "../utils/errorHandler";
import { colors } from "../config/colors";

export const bio: CommandInt = {
  data: new SlashCommandBuilder()
    .setName("bio")
    .setDescription("Create your bio.")
    .addStringOption((option) =>
      option
        .setName("bio")
        .setDescription("The bio you want to have.")
        .setRequired(true)
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
          .setDescription("The message arugment is required.")
          .setFooter({
            text: "© Pyreworks",
            iconURL: interaction.client.user?.displayAvatarURL(),
          });
        await interaction.editReply({
          embeds: [noArg],
        });
        return;
      }
      const targetBio = await getBioData(user.id);

      if (targetBio) {
        const alrExists = new MessageEmbed()
          .setTitle("ERROR!")
          .setAuthor({
            name: `${user.username}#${user.discriminator}`,
            iconURL: user.displayAvatarURL(),
          })
          .setColor(colors.BLACK)
          .setDescription(
            "You already have a database entry, please update yours using `/editbio`."
          )
          .setFooter({
            text: "© Pyreworks",
            iconURL: interaction.client.user?.displayAvatarURL(),
          });
        await interaction.editReply({
          embeds: [alrExists],
        });
        return;
      }

      const newBioData = await createBioData(user.id, text);

      if (!newBioData) {
        const error = new MessageEmbed()
          .setTitle("ERROR!")
          .setAuthor({
            name: `${user.username}#${user.discriminator}`,
            iconURL: user.displayAvatarURL(),
          })
          .setColor(colors.BLACK)
          .setDescription(
            "There is an error with the database entry creation. Please try again later."
          )
          .setFooter({
            text: "© Pyreworks",
            iconURL: interaction.client.user?.displayAvatarURL(),
          });
        await interaction.editReply({
          embeds: [error],
        });
        return;
      }

      const success = new MessageEmbed()
        .setTitle("SUCCESS!")
        .setAuthor({
          name: `${user.username}#${user.discriminator}`,
          iconURL: user.displayAvatarURL(),
        })
        .setColor(colors.ORANGE)
        .setDescription("You've successfully created your bio.")
        .addField("Bio", newBioData.description)
        .setFooter({
          text: "© Pyreworks",
          iconURL: interaction.client.user?.displayAvatarURL(),
        });

      await interaction.editReply({
        embeds: [success],
      });
    } catch (err) {
      errorHandler("bio command", err);
    }
  },
};
