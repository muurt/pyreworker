/* eslint-disable prefer-const */
import { SlashCommandBuilder } from "@discordjs/builders";
import { MessageEmbed } from "discord.js";
import { commandInt } from "../../interfaces/commandInt";
import { getRefData } from "../../modules/getRefData";
import { errorHandler } from "../../utils/errorHandler";
import { colors } from "../../config/colors";

// * View information about a partner code.
// TODO: Transfer info to DM's, Fix permissions.

export const viewCode: commandInt = {
  data: new SlashCommandBuilder()
    .setName("viewcode")
    .setDescription("View information about a partner code.")
    .addStringOption((option) =>
      option
        .setName("code")
        .setDescription("The code you want to inspect.")
        .setRequired(true)
    ) as SlashCommandBuilder,
  name: "viewcode",
  description: "View information about a partner code.",
  usage: "/viewcode <code>",
  run: async (interaction) => {
    try {
      await interaction.deferReply();
      const { user } = interaction;
      const codeOption = interaction.options.getString("code");
      const successEmbed = new MessageEmbed();

      if (!codeOption) {
        return;
      }

      let targetData;
      targetData = await getRefData(codeOption.toLowerCase());

      if (!targetData) {
        const doesntExistEmbed = new MessageEmbed()
          .setTitle("ERROR!")
          .setAuthor({
            name: `${user.username}#${user.discriminator}`,
            iconURL: user.displayAvatarURL(),
          })
          .setColor(colors.error)
          .setDescription(
            "There was an error with the database lookup (most likely the code doesn't exist)."
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

      const partnerProfile = await interaction.client.users.cache.get(
        targetData.partnerDiscordId
          ? targetData.partnerDiscordId.toString()
          : "doesn't reach"
      );

      successEmbed
        .setAuthor({
          name: `${user.username}#${user.discriminator}`,
          iconURL: user.displayAvatarURL(),
        })
        .setColor(colors.success)
        .setTitle("SUCCESS")
        .setDescription(
          `This is all the information about the code (**${targetData.code}**)`
        )
        .addFields(
          {
            name: "Owner",
            value: `${partnerProfile?.username}`,
          },
          {
            name: "Discount",
            value: `${targetData.discount}`,
          },
          {
            name: "Sales",
            value: `${targetData.sales}`,
          },
          {
            name: "Tab",
            value: `${targetData.tab}`,
          }
        )
        .setTimestamp()
        .setFooter({
          text: "© Pyreworks",
          iconURL: interaction.client.user?.displayAvatarURL(),
        });

      await interaction.editReply({ embeds: [successEmbed] });
    } catch (err) {
      errorHandler("viewcode command", err);
    }
  },
};
