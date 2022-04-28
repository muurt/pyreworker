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

export const delay = async (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const confirm = async (
  buttonInteraction: ButtonInteraction,
  interactionUser: User
): Promise<boolean> => {
  let value = false;
  const collectorFilter = (i: ButtonInteraction) => {
    i.deferUpdate();
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
    .setTitle("Confirmation")
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
    .setTitle("INFO!")
    .setAuthor({
      name: `${interactionUser.username}#${interactionUser.discriminator}`,
      iconURL: interactionUser.displayAvatarURL(),
    })
    .setColor(colors.white)
    .setDescription("Ticket canceled as there was no reply.")
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
  const dmMessage = await buttonInteraction.user
    .send({
      embeds: [replyEmbed],
      components: [confirmationButtons],
    })
    .catch(async () => {
      await buttonInteraction.reply({
        embeds: [
          replyEmbed.addField(
            "DM's",
            "You don't have your dms open, hence the confirmation must take place here"
          ),
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
              embeds: [cancelEmbed.setDescription("You canceled your ticket.")],
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
              embeds: [cancelEmbed.setDescription("You canceled your ticket.")],
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
      .catch(() => {
        buttonInteraction.editReply({
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
    if (interaction.isButton()) {
      const { user } = interaction;
      switch (interaction.customId) {
        case "support":
          supportTicketsHandle(interaction);
          break;
        case "order": {
          const confirmation = await confirm(interaction, user);
          if (!confirmation) {
            return;
          }
          break;
        }
        case "application": {
          const confirmation = await confirm(interaction, user);
          if (!confirmation) {
            return;
          }
          break;
        }
        case "support-ticket-claim":
          supportTicketsClaim(interaction);
          break;
        case "support-ticket-notifym":
          supportTicketsNotify(interaction);
          break;
        default:
          return;
      }
    }
  } catch (err) {
    errorHandler("onInteraction event", err);
  }
};
