/* eslint-disable no-var */
import { SlashCommandBuilder } from "@discordjs/builders";
import { MessageEmbed } from "discord.js";
import { commandInt } from "../../interfaces/commandInt";
import { getBioData } from "../../modules/getBioData";
import { createBioData } from "../../modules/createBioData";
import { errorHandler } from "../../utils/errorHandler";
import { colors } from "../../config/colors";
import { feedback } from "../../utils/perspectiveFeedback";

export const bio: commandInt = {
  data: new SlashCommandBuilder()
    .setName("bio")
    .setDescription("Create your bio.")
    .addStringOption((option) =>
      option
        .setName("bio")
        .setDescription("A brief introduction about yourself.")
        .setRequired(true)
    ) as SlashCommandBuilder,
  name: "bio",
  description: "Create your bio.",
  usage: "/bio <bio>",
  run: async (interaction) => {
    try {
      await interaction.deferReply();
      const { user } = interaction;
      const bioOption = interaction.options.getString("bio");
      // const departmentRoles = [
      //   "1003002863900950528", // Web Development
      //   "1003002866677579826", // GFX Design
      //   "1003002871450705950", // Setups & Configs
      //   "1003002870498598983", // Ingame Builds
      //   "1003002868061700156", // bot dev
      //   "1003005278536605696", // Animation
      //   "1003002867419975721", // Writing
      //   "1003005378579140638", // Music Production
      // ];
      // let hasDepartment = false;
      // var targetDepartmentRoles = [];
      // if (
      //   departmentRoles.some((role) => {
      //     interaction.guild?.members.cache.get(user.id)?.roles.cache.has(role);
      //   })
      // ) {
      //   targetDepartmentRoles.push(
      //     interaction.guild?.members.cache
      //       .get(user.id)
      //       ?.roles.cache.filter((role) => departmentRoles.includes(role.id))
      //       .map((role) => role.name)
      //   );
      //   hasDepartment = true;
      // } else {
      //   hasDepartment = false;
      // } // use the hasDepartment variable to return "This user has a department" in viewbio if true.
      // var strDepartment;
      // if (!hasDepartment) {
      //   strDepartment = "This user has no department.";
      // } else {
      //   strDepartment = targetDepartmentRoles.toString();
      // } // strDepartment will be a variable used in the viewbio embed field.
      // const staffRoles = [
      //   "1041231784152674326", // Team HR
      //   "1041231787029962852", // Team Marketing
      //   "885764261291388978", // Team Administration
      //   "840977962026664016", // Team Development
      //   "966319616290848809", // Team Commissions
      //   "846356327386316860", // Team Support
      //   "1041231787889799218", // Trainee
      // ];
      // let isStaff = false;
      // var targetStaffRoles = [];
      // if (
      //   staffRoles.some((role) => {
      //     interaction.guild?.members.cache.get(user.id)?.roles.cache.has(role);
      //   })
      // ) {
      //   targetStaffRoles.push(
      //     interaction.guild?.members.cache
      //       .get(user.id)
      //       ?.roles.cache.filter((role) => staffRoles.includes(role.id))
      //       .map((role) => role.name)
      //   );
      //   isStaff = true;
      // } else {
      //   isStaff = false;
      // } // use the isStaff variable to return "This user is a staff member" in viewbio if true.
      // var strStaff;
      // if (!isStaff) {
      //   strStaff = "This user is not a staff member.";
      // } else {
      //   strStaff = targetStaffRoles.toString();
      // } // strStaff will be a variable used in the viewbio embed field.
      if (!bioOption) {
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

      const feedbackEmbed = await feedback(interaction, bioOption.toString());
      if (feedbackEmbed) {
        await interaction.editReply({
          embeds: [feedbackEmbed],
        });
        return;
      }

      const targetData = await getBioData(user.id);

      if (targetData) {
        const existsEmbed = new MessageEmbed()
          .setTitle("ERROR!")
          .setAuthor({
            name: `${user.username}#${user.discriminator}`,
            iconURL: user.displayAvatarURL(),
          })
          .setColor(colors.black)
          .setDescription(
            "You already have a database entry, please update yours using `/editbio`."
          )
          .setFooter({
            text: "© Pyreworks",
            iconURL: interaction.client.user?.displayAvatarURL(),
          });
        await interaction.editReply({
          embeds: [existsEmbed],
        });
        return;
      }

      const newBioData = await createBioData(
        user.id,
        bioOption //,
        // strDepartment,
        // strStaff
      );

      if (!newBioData) {
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
        .setDescription("You've successfully created your bio.")
        .addFields({ name: "Bio", value: newBioData.description })
        .setFooter({
          text: "© Pyreworks",
          iconURL: interaction.client.user?.displayAvatarURL(),
        });

      await interaction.editReply({
        embeds: [successEmbed],
      });
    } catch (err) {
      errorHandler("bio command", err);
    }
  },
};
