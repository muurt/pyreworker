import {
  ButtonInteraction,
  MessageActionRow,
  MessageButton,
  MessageEmbed,
  Message,
  MessageSelectMenu,
  Permissions,
  SelectMenuInteraction,
  MessageOptions,
  MessagePayload,
} from "discord.js";
import { confirm, delay } from "../events/onInteraction";
import { errorHandler } from "../utils/errorHandler";
import { colors } from "../config/colors";

export const applicationTicketsNotify = async (
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
    .setColor(colors.success)
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
    .setColor(colors.info)
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

export const applicationTicketsClaim = async (
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
    .setColor(colors.success)
    .setDescription("You've successfully claimed the application!")
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
    .setDescription(`A management staff has claimed your application!`)
    .setColor(colors.info)
    .addFields({ name: "Management Staff", value: `<@${interaction.user.id}>` })
    .setFooter({
      text: "© Pyreworks",
      iconURL: interaction.client.user?.displayAvatarURL(),
    });
  if (!ticketID) {
    return;
  }

  const ticketChannel = interaction.client.channels.cache.get(ticketID);
  const ticketsChannel =
    interaction.client.channels.cache.get("840145878610083881");
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
        claimedEmbed.addFields({
          name: "Ticket channel",
          value: `<#${ticketChannel.id}>`,
        }),
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

export const applicationTicketsHandle = async (
  interaction: ButtonInteraction
): Promise<void> => {
  try {
    const { user } = interaction;
    const ticketsCategory = "966925310337642496";
    const confirmation = await confirm(interaction, user);
    const ageEmbed = new MessageEmbed()
      .setTitle("QUESTION!")
      .setAuthor({
        name: `${user.username}#${user.discriminator}`,
        iconURL: user.displayAvatarURL(),
      })
      .setColor(colors.info)
      .setDescription("How old are you?")
      .setFooter({
        text: "© Pyreworks",
        iconURL: interaction.client.user?.displayAvatarURL(),
      });
    const ageSelectMenu = new MessageActionRow().addComponents(
      new MessageSelectMenu()
        .setCustomId("age")
        .setPlaceholder("Select your age.")
        .addOptions([
          {
            label: "Over 13",
            value: "over-age-limit",
          },
          {
            label: "Under 13",
            value: "under-age-limit",
          },
        ])
    );

    if (!confirmation) {
      return;
    }

    await interaction.guild?.channels
      .create(
        `app-${interaction.user.username.substring(0, 3)}${Math.floor(
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
            embeds: [ageEmbed],
            components: [ageSelectMenu],
          })
          .then((m) => {
            const ticketMessage = m;
            let age: string | MessagePayload | MessageOptions;
            let introduction: Message<boolean> | undefined;
            let portfolio: Message<boolean> | undefined;
            let ph: Message<boolean> | undefined;
            let timelimit: string;
            let why: Message<boolean> | undefined;
            let past: Message<boolean> | undefined;
            let further: Message<boolean> | undefined;
            const applicationChannel =
              interaction.client.channels.cache.get("840145878610083881");
            if (
              !applicationChannel ||
              applicationChannel.type !== "GUILD_TEXT"
            ) {
              return;
            }
            const noSelectEmbed = new MessageEmbed()
              .setTitle("WARN!")
              .setAuthor({
                name: `${user.username}#${user.discriminator}`,
                iconURL: user.displayAvatarURL(),
              })
              .setColor(colors.warn)
              .setDescription(
                "You didn't select anything.\nTicket creation was canceled and this channel will be deleted in 1 min."
              )
              .setFooter({
                text: "© Pyreworks",
                iconURL: interaction.client.user?.displayAvatarURL(),
              });
            const underAgeLimitEmbed = new MessageEmbed()
              .setTitle("WARN!")
              .setAuthor({
                name: `${user.username}#${user.discriminator}`,
                iconURL: user.displayAvatarURL(),
              })
              .setColor(colors.warn)
              .setDescription(
                "Sorry, you are under the age limit.\nThis ticket will be deleted and you will be reported to Discord staff."
              )
              .setFooter({
                text: "© Pyreworks",
                iconURL: interaction.client.user?.displayAvatarURL(),
              });
            const introductionEmbed = new MessageEmbed()
              .setTitle("QUESTION!")
              .setAuthor({
                name: `${user.username}#${user.discriminator}`,
                iconURL: user.displayAvatarURL(),
              })
              .setColor(colors.info)
              .setDescription(
                "Please write a brief introduction about yourself."
              )
              .setFooter({
                text: "© Pyreworks",
                iconURL: interaction.client.user?.displayAvatarURL(),
              });
            const portfolioEmbed = new MessageEmbed()
              .setTitle("QUESTION!")
              .setAuthor({
                name: `${user.username}#${user.discriminator}`,
                iconURL: user.displayAvatarURL(),
              })
              .setDescription("Do you have a portfolio?")
              .setColor(colors.info)
              .setFooter({
                text: "© Pyreworks",
                iconURL: interaction.client.user?.displayAvatarURL(),
              });
            const noPortfolioEmbed = new MessageEmbed()
              .setTitle("WARN!")
              .setAuthor({
                name: `${user.username}#${user.discriminator}`,
                iconURL: user.displayAvatarURL(),
              })
              .setDescription(
                "Sorry, but you need a portfolio to apply.\nThis ticket will be deleted soon."
              )
              .setColor(colors.warn)
              .setFooter({
                text: "© Pyreworks",
                iconURL: interaction.client.user?.displayAvatarURL(),
              });
            const portfolioAttachEmbed = new MessageEmbed()
              .setTitle("QUESTION!")
              .setAuthor({
                name: `${user.username}#${user.discriminator}`,
                iconURL: user.displayAvatarURL(),
              })
              .setColor(colors.info)
              .setDescription("Please attach your portfolio link below.")
              .setFooter({
                text: "© Pyreworks",
                iconURL: interaction.client.user?.displayAvatarURL(),
              });
            const timeEmbed = new MessageEmbed()
              .setTitle("QUESTION!")
              .setAuthor({
                name: `${user.username}#${user.discriminator}`,
                iconURL: user.displayAvatarURL(),
              })
              .setColor(colors.info)
              .setDescription("How much time are you willing to allocate?")
              .setFooter({
                text: "© Pyreworks",
                iconURL: interaction.client.user?.displayAvatarURL(),
              });
            const underTimeEmbed = new MessageEmbed()
              .setTitle("QUESTION!")
              .setAuthor({
                name: `${user.username}#${user.discriminator}`,
                iconURL: user.displayAvatarURL(),
              })
              .setColor(colors.warn)
              .setDescription(
                "Sorry, we require at least 4 hours of free time.\nThis ticket will be soon deleted."
              )
              .setFooter({
                text: "© Pyreworks",
                iconURL: interaction.client.user?.displayAvatarURL(),
              });
            const whyEmbed = new MessageEmbed()
              .setTitle("QUESTION!")
              .setAuthor({
                name: `${user.username}#${user.discriminator}`,
                iconURL: user.displayAvatarURL(),
              })
              .setColor(colors.info)
              .setDescription("Why should we hire you?")
              .setFooter({
                text: "© Pyreworks",
                iconURL: interaction.client.user?.displayAvatarURL(),
              });
            const phEmbed = new MessageEmbed()
              .setTitle("QUESTION!")
              .setAuthor({
                name: `${user.username}#${user.discriminator}`,
                iconURL: user.displayAvatarURL(),
              })
              .setColor(colors.info)
              .setDescription("What do you think of Pyreworks?")
              .setFooter({
                text: "© Pyreworks",
                iconURL: interaction.client.user?.displayAvatarURL(),
              });
            const pastEmbed = new MessageEmbed()
              .setTitle("QUESTION!")
              .setAuthor({
                name: `${user.username}#${user.discriminator}`,
                iconURL: user.displayAvatarURL(),
              })
              .setColor(colors.info)
              .setDescription("What are your notable past experience?")
              .setFooter({
                text: "© Pyreworks",
                iconURL: interaction.client.user?.displayAvatarURL(),
              });
            const furtherEmbed = new MessageEmbed()
              .setTitle("QUESTION!")
              .setAuthor({
                name: `${user.username}#${user.discriminator}`,
                iconURL: user.displayAvatarURL(),
              })
              .setColor(colors.info)
              .setDescription("Did you miss anything?")
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
              .setColor(colors.success)
              .setDescription(
                "You've successfully finished setting up your Application.\nYour ticket has been sent to our staff and we will look into it as soon as possible."
              )
              .setFooter({
                text: "© Pyreworks",
                iconURL: interaction.client.user?.displayAvatarURL(),
              });
            const appEmbed = new MessageEmbed()
              .setTitle("NEW TICKET!")
              .setAuthor({
                name: `${user.username}#${user.discriminator}`,
                iconURL: user.displayAvatarURL(),
              })
              .setColor(colors.info)
              .setDescription(`<@${user.id}> created an application.`)
              .setFooter({
                text: `© Pyreworks | ${ticketChannel.id}`,
                iconURL: interaction.client.user?.displayAvatarURL(),
              });
            const timelimitSelectMenu = new MessageActionRow().addComponents(
              new MessageSelectMenu()
                .setCustomId("timelimit")
                .setPlaceholder("Select your timelimit.")
                .addOptions([
                  {
                    label: "Under 4 hours",
                    value: "under-4",
                  },
                  {
                    label: "Over 4 hours",
                    value: "plus-4",
                  },
                  {
                    label: "Over 6 hours",
                    value: "plus-6",
                  },
                  {
                    label: "Over 8 hours",
                    value: "plus-8",
                  },
                ])
            );
            const portfolioBooleanButtons =
              new MessageActionRow().addComponents(
                new MessageButton()
                  .setCustomId("yes")
                  .setLabel("Yes")
                  .setStyle("SUCCESS"),
                new MessageButton()
                  .setCustomId("no")
                  .setLabel("No")
                  .setStyle("DANGER")
              );
            const claimButtons = new MessageActionRow().addComponents(
              new MessageButton()
                .setCustomId("application-ticket-claim")
                .setLabel("Claim")
                .setStyle("SUCCESS")
                .setEmoji("967707003705237524"),
              new MessageButton()
                .setCustomId("application-ticket-notifym")
                .setLabel("Notify Management")
                .setStyle("DANGER")
                .setEmoji("968144163986104341")
            );

            const collectorFilter = (i: SelectMenuInteraction) => {
              i.deferUpdate();
              return i.user.id === user.id && i.customId === "age";
            };

            m.channel
              .awaitMessageComponent({
                componentType: "SELECT_MENU",
                filter: collectorFilter,
                time: 30000,
              })
              .then(async (i) => {
                if (i.values[0] === "under-age-limit") {
                  await m.edit({
                    embeds: [underAgeLimitEmbed],
                    components: [],
                  });
                  console.log(`user ${user.id} is underage!`);
                  await delay(10000);
                  await ticketChannel.delete();
                  return;
                }
                age = i.values[0];
                await ticketMessage
                  .edit({
                    embeds: [introductionEmbed],
                    components: [],
                  })
                  .then(async () => {
                    const introductionFilter = (message: Message) => {
                      return message.author.id === user.id;
                    };
                    await ticketMessage.channel
                      .awaitMessages({
                        filter: introductionFilter,
                        max: 1,
                        time: 600000,
                        errors: ["time"],
                      })
                      .then(async (intro) => {
                        introduction = intro.first();
                        await intro.first()?.delete();
                        await ticketMessage
                          .edit({
                            embeds: [portfolioEmbed],
                            components: [portfolioBooleanButtons],
                          })
                          .then(async () => {
                            const collectorFilter = (i: ButtonInteraction) => {
                              i.deferUpdate();
                              return (
                                (i.user.id === user.id &&
                                  i.customId === "yes") ||
                                (i.user.id === user.id && i.customId === "no")
                              );
                            };
                            await ticketMessage.channel
                              .awaitMessageComponent({
                                componentType: "BUTTON",
                                filter: collectorFilter,
                                time: 30000,
                              })
                              .then(async (i) => {
                                if (i.customId === "no") {
                                  await ticketMessage.edit({
                                    embeds: [noPortfolioEmbed],
                                    components: [],
                                  });
                                  await delay(10000);
                                  await ticketChannel.delete();
                                  return;
                                }
                                await ticketMessage
                                  .edit({
                                    embeds: [portfolioAttachEmbed],
                                    components: [],
                                  })
                                  .then(async () => {
                                    const portfolioFilter = (
                                      message: Message
                                    ) => {
                                      return message.author.id === user.id;
                                    };
                                    await ticketMessage.channel
                                      .awaitMessages({
                                        filter: portfolioFilter,
                                        max: 1,
                                        time: 600000,
                                        errors: ["time"],
                                      })
                                      .then(async (pt) => {
                                        portfolio = pt.first();
                                        await pt.first()?.delete();
                                        await ticketMessage
                                          .edit({
                                            embeds: [timeEmbed],
                                            components: [timelimitSelectMenu],
                                          })
                                          .then(async () => {
                                            const collectorFilter = (
                                              i: SelectMenuInteraction
                                            ) => {
                                              i.deferUpdate();
                                              return (
                                                i.user.id === user.id &&
                                                i.customId === "timelimit"
                                              );
                                            };
                                            await ticketMessage.channel
                                              .awaitMessageComponent({
                                                componentType: "SELECT_MENU",
                                                filter: collectorFilter,
                                                time: 30000,
                                              })
                                              .then(async (i) => {
                                                if (i.values[0] === "under-4") {
                                                  await ticketMessage.edit({
                                                    embeds: [underTimeEmbed],
                                                    components: [],
                                                  });
                                                  await delay(10000);
                                                  await ticketChannel.delete();
                                                  return;
                                                }

                                                timelimit = i.values[0];

                                                await ticketMessage
                                                  .edit({
                                                    embeds: [whyEmbed],
                                                    components: [],
                                                  })
                                                  .then(async () => {
                                                    const whyFilter = (
                                                      message: Message
                                                    ) => {
                                                      return (
                                                        message.author.id ===
                                                        user.id
                                                      );
                                                    };
                                                    await ticketMessage.channel
                                                      .awaitMessages({
                                                        filter: whyFilter,
                                                        max: 1,
                                                        time: 600000,
                                                        errors: ["time"],
                                                      })
                                                      .then(async (i) => {
                                                        why = i.first();
                                                        await i
                                                          .first()
                                                          ?.delete();
                                                        await ticketMessage
                                                          .edit({
                                                            embeds: [phEmbed],
                                                          })
                                                          .then(async () => {
                                                            const phFilter = (
                                                              message: Message
                                                            ) => {
                                                              return (
                                                                message.author
                                                                  .id ===
                                                                user.id
                                                              );
                                                            };
                                                            await ticketMessage.channel
                                                              .awaitMessages({
                                                                filter:
                                                                  phFilter,
                                                                max: 1,
                                                                time: 600000,
                                                                errors: [
                                                                  "time",
                                                                ],
                                                              })
                                                              .then(
                                                                async (i) => {
                                                                  ph =
                                                                    i.first();
                                                                  await i
                                                                    .first()
                                                                    ?.delete();
                                                                  await ticketMessage
                                                                    .edit({
                                                                      embeds: [
                                                                        pastEmbed,
                                                                      ],
                                                                    })
                                                                    .then(
                                                                      async () => {
                                                                        const pastFilter =
                                                                          (
                                                                            message: Message
                                                                          ) => {
                                                                            return (
                                                                              message
                                                                                .author
                                                                                .id ===
                                                                              user.id
                                                                            );
                                                                          };
                                                                        await ticketMessage.channel
                                                                          .awaitMessages(
                                                                            {
                                                                              filter:
                                                                                pastFilter,
                                                                              max: 1,
                                                                              time: 600000,
                                                                              errors:
                                                                                [
                                                                                  "time",
                                                                                ],
                                                                            }
                                                                          )
                                                                          .then(
                                                                            async (
                                                                              i
                                                                            ) => {
                                                                              past =
                                                                                i.first();
                                                                              await i
                                                                                .first()
                                                                                ?.delete();
                                                                              await ticketMessage
                                                                                .edit(
                                                                                  {
                                                                                    embeds:
                                                                                      [
                                                                                        furtherEmbed,
                                                                                      ],
                                                                                  }
                                                                                )
                                                                                .then(
                                                                                  async () => {
                                                                                    const furtherFilter =
                                                                                      (
                                                                                        message: Message
                                                                                      ) => {
                                                                                        return (
                                                                                          message
                                                                                            .author
                                                                                            .id ===
                                                                                          user.id
                                                                                        );
                                                                                      };
                                                                                    await ticketMessage.channel
                                                                                      .awaitMessages(
                                                                                        {
                                                                                          filter:
                                                                                            furtherFilter,
                                                                                          max: 1,
                                                                                          time: 600000,
                                                                                          errors:
                                                                                            [
                                                                                              "time",
                                                                                            ],
                                                                                        }
                                                                                      )
                                                                                      .then(
                                                                                        async (
                                                                                          i
                                                                                        ) => {
                                                                                          further =
                                                                                            i.first();
                                                                                          await i
                                                                                            .first()
                                                                                            ?.delete();
                                                                                          if (
                                                                                            !age ||
                                                                                            !introduction ||
                                                                                            !portfolio ||
                                                                                            !timelimit ||
                                                                                            !why ||
                                                                                            !ph ||
                                                                                            !past ||
                                                                                            !further
                                                                                          ) {
                                                                                            return;
                                                                                          }
                                                                                          await ticketMessage
                                                                                            .edit(
                                                                                              {
                                                                                                embeds:
                                                                                                  [
                                                                                                    finishedEmbed.addFields(
                                                                                                      {
                                                                                                        name: "Age",
                                                                                                        value:
                                                                                                          age.toString(),
                                                                                                      },
                                                                                                      {
                                                                                                        name: "Introduction",
                                                                                                        value:
                                                                                                          introduction.toString(),
                                                                                                      },
                                                                                                      {
                                                                                                        name: "Portfolio",
                                                                                                        value:
                                                                                                          portfolio.toString(),
                                                                                                      },
                                                                                                      {
                                                                                                        name: "Timelimits",
                                                                                                        value:
                                                                                                          timelimit.toString(),
                                                                                                      },
                                                                                                      {
                                                                                                        name: "Why should we hire you",
                                                                                                        value:
                                                                                                          why.toString(),
                                                                                                      },
                                                                                                      {
                                                                                                        name: "What do you think of pyreworks",
                                                                                                        value:
                                                                                                          ph.toString(),
                                                                                                      },
                                                                                                      {
                                                                                                        name: "Past experience",
                                                                                                        value:
                                                                                                          past.toString(),
                                                                                                      },
                                                                                                      {
                                                                                                        name: "Further clarifications",
                                                                                                        value:
                                                                                                          further.toString(),
                                                                                                      }
                                                                                                    ),
                                                                                                  ],
                                                                                              }
                                                                                            )
                                                                                            .then(
                                                                                              async () => {
                                                                                                if (
                                                                                                  !age ||
                                                                                                  !introduction ||
                                                                                                  !portfolio ||
                                                                                                  !timelimit ||
                                                                                                  !why ||
                                                                                                  !ph ||
                                                                                                  !past ||
                                                                                                  !further
                                                                                                ) {
                                                                                                  return;
                                                                                                }
                                                                                                try {
                                                                                                  await applicationChannel.send(
                                                                                                    {
                                                                                                      embeds:
                                                                                                        [
                                                                                                          appEmbed.addFields(
                                                                                                            {
                                                                                                              name: "Age",
                                                                                                              value:
                                                                                                                age.toString(),
                                                                                                            },
                                                                                                            {
                                                                                                              name: "Introduction",
                                                                                                              value:
                                                                                                                introduction.toString(),
                                                                                                            },
                                                                                                            {
                                                                                                              name: "Portfolio",
                                                                                                              value:
                                                                                                                portfolio.toString(),
                                                                                                            },
                                                                                                            {
                                                                                                              name: "Timelimits",
                                                                                                              value:
                                                                                                                timelimit.toString(),
                                                                                                            },
                                                                                                            {
                                                                                                              name: "Why should we hire you",
                                                                                                              value:
                                                                                                                why.toString(),
                                                                                                            },
                                                                                                            {
                                                                                                              name: "What do you think of pyreworks",
                                                                                                              value:
                                                                                                                ph.toString(),
                                                                                                            },
                                                                                                            {
                                                                                                              name: "Past experience",
                                                                                                              value:
                                                                                                                past.toString(),
                                                                                                            },
                                                                                                            {
                                                                                                              name: "Further clarifications",
                                                                                                              value:
                                                                                                                further.toString(),
                                                                                                            }
                                                                                                          ),
                                                                                                        ],
                                                                                                      components:
                                                                                                        [
                                                                                                          claimButtons,
                                                                                                        ],
                                                                                                    }
                                                                                                  );
                                                                                                } catch {
                                                                                                  await ticketMessage.edit(
                                                                                                    "MORE THAN THE TYPE LIMIT + FIX WILL BE IMPLEMENTED LATER"
                                                                                                  );
                                                                                                }
                                                                                              }
                                                                                            )
                                                                                            .catch(
                                                                                              async () => {
                                                                                                await ticketMessage.edit(
                                                                                                  "MORE THAN THE TYPE LIMIT + FIX WILL BE IMPLEMENTED LATER"
                                                                                                );
                                                                                              }
                                                                                            );
                                                                                        }
                                                                                      )
                                                                                      .catch(
                                                                                        async () => {
                                                                                          await ticketMessage.edit(
                                                                                            {
                                                                                              embeds:
                                                                                                [
                                                                                                  noSelectEmbed.setDescription(
                                                                                                    "You didn't write anything.\nTicket creation has been canceled and this channel will be deleted in 1 minute"
                                                                                                  ),
                                                                                                ],
                                                                                            }
                                                                                          );
                                                                                          await delay(
                                                                                            300000
                                                                                          );
                                                                                          await ticketMessage.edit(
                                                                                            {
                                                                                              embeds:
                                                                                                [
                                                                                                  noSelectEmbed.setDescription(
                                                                                                    "You didn't write anything.\nTicket creation has been canceled and this channel will be deleted in 30 seconds"
                                                                                                  ),
                                                                                                ],
                                                                                            }
                                                                                          );
                                                                                          await delay(
                                                                                            300000
                                                                                          );
                                                                                          await ticketChannel.delete();
                                                                                        }
                                                                                      );
                                                                                  }
                                                                                );
                                                                            }
                                                                          )
                                                                          .catch(
                                                                            async () => {
                                                                              await ticketMessage.edit(
                                                                                {
                                                                                  embeds:
                                                                                    [
                                                                                      noSelectEmbed.setDescription(
                                                                                        "You didn't write anything.\nTicket creation has been canceled and this channel will be deleted in 1 minute"
                                                                                      ),
                                                                                    ],
                                                                                }
                                                                              );
                                                                              await delay(
                                                                                300000
                                                                              );
                                                                              await ticketMessage.edit(
                                                                                {
                                                                                  embeds:
                                                                                    [
                                                                                      noSelectEmbed.setDescription(
                                                                                        "You didn't write anything.\nTicket creation has been canceled and this channel will be deleted in 30 seconds"
                                                                                      ),
                                                                                    ],
                                                                                }
                                                                              );
                                                                              await delay(
                                                                                300000
                                                                              );
                                                                              await ticketChannel.delete();
                                                                            }
                                                                          );
                                                                      }
                                                                    );
                                                                }
                                                              )
                                                              .catch(
                                                                async () => {
                                                                  await ticketMessage.edit(
                                                                    {
                                                                      embeds: [
                                                                        noSelectEmbed.setDescription(
                                                                          "You didn't write anything.\nTicket creation has been canceled and this channel will be deleted in 1 minute"
                                                                        ),
                                                                      ],
                                                                    }
                                                                  );
                                                                  await delay(
                                                                    300000
                                                                  );
                                                                  await ticketMessage.edit(
                                                                    {
                                                                      embeds: [
                                                                        noSelectEmbed.setDescription(
                                                                          "You didn't write anything.\nTicket creation has been canceled and this channel will be deleted in 30 seconds"
                                                                        ),
                                                                      ],
                                                                    }
                                                                  );
                                                                  await delay(
                                                                    300000
                                                                  );
                                                                  await ticketChannel.delete();
                                                                }
                                                              );
                                                          });
                                                      })
                                                      .catch(async () => {
                                                        await ticketMessage.edit(
                                                          {
                                                            embeds: [
                                                              noSelectEmbed.setDescription(
                                                                "You didn't write anything.\nTicket creation has been canceled and this channel will be deleted in 1 minute"
                                                              ),
                                                            ],
                                                          }
                                                        );
                                                        await delay(300000);
                                                        await ticketMessage.edit(
                                                          {
                                                            embeds: [
                                                              noSelectEmbed.setDescription(
                                                                "You didn't write anything.\nTicket creation has been canceled and this channel will be deleted in 30 seconds"
                                                              ),
                                                            ],
                                                          }
                                                        );
                                                        await delay(300000);
                                                        await ticketChannel.delete();
                                                      });
                                                  });
                                              })
                                              .catch(async () => {
                                                await ticketMessage.edit({
                                                  embeds: [
                                                    noSelectEmbed.setDescription(
                                                      "You didn't write anything.\nTicket creation has been canceled and this channel will be deleted in 1 minute"
                                                    ),
                                                  ],
                                                });
                                                await delay(300000);
                                                await ticketMessage.edit({
                                                  embeds: [
                                                    noSelectEmbed.setDescription(
                                                      "You didn't write anything.\nTicket creation has been canceled and this channel will be deleted in 30 seconds"
                                                    ),
                                                  ],
                                                });
                                                await delay(300000);
                                                await ticketChannel.delete();
                                              });
                                          });
                                      })
                                      .catch(async () => {
                                        await ticketMessage.edit({
                                          embeds: [
                                            noSelectEmbed.setDescription(
                                              "You didn't write anything.\nTicket creation has been canceled and this channel will be deleted in 1 minute"
                                            ),
                                          ],
                                        });
                                        await delay(300000);
                                        await ticketMessage.edit({
                                          embeds: [
                                            noSelectEmbed.setDescription(
                                              "You didn't write anything.\nTicket creation has been canceled and this channel will be deleted in 30 seconds"
                                            ),
                                          ],
                                        });
                                        await delay(300000);
                                        await ticketChannel.delete();
                                      });
                                  });
                              })
                              .catch(async () => {
                                await ticketMessage.edit({
                                  embeds: [
                                    noSelectEmbed.setDescription(
                                      "You didn't write anything.\nTicket creation has been canceled and this channel will be deleted in 1 minute"
                                    ),
                                  ],
                                });
                                await delay(300000);
                                await ticketMessage.edit({
                                  embeds: [
                                    noSelectEmbed.setDescription(
                                      "You didn't write anything.\nTicket creation has been canceled and this channel will be deleted in 30 seconds"
                                    ),
                                  ],
                                });
                                await delay(300000);
                                await ticketChannel.delete();
                              });
                          });
                      })
                      .catch(async () => {
                        await ticketMessage.edit({
                          embeds: [
                            noSelectEmbed.setDescription(
                              "You didn't write anything.\nTicket creation has been canceled and this channel will be deleted in 1 minute"
                            ),
                          ],
                        });
                        await delay(300000);
                        await ticketMessage.edit({
                          embeds: [
                            noSelectEmbed.setDescription(
                              "You didn't write anything.\nTicket creation has been canceled and this channel will be deleted in 30 seconds"
                            ),
                          ],
                        });
                        await delay(300000);
                        await ticketChannel.delete();
                      });
                  })
                  .catch((err) => errorHandler(err, "editing ticket message"));
              })
              .catch(async () => {
                await ticketMessage.edit({
                  embeds: [noSelectEmbed],
                });
                await delay(300000);
                await ticketMessage.edit({
                  embeds: [
                    noSelectEmbed.setDescription(
                      "You didn't select anything.\nTicket creation was canceled and this channel will be deleted in 30 seconds."
                    ),
                  ],
                });
                await delay(300000);
                await ticketChannel.delete();
              });
          });
      })
      .catch((err) => errorHandler(err, "creating an application channel"));
  } catch (err) {
    errorHandler("applicationTicketsHandle module", err);
  }
};
