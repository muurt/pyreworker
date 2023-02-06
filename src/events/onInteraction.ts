/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ButtonInteraction,
  Interaction,
  MessageActionRow,
  MessageButton,
  MessageEmbed,
  User,
} from "discord.js";
import { commandList } from "../commands/_commandList";
import { errorHandler } from "../utils/errorHandler";
import { colors } from "../config/colors";
import {
  supportTicketsHandle,
  supportTicketsClaim,
  supportTicketsNotify,
} from "../modules/supportTicketsHandle";
import {
  orderTicketsHandle,
  orderTicketsClaim,
  orderTicketsNotify,
} from "../modules/orderTicketsHandle";
import {
  applicationTicketsHandle,
  applicationTicketsClaim,
  applicationTicketsNotify,
} from "../modules/applicationTicketsHandle";
import { addRoleEvent } from "../modules/buttons/addRole";
import { clearRoleEvent } from "../modules/buttons/clearRole";
import { confirmSelectionEvent } from "../modules/buttons/confirmSelection";
import { displayRolesEvent } from "../modules/buttons/displayRoles";
import { removeRoleEvent } from "../modules/buttons/removeRole";
import { addRoleModalEvent } from "../modules/modals/addRoleModal";
import { sendModalEmbedEvent } from "../modules/modals/sendEmbed";
import { removeRoleFromMenu } from "../modules/selectMenus/RemoveRoleFromMenu";
import { updateMemberRoles } from "../modules/selectMenus/updateMemberRoles";

export const delay = async (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const confirm = async (
  buttonInteraction: ButtonInteraction,
  interactionUser: User
): Promise<boolean> => {
  let value = false;
  const collectorFilter = async (i: ButtonInteraction) => {
    await i.deferUpdate();
    return i.user.id === interactionUser.id;
  };
  const confirmationButtons = new MessageActionRow().addComponents(
    new MessageButton()
      .setCustomId("conf-accept")
      .setStyle("SUCCESS")
      .setLabel("Yes"),
    new MessageButton()
      .setCustomId("conf-deny")
      .setStyle("DANGER")
      .setLabel("No")
  );
  const replyEmbed = new MessageEmbed()
    .setTitle("QUESTION!")
    .setAuthor({
      name: `${interactionUser.username}#${interactionUser.discriminator}`,
      iconURL: interactionUser.displayAvatarURL(),
    })
    .setColor(colors.white)
    .setDescription(
      `Are you sure you want to create ${
        buttonInteraction.customId === "support" ? "a" : "an"
      } ${buttonInteraction.customId} ticket?`
    )
    .setFooter({
      text: "© Pyreworks",
      iconURL: buttonInteraction.client.user?.displayAvatarURL(),
    });
  const cancelEmbed = new MessageEmbed()
    .setTitle("WARN!")
    .setAuthor({
      name: `${interactionUser.username}#${interactionUser.discriminator}`,
      iconURL: interactionUser.displayAvatarURL(),
    })
    .setColor(colors.gray)
    .setDescription("Ticket cancelled as there was no reply.")
    .setFooter({
      text: "© Pyreworks",
      iconURL: buttonInteraction.client.user?.displayAvatarURL(),
    });

  const successEmbed = new MessageEmbed()
    .setTitle("SUCCESS!")
    .setAuthor({
      name: `${interactionUser.username}#${interactionUser.discriminator}`,
      iconURL: interactionUser.displayAvatarURL(),
    })
    .setColor(colors.orange)
    .setDescription("Your ticket is being created!")
    .setFooter({
      text: "© Pyreworks",
      iconURL: buttonInteraction.client.user?.displayAvatarURL(),
    });

  let dmsOpen = true;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const channelMessage = await buttonInteraction.reply({
    content: "Please check your DM's for confirmation.",
    components: [],
    ephemeral: true,
  });
  const dmMessage = await buttonInteraction.user
    .send({
      embeds: [replyEmbed],
      components: [confirmationButtons],
    })
    .catch(async () => {
      await buttonInteraction.reply({
        embeds: [
          replyEmbed.addFields({
            name: "DM's",
            value:
              "You don't have your dms open, hence the confirmation must take place here",
          }),
        ],
        components: [confirmationButtons],
        ephemeral: true,
      });
      dmsOpen = false;
    });

  if (dmsOpen && dmMessage) {
    await dmMessage
      .awaitMessageComponent({
        componentType: "BUTTON",
        filter: collectorFilter,
        time: 30000,
      })
      .then(async (i) => {
        switch (i.customId) {
          case "conf-deny":
            await dmMessage.edit({
              embeds: [
                cancelEmbed.setDescription("You cancelled your ticket."),
              ],
              components: [],
            });
            break;
          case "conf-accept": {
            await dmMessage.edit({
              embeds: [successEmbed],
              components: [],
            });
            value = true;
            break;
          }
          default:
            return;
        }
      })
      .catch(async () => {
        await dmMessage.edit({
          embeds: [cancelEmbed],
          components: [],
        });
      });
  } else {
    await buttonInteraction.channel
      ?.awaitMessageComponent({
        componentType: "BUTTON",
        filter: collectorFilter,
        time: 15000,
      })
      .then(async (i) => {
        switch (i.customId) {
          case "conf-deny":
            await buttonInteraction.editReply({
              embeds: [
                cancelEmbed.setDescription("You cancelled your ticket."),
              ],
              components: [],
            });
            return false;
          case "conf-accept": {
            await buttonInteraction.editReply({
              embeds: [successEmbed],
              components: [],
            });
            value = true;
            return;
          }
          default:
            return;
        }
      })
      .catch(async () => {
        await buttonInteraction.editReply({
          embeds: [cancelEmbed],
          components: [],
        });
      });
  }

  return value;
};

export const onInteraction = async (
  interaction: Interaction
): Promise<void> => {
  try {
    if (interaction.isCommand()) {
      for (const command of commandList) {
        if (interaction.commandName === command.data.name) {
          await command.run(interaction);
          break;
        }
      }
    }
    // ticket buttons.
    if (interaction.isButton()) {
      switch (interaction.customId) {
        case "display-roles":
          await displayRolesEvent(interaction);
          break;
        case "menu-add-role":
          await addRoleEvent(interaction);
          break;
        case "menu-remove-role":
          await removeRoleEvent(interaction);
          break;
        case "clear-roles":
          await clearRoleEvent(interaction);
          break;
        case "menu-confirm-role":
          await confirmSelectionEvent(interaction);
          break;
        case "support":
          await supportTicketsHandle(interaction);
          break;
        case "order":
          await orderTicketsHandle(interaction);
          break;
        case "application":
          await applicationTicketsHandle(interaction);
          break;
        // ticket claim.
        case "support-ticket-claim":
          await supportTicketsClaim(interaction);
          break;
        case "order-ticket-claim":
          await orderTicketsClaim(interaction);
          break;
        case "application-ticket-claim":
          await applicationTicketsClaim(interaction);
          break;
        // ticket notify.
        case "support-ticket-notifym":
          await supportTicketsNotify(interaction);
          break;
        case "order-ticket-notifym":
          await orderTicketsNotify(interaction);
          break;
        case "application-ticket-notifym":
          await applicationTicketsNotify(interaction);
          break;
        default:
          return;
      }
    }
    if (interaction.isModalSubmit()) {
      switch (interaction.customId) {
        case "add-role-to-menu":
          await addRoleModalEvent(interaction);
          break;
        case "menu-role-channel":
          await sendModalEmbedEvent(interaction);
          break;
        default:
          return;
      }
    }
    if (interaction.isSelectMenu()) {
      switch (interaction.customId) {
        case "remove-role-from-menu":
          await removeRoleFromMenu(interaction);
          break;
        case "select-menu-roles":
          await updateMemberRoles(interaction);
          break;
        default:
          return;
      }
    }
  } catch (err) {
    errorHandler("onInteraction event", err);
  }
};
