import { SlashCommandBuilder } from "@discordjs/builders";
import { MessageEmbed } from "discord.js";
import { CommandInt } from "../interfaces/CommandInt";
import { errorHandler } from "../utils/errorHandler";
import { colors } from "../config/colors";

export const help: CommandInt = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Provides information on using this bot."),
  run: async (interaction) => {
    try {
      const { user } = interaction;
      await interaction.deferReply();
      const helpEmbed = new MessageEmbed()
        .setTitle("PYREWORKER")
        .setColor(colors.WHITE)
        .setAuthor({
          name: `${user.username}#${user.discriminator}`,
          iconURL: user.displayAvatarURL(),
        })
        .setDescription(
          "This discord bot is designed for Pyreworks to manage all the bot related stuff."
        )
        .addField(
          "Create your bio",
          "Use the `/bio` command to create your bio."
        )
        .addField(
          "Edit your bio",
          "Do you see a typo in your bio? or just want to change it? use the `/editbio` command."
        )
        .addField("View your bio", "To view your bio use `/viewbio`.")
        .setFooter({
          text: `Version ${process.env.npm_package_version}`,
          iconURL: interaction.client.user?.displayAvatarURL(),
        });
      await interaction.editReply({ embeds: [helpEmbed] });
      return;
    } catch (err) {
      errorHandler("help command", err);
    }
  },
};
