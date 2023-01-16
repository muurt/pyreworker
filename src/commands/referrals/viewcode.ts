import { SlashCommandBuilder } from "@discordjs/builders";
import { commandInt } from "../../interfaces/commandInt";
import { errorHandler } from "../../utils/errorHandler";
// import { colors } from "../../config/colors";
// import { MessageEmbed } from "discord.js";

export const viewcode: commandInt = {
  data: new SlashCommandBuilder()
    .setName("viewcode")
    .setDescription("View a referral code.")
    .addStringOption((option) =>
      option
        .setName("code")
        .setDescription("The code you want to view.")
        .setRequired(true)
    ) as SlashCommandBuilder,
  name: "viewcode",
  description: "View a referral code.",
  usage: "/viewcode <code>",
  run: async (interaction) => {
    try {
      await interaction.deferReply();
      // const { user } = interaction;
      // const code = interaction.options.getString("code");
      //   const codeEmbed = new MessageEmbed()
      //     .setTitle(`Code: ${code}`)
      //     .setColor(colors.success)
      //     .setDescription("Code description.")
      //     .addFields(
      //       { name: "Partner", value: "Partner name", inline: true },
      //       { name: "Uses", value: "0", inline: true },
      //       { name: "Expires", value: "Never", inline: true },
      //       { name: "Discount Rate", value: "0%", inline: true },
      //       {
      //         name: "Applicable Services",
      //         value: "All",
      //         inline: true,
      //       }
      //     )
      //     .setFooter({
      //       name: `Requested by ${user.username}`,
      //       value: user.avatarURL(),
      //     });
      //   await interaction.editReply({ embeds: [codeEmbed] });
    } catch (err) {
      errorHandler("viewcode", err);
    }
  },
};
