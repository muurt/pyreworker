import {
  APIActionRowComponent,
  APIMessageActionRowComponent,
} from "discord-api-types/v9";
import {
  MessageActionRow,
  MessageActionRowComponent,
  MessageActionRowComponentResolvable,
  MessageEmbed,
  MessageSelectMenu,
  MessageSelectOptionData,
} from "discord.js";
import { colors } from "../../config/colors";

export const sendModalEmbedEvent = async (interaction) => {
  if (!interaction.member.permissions.has("MANAGE_ROLES")) {
    const noPermissionsEmbed = new MessageEmbed()
      .setTitle("ERROR!")
      .setAuthor({
        name: `${interaction.user.username}#${interaction.user.discriminator}`,
        iconURL: interaction.user.displayAvatarURL(),
      })
      .setColor(colors.error)
      .setDescription("You don't have the required permission(s).")
      .setFooter({
        text: "© Pyreworks",
        iconURL: interaction.client.user?.displayAvatarURL(),
      });
    return interaction.reply({
      embeds: [noPermissionsEmbed],
      ephemeral: true,
    });
  }

  // Get all values from modal
  const channelNameOrId = interaction.fields
    .getTextInputValue("channel")
    .toLowerCase()
    .replace(" ", "-")
    .replace(/#/g, "");
  const title = interaction.fields.getTextInputValue("title");
  let description = interaction.fields.getTextInputValue("description");
  let color = interaction.fields.getTextInputValue("color");

  const roles:
    | { label: string; description: string | undefined; value: string }
    | MessageSelectOptionData[] = [];
  const roleList = interaction.message.embeds[0].fields[0].value;
  let channel: {
    send: (arg0: {
      embeds: MessageEmbed[];
      components: MessageActionRow<
        MessageActionRowComponent,
        MessageActionRowComponentResolvable,
        APIActionRowComponent<APIMessageActionRowComponent>
      >[];
    }) => Promise<unknown>;
    id: unknown;
  };

  if (!description) {
    description = `Select some roles to add them to your profile, and this could include perks or access to channels.`;
  }

  if (!color) {
    color = process.env.COLOR;
  }

  if (channelNameOrId !== "") {
    // Validating the channel provided

    channel = interaction.guild.channels.cache.find(
      (c: { name: never }) => c.name === channelNameOrId
    );

    if (!channel) {
      channel = interaction.guild.channels.cache.find(
        (c: { id: never }) => c.id === channelNameOrId
      );
    }

    if (!channel) {
      // No channal was Found
      return interaction.update({
        content: `Can't find the channel to send the message to.`,
        ephemeral: true,
      });
    }
  } else {
    channel = interaction.channel;
  }

  // Creating the options for the select menu
  for (const role of roleList.split(`\n`)) {
    const roleId = role.split(" - ")[0].replace(/[<@&>]/g, "");
    const roleDescription = role.split(" - ")[1];

    const r = interaction.guild.roles.cache.find(
      (_role: { id: never }) => _role.id === roleId
    );
    if (!r) {
      return;
    }

    if (roleDescription) {
      // Getting rid of the * * on either sides
      let RoleDisc = "";
      for (let i = 1; i < roleDescription.length - 1; i++) {
        RoleDisc += roleDescription[i];
      }

      roles.push({
        label: r.name,
        description: RoleDisc,
        value: r.id,
      });
    } else {
      roles.push({
        label: r.name,
        value: r.id,
        description: undefined,
      });
    }
  }

  // Embed and Select Menu
  const embed = new MessageEmbed()
    .setTitle(title ? title : "Self Assignable Roles")
    .setAuthor({
      name: `Select Roles`,
      iconURL: interaction.client.user?.displayAvatarURL(),
    })
    .setDescription(description)
    .setFooter({
      text: "© Pyreworks",
      iconURL: interaction.client.user?.displayAvatarURL(),
    })
    .setColor(color);

  const menu = new MessageActionRow().addComponents(
    new MessageSelectMenu()
      .setCustomId("select-menu-roles")
      .setMinValues(0)
      .setMaxValues(roles.length)
      .setPlaceholder(`Select`)
      .setOptions(roles)
  );

  let failedToSend = false;
  await channel.send({ embeds: [embed], components: [menu] }).catch(() => {
    failedToSend = true;
  });

  if (failedToSend) {
    return interaction.update({
      content: `Couldn't send the message.`,
      embeds: [],
      components: [],
    });
  } else {
    interaction.update({
      content: `Everything's done!`,
      embeds: [],
      components: [],
    });
  }

  setTimeout(() => {
    if (channel.id === interaction.channel.id) {
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      interaction.deleteReply().catch(() => {});
    }
  }, 10000);
};
