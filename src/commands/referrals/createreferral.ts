/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { SlashCommandBuilder } from "@discordjs/builders";
import { MessageEmbed } from "discord.js";
import { commandInt } from "../../interfaces/commandInt";
import { getReferralData } from "../../database/getReferralData";
import { createReferralData } from "../../database/createReferralData";
import { errorHandler } from "../../utils/errorHandler";
import { colors } from "../../config/colors";

export const createreferral: commandInt = {
  data: new SlashCommandBuilder()
    .setName("createreferral")
    .setDescription("Create a referral code.")
    .addStringOption((option) =>
      option
        .setName("code")
        .setDescription("The referral code you want to create.")
        .setRequired(true)
    )
    .addUserOption((option) =>
      option
        .setName("partner")
        .setDescription("The partner for this referral code.")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("description")
        .setDescription("The description for this referral code.")
        .setRequired(true)
    )
    .addIntegerOption((option) =>
      option
        .setName("discount")
        .setDescription("The discount for this referral code.")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("services")
        .setDescription("The services this code applies to.")
        .setRequired(true)
    ) as SlashCommandBuilder,
  name: "createreferral",
  description: "create a referral code.",
  usage: "/createreferral <code> <partner> <description> <discount> <services>",
  run: async (interaction) => {
    try {
      const code = interaction.options.getString("code") as string;
      const partner = interaction.options.getUser("partner")?.id as string;
      const description = interaction.options.getString(
        "description"
      ) as string;
      const discount = interaction.options.getInteger("discount") as number;
      const services = interaction.options.getString("services") as string;
      const referralData = await getReferralData(code);

      const errorEmbed = new MessageEmbed()
        .setTitle("ERROR!")
        .setColor(colors.black)
        .setDescription(`Referral code ${code} already exists.`);
      const successEmbed = new MessageEmbed()
        .setTitle("SUCCESS!")
        .setColor(colors.success)
        .setDescription(`Referral code ${code} has been created.`);
      if (referralData) {
        await interaction.reply({
          embeds: [errorEmbed],
          ephemeral: true,
        });
        return;
      }
      await createReferralData(code, partner, description, discount, services);
      await interaction.reply({
        embeds: [successEmbed],
        ephemeral: true,
      });
    } catch (err) {
      errorHandler("create referral command", err);
    }
  },
};

// Improvements will be made.
