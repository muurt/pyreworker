/* eslint-disable prefer-const */
import { SlashCommandBuilder } from "@discordjs/builders";
import { MessageEmbed } from "discord.js";
import { commandInt } from "../../interfaces/commandInt";
import { getBioData } from "../../modules/getBioData";
import { errorHandler } from "../../utils/errorHandler";
import { colors } from "../../config/colors";

export const viewbio: commandInt = {
  data: new SlashCommandBuilder()
    .setName("viewbio")
    .setDescription("Shows your bio.")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user you want to view their bio.")
        .setRequired(true)
    ) as SlashCommandBuilder,
  name: "viewbio",
  description: "View your (or someone else) bio.",
  usage: "/bio <id?>",
  run: async (interaction) => {
    try {
      await interaction.deferReply();
      const { user } = interaction;
      const userOption = interaction.options.getUser("user");
      const successEmbed = new MessageEmbed();
      const targetId = userOption?.id;
      const targetUser = interaction.guild?.members.cache.get(<string>targetId);
      // Roles to check for.
      const departmentRoles = [
        "Web Development",
        "GFX Design",
        "Setups & Configs",
        "Ingame Builds",
        "Bot Development",
        "Animation",
        "Writing",
        "Music Production",
      ];
      const staffRoles = [
        "Team HR",
        "Team Marketing",
        "Team Administration",
        "Team Development",
        "Team Commissions",
        "Team Support",
      ];
      let targetStaffRoles = [] as Array<string>;
      let targetDepartmentRoles = [] as Array<string>;
      let targetStaff: string | undefined;
      let targetDepartment: string | undefined;

      // Check if the user has any staff roles.
      staffRoles.forEach((role) => {
        if (targetUser?.roles.cache.find((r) => r.name === role)) {
          targetStaffRoles.push(" " + role);
          if (targetStaffRoles.length > 0) {
            targetStaff = "This user is a part of the following staff teams...";
          }
        }
      });
      if (targetStaff === undefined) {
        targetStaff = "This user is not a part of any staff team.";
      }

      // Check if the user has any department roles.
      departmentRoles.forEach((role) => {
        if (targetUser?.roles.cache.find((r) => r.name === role)) {
          targetDepartmentRoles.push(" " + role);
          if (targetDepartmentRoles.length > 0) {
            targetDepartment =
              "This user is a part of the following departments...";
          }
        }
      });
      if (targetDepartment === undefined) {
        targetDepartment = "This user is not a part of any department.";
      }

      let targetData;
      if (userOption) {
        targetData = await getBioData(userOption.id);
      } else {
        targetData = await getBioData(user.id);
      }

      if (!targetData) {
        const doesntExistEmbed = new MessageEmbed()
          .setTitle("ERROR!")
          .setAuthor({
            name: `${user.username}#${user.discriminator}`,
            iconURL: user.displayAvatarURL(),
          })
          .setColor(colors.black)
          .setDescription(
            "There was an error with the database lookup (most likely the user doesn't have a database entry)."
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

      successEmbed
        .setAuthor({
          name: `${user.username}#${user.discriminator}`,
          iconURL: user.displayAvatarURL(),
        })
        .setColor(colors.orange)
        .setTitle("SUCCESS")
        .setDescription(
          `**${userOption ? userOption.username : user.username}'s bio** \n${
            targetData.description
          }`
        )
        .addFields(
          {
            name: "Bio ID",
            value: `${targetData.id}`,
          },
          {
            name: "Member Since...",
            value: `${targetUser?.joinedAt}`,
          },
          {
            name: "Email ID",
            value: `${targetData.email}` || `This user doesn't have an email.`,
          },
          {
            name: "Portfolio",
            value:
              `A portfolio for this user exists. \n[Click Here](${targetData.portfolio})` ||
              `No portfolio exists for this user.`,
          },
          {
            name: "Staff Member?",
            value: `${targetStaff}` || "This user is not a staff member.",
          },
          {
            name: "Staff Team(s)",
            value: `${targetStaffRoles}` || "None",
          },
          {
            name: "Has Department?",
            value:
              `${targetDepartment}` ||
              "this user is not a part of any department.",
          },
          {
            name: "Department(s)",
            value: `${targetDepartmentRoles}` || "None",
          }
        )
        .setTimestamp()
        .setFooter({
          text: "© Pyreworks",
          iconURL: interaction.client.user?.displayAvatarURL(),
        });

      await interaction.editReply({ embeds: [successEmbed] });
    } catch (err) {
      errorHandler("viewbio command", err);
    }
  },
};
