/* eslint-disable prettier/prettier */
import {
  ButtonInteraction,
  MessageActionRow,
  MessageButton,
  MessageEmbed,
  Message,
  MessageSelectMenu,
  Permissions,
  SelectMenuInteraction,
} from "discord.js";
import { confirm, delay } from "../events/onInteraction";
import { errorHandler } from "../utils/errorHandler";
import { colors } from "../config/colors";

export const supportTicketsNotify = async (
  interaction: ButtonInteraction
): Promise<void> => {
  const { user } = interaction;
  await interaction.deferReply({
    ephemeral: true,
  });

  const ticketID = interaction.message.embeds[0].footer?.text
    .toString()
    .replace("© Pyreworks | ", "");
  const managementChannel =
    interaction.client.channels.cache.get("840145878610083881");
  const notifiedEmbed = new MessageEmbed()
    .setTitle("SUCCESS!")
    .setAuthor({
      name: `${user.username}#${user.discriminator}`,
      iconURL: user.displayAvatarURL(),
    })
    .setColor(colors.orange)
    .setDescription("You've successfully notified management!")
    .setFooter({
      text: "© Pyreworks",
      iconURL: interaction.client.user?.displayAvatarURL(),
    });
  const notificationEmbed = new MessageEmbed()
    .setTitle("INFO!")
    .setAuthor({
      name: `${user.username}#${user.discriminator}`,
      iconURL: user.displayAvatarURL(),
    })
    .setColor(colors.white)
    .setDescription("Ticket needs escalation.")
    .addFields(
      { name: "Ticket Channel", value: `<#${ticketID}>` },
      { name: "Escalator", value: `<@${interaction.user.id}>` }
    )
    .setFooter({
      text: "© Pyreworks",
      iconURL: interaction.client.user?.displayAvatarURL(),
    });

  if (
    !ticketID ||
    !managementChannel ||
    managementChannel.type !== "GUILD_TEXT"
  ) {
    return;
  }

  const ticketChannel = interaction.client.channels.cache.get(ticketID);

  if (!ticketChannel || ticketChannel.type !== "GUILD_TEXT") {
    return;
  }

  await interaction.editReply({
    embeds: [notifiedEmbed],
  });
  await managementChannel
    .send({
      embeds: [notificationEmbed],
    })
    .then(() =>
      managementChannel
        .send({ content: "<@&840977614806319135>" })
        .then((m) => m.delete())
    );
};

export const supportTicketsClaim = async (
  interaction: ButtonInteraction
): Promise<void> => {
  const { user } = interaction;
  await interaction.deferReply({
    ephemeral: true,
  });
  const ticketID = interaction.message.embeds[0].footer?.text
    .toString()
    .replace("© Pyreworks | ", "");
  const claimedEmbed = new MessageEmbed()
    .setTitle("SUCCESS!")
    .setAuthor({
      name: `${user.username}#${user.discriminator}`,
      iconURL: user.displayAvatarURL(),
    })
    .setColor(colors.orange)
    .setDescription("You've successfully claimed your ticket!")
    .setFooter({
      text: "© Pyreworks",
      iconURL: interaction.client.user?.displayAvatarURL(),
    });
  const notificationEmbed = new MessageEmbed()
    .setTitle("INFO!")
    .setAuthor({
      name: `${user.username}#${user.discriminator}`,
      iconURL: user.displayAvatarURL(),
    })
    .setDescription(
      `A support representative has claimed your ticket and is ready to assist you!`
    )
    .setColor(colors.white)
    .addFields({ name: "Support Representative", value: `<@${interaction.user.id}>` })
    .setFooter({
      text: "© Pyreworks",
      iconURL: interaction.client.user?.displayAvatarURL(),
    });
  if (!ticketID) {
    console.log("error 1");
    return;
  }
  console.log("no error mate");

  const ticketChannel = interaction.client.channels.cache.get(ticketID);
  const ticketsChannel =
    interaction.client.channels.cache.get("967773917685104741");
  if (
    !ticketChannel ||
    ticketChannel.type !== "GUILD_TEXT" ||
    !ticketsChannel ||
    ticketsChannel.type !== "GUILD_TEXT"
  ) {
    return;
  }

  const ticketUser = ticketChannel.topic;

  await ticketChannel.permissionOverwrites.create(user.id, {
    VIEW_CHANNEL: true,
  });

  await ticketsChannel.messages
    .fetch(interaction.message.id)
    .then(async (msg) => msg.delete())
    .catch((err) => errorHandler(err, "deleting a message"));

  await interaction
    .editReply({
      embeds: [
        claimedEmbed.addField("Ticket channel", `<#${ticketChannel.id}>`),
      ],
    })
    .then(() => {
      ticketChannel
        .send({ content: `<@${ticketUser}>` })
        .then((msg) => msg.delete());
      ticketChannel.send({
        embeds: [notificationEmbed],
      });
    });
};

export const supportTicketsHandle = async (
  interaction: ButtonInteraction
): Promise<void> => {
  try {
    const { user } = interaction;
    const ticketsCategory = "966925310337642496";
    const confirmation = await confirm(interaction, user);
    const typeEmbed = new MessageEmbed()
      .setTitle("QUESTION!")
      .setAuthor({
        name: `${user.username}#${user.discriminator}`,
        iconURL: user.displayAvatarURL(),
      })
      .setColor(colors.white)
      .setDescription("What category do you need support with?")
      .setFooter({
        text: "© Pyreworks",
        iconURL: interaction.client.user?.displayAvatarURL(),
      });
    const typeSelectMenu = new MessageActionRow().addComponents(
      new MessageSelectMenu()
        .setCustomId("support-type")
        .setPlaceholder("Select category of support")
        .addOptions([
          {
            label: "Payments",
            description: "Questions and concerns about payments & payouts.",
            value: "payment-support",
          },
          {
            label: "Partnering",
            description: "Partner requests & questions.",
            value: "partner-support",
          },
          {
            label: "Q&A",
            description: "General questions.",
            value: "qna-support",
          },
          {
            label: "Bot related",
            description: "Bot related questions.",
            value: "bot-support",
          },
          {
            label: "Else",
            description: "Something else.",
            value: "else-support",
          },
        ])
    );

    if (!confirmation) {
      return;
    }

    await interaction.guild?.channels
      .create(
        `support-${interaction.user.username.substring(0, 3)}${Math.floor(
          Math.random() * 10000
        )
          .toString()
          .substring(0, 3)}`,
        {
          type: "GUILD_TEXT",
          topic: `${user.id.toString()}`,
          parent: ticketsCategory,
          permissionOverwrites: [
            {
              id: interaction.guild.id,
              deny: [Permissions.FLAGS.VIEW_CHANNEL],
            },
            {
              id: interaction.user.id,
              allow: [Permissions.FLAGS.VIEW_CHANNEL],
            },
          ],
        }
      )
      .then(async (ticketChannel) => {
        await ticketChannel
          .send({
            content: `<@${user.id}>`,
          })
          .then((m) => m.delete())
          .catch((err) => errorHandler(err, "deleting a message"));
        await ticketChannel
          .send({
            embeds: [typeEmbed],
            components: [typeSelectMenu],
          })
          .then((m) => {
            const ticketMessage = m;
            let ticketCategory: string;
            let ticketDescription: Message<boolean> | undefined;
            const supportChannel =
              interaction.client.channels.cache.get("840145878610083881");
            if (!supportChannel || supportChannel.type !== "GUILD_TEXT") {
              return;
            }
            const noSelectEmbed = new MessageEmbed()
              .setTitle("WARN!")
              .setAuthor({
                name: `${user.username}#${user.discriminator}`,
                iconURL: user.displayAvatarURL(),
              })
              .setColor(colors.gray)
              .setDescription(
                "You didn't select anything.\nTicket creation was canceled and this channel will be deleted in 1 min."
              )
              .setFooter({
                text: "© Pyreworks",
                iconURL: interaction.client.user?.displayAvatarURL(),
              });
            const descriptionEmbed = new MessageEmbed()
              .setTitle("QUESTION!")
              .setAuthor({
                name: `${user.username}#${user.discriminator}`,
                iconURL: user.displayAvatarURL(),
              })
              .setColor(colors.white)
              .setDescription(
                "Please write a brief description about your issue/question."
              )
              .setFooter({
                text: "© Pyreworks",
                iconURL: interaction.client.user?.displayAvatarURL(),
              });
            const finishedEmbed = new MessageEmbed()
              .setTitle("SUCCESS!")
              .setAuthor({
                name: `${user.username}#${user.discriminator}`,
                iconURL: user.displayAvatarURL(),
              })
              .setColor(colors.orange)
              .setDescription(
                "You've successfully finished setting up your support ticket.\nYour ticket has been sent to our staff and will look into it as soon as possible."
              )
              .setFooter({
                text: "© Pyreworks",
                iconURL: interaction.client.user?.displayAvatarURL(),
              });
            const supportEmbed = new MessageEmbed()
              .setTitle("NEW TICKET!")
              .setAuthor({
                name: `${user.username}#${user.discriminator}`,
                iconURL: user.displayAvatarURL(),
              })
              .setColor(colors.white)
              .setDescription(`<@${user.id}> created a support ticket.`)
              .setFooter({
                text: `© Pyreworks | ${ticketChannel.id}`,
                iconURL: interaction.client.user?.displayAvatarURL(),
              });
            const claimButtons = new MessageActionRow().addComponents(
              new MessageButton()
                .setCustomId("support-ticket-claim")
                .setLabel("Claim")
                .setStyle("SUCCESS")
                .setEmoji("967707003705237524"),
              new MessageButton()
                .setCustomId("support-ticket-notifym")
                .setLabel("Notify Management")
                .setStyle("DANGER")
                .setEmoji("968144163986104341")
            );

            const collectorFilter = (i: SelectMenuInteraction) => {
              i.deferUpdate();
              return i.user.id === user.id && i.customId === "support-type";
            };

            m.channel
              .awaitMessageComponent({
                componentType: "SELECT_MENU",
                filter: collectorFilter,
                time: 30000,
              })
              .then(async (i) => {
                ticketCategory = i.values[0];
                ticketMessage
                  .edit({
                    embeds: [descriptionEmbed],
                    components: [],
                  })
                  .then(() => {
                    const descriptionFilter = (message: Message) => {
                      return message.author.id === user.id;
                    };
                    ticketMessage.channel
                      .awaitMessages({
                        filter: descriptionFilter,
                        max: 1,
                        time: 600000,
                        errors: ["time"],
                      })
                      .then(async (des) => {
                        ticketDescription = des.first();
                        await des.first()?.delete();
                        await ticketMessage
                          .edit({
                            embeds: [
                              finishedEmbed
                                .addFields({ name: "Category", value: ticketCategory },
                                {
                                  name: "Description",
                                  value: ticketDescription
                                    ? ticketDescription.toString()
                                    : "No description provided." } // won't reach
                                ),
                            ],
                          })
                          .then(
                            async () =>
                              await supportChannel.send({
                                embeds: [
                                  supportEmbed
                                  .addFields({ name: "Category", value: ticketCategory },
                                  {
                                    name: "Description",
                                    value: ticketDescription
                                      ? ticketDescription.toString()
                                      : "No description provided" } // won't reach
                                    ),
                                ],
                                components: [claimButtons],
                              })
                          );
                      })
                      .catch(async () => {
                        await ticketMessage.edit({
                          embeds: [
                            noSelectEmbed.setDescription(
                              "You didn't write anything.\nTicket creation has been canceled and this channel will be deleted in 1 minute"
                            ),
                          ],
                        });
                        await delay(30000);
                        await ticketMessage.edit({
                          embeds: [
                            noSelectEmbed.setDescription(
                              "You didn't write anything.\nTicket creation has been canceled and this channel will be deleted in 30 seconds"
                            ),
                          ],
                        });
                      });
                  })
                  .catch((err) => errorHandler(err, "editing ticket message"));
              })
              .catch(async () => {
                await ticketMessage.edit({
                  embeds: [noSelectEmbed],
                });
                await delay(30000);
                await ticketMessage.edit({
                  embeds: [
                    noSelectEmbed.setDescription(
                      "You didn't select anything.\nTicket creation was canceled and this channel will be deleted in 30 seconds."
                    ),
                  ],
                });
                await delay(30000);
                await ticketChannel.delete();
              });
          });
      })
      .catch((err) => errorHandler(err, "creating a support ticket channel"));
  } catch (err) {
    errorHandler("supportTicketsHandle module", err);
  }
};
