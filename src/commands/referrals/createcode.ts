import { SlashCommandBuilder } from "@discordjs/builders";
import { commandInt } from "../../interfaces/commandInt";
import { errorHandler } from "../../utils/errorHandler";
import { colors } from "../../config/colors";
import { MessageEmbed } from "discord.js";

export const createcode: commandInt = {
  data: new SlashCommandBuilder()
    .setName("createcode")
    .setDescription("Create a referral code.")
    .addStringOption((option) =>
      option
        .setName("code")
        .setDescription("The code you want to use.")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("description")
        .setDescription("A description of the code.")
        .setRequired(true)
    )
    .addMentionableOption((option) =>
      option
        .setName("partner")
        .setDescription("The partner the code is for.")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("expires")
        .setDescription("The date the code expires.")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("discountrate")
        .setDescription("Discount % for the code.")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("applicableservices")
        .setDescription("The services the code is applicable to.")
        .setRequired(true)
    ) as SlashCommandBuilder,
  name: "createcode",
  description: "Create a referral code.",
  usage:
    "/createcode <code> <description> <partner> <uses> <expires> <discountrate> <applicableservices>",
  run: async (interaction) => {
    try {
      await interaction.deferReply();
      const { user } = interaction;
      const codeOption = interaction.options.getString("code");
      const descriptionOption = interaction.options.getString("description");
      const partnerOption = interaction.options.getMentionable("partner");
      const usesOption = interaction.options.getString("uses");
      const expiresOption = interaction.options.getString("expires");
      const discountrateOption = interaction.options.getString("discountrate");
      //   const applicableservicesOption =
      //     interaction.options.getString("applicableservices");
      if (
        !codeOption ||
        !descriptionOption ||
        !partnerOption ||
        !usesOption ||
        !expiresOption ||
        !discountrateOption
      ) {
        const noArgumentsEmbed = new MessageEmbed()
          .setTitle("ERROR!")
          .setAuthor({
            name: `${user.username}#${user.discriminator}`,
            iconURL: user.displayAvatarURL(),
          })
          .setColor(colors.black)
          .setDescription("All arguments are required.")
          .setFooter({
            text: "© Pyreworks",
            iconURL: interaction.client.user?.displayAvatarURL(),
          });
        await interaction.editReply({
          embeds: [noArgumentsEmbed],
        });
        return;
      }
      //   const codeEmbed = new MessageEmbed()
      //     .setTitle("Code Created!")
      //     .setAuthor({
      //       name: `${user.username}#${user.discriminator}`,
      //       iconURL: user.displayAvatarURL(),
      //     })
      //     .setColor(colors.black)
      //     .setDescription(`Relaying information about the created code.`);
      //   codeEmbed.addFields({
      //     name: "Code",
      //     value: codeOption,
      //   });
      //   codeEmbed.addFields({
      //     name: "Description",
      //     value: descriptionOption,
      //   });
      //   codeEmbed.addFields({
      //     name: "Partner",
      //     value: partnerOption,
      //   });
      //   codeEmbed.addFields({
      //     name: "Uses",
      //     value: usesOption,
      //   });
      //   codeEmbed.addFields({
      //     name: "Expires",
      //     value: expiresOption,
      //   });
      //   codeEmbed.addFields({
      //     name: "Discount Rate",
      //     value: discountrateOption,
      //   });
      //   codeEmbed.addFields({
      //     name: "Applicable Services",
      //     value: applicableservicesOption,
      //   });
      //   codeEmbed.addFields({
      //     name: "Created By",
      //     value: user,
      //   });
      //   codeEmbed.addFields({
      //     name: "Created At",
      //     value: new Date(),
      //   });
      //     .setFooter({
      //       text: "© Pyreworks",
      //       iconURL: interaction.client.user?.displayAvatarURL(),
      //     }),
      //   await interaction.editReply({
      //     embeds: [codeEmbed],
      //   });
    } catch (err) {
      errorHandler("createcode", err);
    }
  },
};
