/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { SlashCommandBuilder } from "@discordjs/builders";
import { MessageEmbed } from "discord.js";
import { commandInt } from "../../interfaces/commandInt";
import { getReferralData } from "../../database/getReferralData";
import { deleteReferralData } from "../../database/deleteReferralData";
import { errorHandler } from "../../utils/errorHandler";
import { colors } from "../../config/colors";

export const deletereferral: commandInt = {
  data: new SlashCommandBuilder()
    .setName("deletereferral")
    .setDescription("Delete a referral code.")
    .addStringOption((option) =>
      option
        .setName("code")
        .setDescription("The referral code you want to delete.")
        .setRequired(true)
    ) as SlashCommandBuilder,
  name: "deletereferral",
  description: "delete a referral code.",
  usage: "/deletereferral <code>",
  run: async (interaction) => {
    const code = interaction.options.getString("code") as string;
    const errorEmbed = new MessageEmbed()
      .setTitle("ERROR!")
      .setColor(colors.black)
      .setDescription(`Referral code ${code} does not exist.`);

    const successEmbed = new MessageEmbed()
      .setTitle("SUCCESS!")
      .setColor(colors.success)
      .setDescription(`Referral code ${code} has been deleted.`);
    try {
      const referralData = await getReferralData(code);
      if (!referralData) {
        await interaction.reply({
          embeds: [errorEmbed],
          ephemeral: true,
        });
        return;
      }
      await deleteReferralData(code);
      await interaction.reply({
        embeds: [successEmbed],
        ephemeral: true,
      });
    } catch (err) {
      errorHandler("delete referral command", err);
    }
  },
};

// Improvements will be made.
