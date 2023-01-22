/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable prettier/prettier */
import { SlashCommandBuilder } from "@discordjs/builders";
import { MessageEmbed } from "discord.js";
import { commandInt } from "../../interfaces/commandInt";
import { getReferralData } from "../../database/getReferralData";
import { errorHandler } from "../../utils/errorHandler";
import { colors } from "../../config/colors";

export const viewreferral: commandInt = {
  data: new SlashCommandBuilder()
    .setName("viewreferral")
    .setDescription("View a referral code.")
    .addStringOption((option) =>
      option
        .setName("code")
        .setDescription("The referral code you want to view.")
        .setRequired(true)
    ) as SlashCommandBuilder,
  name: "viewreferral",
  description: "view information about a referral code.",
  usage: "/viewreferral <code>",
  run: async (interaction) => {
    const errorEmbed = new MessageEmbed()
    .setTitle("ERROR!")
    .setColor(colors.black)
    .setDescription("That code doesn't exist!");
    const referralEmbed = new MessageEmbed()
    .setTitle("Referral Code")
    .setColor(colors.orange)
    .setDescription("This is the referral code you requested.");
    try {
      const code = interaction.options.getString("code") as string;
      const referralData = await getReferralData(code);
      if (!referralData) {
        await interaction.reply({
          embeds: [errorEmbed],
          ephemeral: true,
        });
        return;
      }
      referralEmbed.addField(`Code`, referralData.code as string, true);
      referralEmbed.addField(`Description`, referralData.description as string, true);
      referralEmbed.addField(`Partner`, referralData.partner as string, true);
      referralEmbed.addField(`Discount`, referralData.discount as string, true);
      referralEmbed.addField(`Services`, referralData.services as string, true);
        // { name: "Code", value: referralData.code },
        // { name: "Description", value: referralData.description },
        // { name: "Partner", value: referralData.partner },
        // { name: "Discount", value: referralData.discount },
        // { name: "Services", value: referralData.services } fucking wont work for some reason and gives me a random ass error.
      await interaction.reply({
        embeds: [referralEmbed],
        ephemeral: true,
      });
    } catch (err) {
      errorHandler("view referral command", err);
    }
  },
};

// Improvements will be made. At least i got rid of the fucking errors ;(
