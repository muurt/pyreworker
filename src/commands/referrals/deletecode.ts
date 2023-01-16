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
      //   const { user } = interaction;
      //   const code = interaction.options.getString("code");
      //   const successEmbed = new MessageEmbed()
      //     .setTitle(`SUCCESS`)
      //     .setColor(colors.success)
      //     .setDescription(`Code \`${code}\` has been deleted.`)
      //     .setFooter({
      //       text: `Requested by ${user.username}`,
      //       iconURL: user.avatarURL(),
      //     });
      //   await interaction.editReply({ embeds: [successEmbed] });
    } catch (err) {
      errorHandler("viewcode", err);
    }
  },
};
