/* eslint-disable no-var */
import { SlashCommandBuilder } from "@discordjs/builders";
import { MessageEmbed, Permissions } from "discord.js";
import { commandInt } from "../../interfaces/commandInt";
import { getRefData } from "../../modules/getRefData";
import { createRefData } from "../../modules/createRefData";
import { errorHandler } from "../../utils/errorHandler";
import { colors } from "../../config/colors";

export const createCode: commandInt = {
  data: new SlashCommandBuilder()
    .setName("createcode")
    .setDescription("Create a partner code.")
    .addStringOption((option) =>
      option
        .setName("code")
        .setDescription("The partner code.")
        .setRequired(true)
    )
    .addUserOption((option) =>
      option
        .setName("partner")
        .setDescription("The partners profile.")
        .setRequired(true)
    )
    .addNumberOption((option) =>
      option
        .setName("discount")
        .setDescription("The % of discount.")
        .setRequired(true)
    ) as SlashCommandBuilder,
  name: "createCode",
  description: "Create a partner code.",
  usage: "/code <code> <partner> ",
  run: async (interaction) => {
    try {
      await interaction.deferReply();
      const { user } = interaction;
      const codeOption = interaction.options.getString("code");
      const partnerOption = interaction.options.getUser("partner");
      const discountOption = interaction.options.getNumber("discount");

      if (!codeOption || !partnerOption || !discountOption) {
        const noArgumentsEmbed = new MessageEmbed()
          .setTitle("ERROR!")
          .setAuthor({
            name: `${user.username}#${user.discriminator}`,
            iconURL: user.displayAvatarURL(),
          })
          .setColor(colors.black)
          .setDescription("The message argument is required.")
          .setFooter({
            text: "© Pyreworks",
            iconURL: interaction.client.user?.displayAvatarURL(),
          });
        await interaction.editReply({
          embeds: [noArgumentsEmbed],
        });
        return;
      }

      /* eslint-disable  @typescript-eslint/no-explicit-any */
      const memberPermissions: any = interaction.member?.permissions;
      if (!memberPermissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
        const noPermissionsEmbed = new MessageEmbed()
          .setTitle("ERROR!")
          .setAuthor({
            name: `${user.username}#${user.discriminator}`,
            iconURL: user.displayAvatarURL(),
          })
          .setColor(colors.black)
          .setDescription("You don't have the required permission(s).")
          .setFooter({
            text: "© Pyreworks",
            iconURL: interaction.client.user?.displayAvatarURL(),
          });
        await interaction.editReply({
          embeds: [noPermissionsEmbed],
        });
        return;
      }

      const targetData = await getRefData(codeOption);

      if (targetData) {
        const existsEmbed = new MessageEmbed()
          .setTitle("ERROR!")
          .setAuthor({
            name: `${user.username}#${user.discriminator}`,
            iconURL: user.displayAvatarURL(),
          })
          .setColor(colors.black)
          .setDescription("This code already exists.")
          .setFooter({
            text: "© Pyreworks",
            iconURL: interaction.client.user?.displayAvatarURL(),
          });
        await interaction.editReply({
          embeds: [existsEmbed],
        });
        return;
      }

      const newRefData = await createRefData(
        partnerOption.id,
        discountOption,
        codeOption.toLowerCase()
      );

      if (!newRefData) {
        const cannotCreateEmbed = new MessageEmbed()
          .setTitle("ERROR!")
          .setAuthor({
            name: `${user.username}#${user.discriminator}`,
            iconURL: user.displayAvatarURL(),
          })
          .setColor(colors.black)
          .setDescription(
            "There is an error with the database entry creation. Please try again later."
          )
          .setFooter({
            text: "© Pyreworks",
            iconURL: interaction.client.user?.displayAvatarURL(),
          });
        await interaction.editReply({
          embeds: [cannotCreateEmbed],
        });
        return;
      }

      const successEmbed = new MessageEmbed()
        .setTitle("SUCCESS!")
        .setAuthor({
          name: `${user.username}#${user.discriminator}`,
          iconURL: user.displayAvatarURL(),
        })
        .setColor(colors.orange)
        .setDescription("You've successfully created the code.")
        .setFooter({
          text: "© Pyreworks",
          iconURL: interaction.client.user?.displayAvatarURL(),
        });

      await interaction.editReply({
        embeds: [successEmbed],
      });
    } catch (err) {
      errorHandler("createCode command", err);
    }
  },
};
