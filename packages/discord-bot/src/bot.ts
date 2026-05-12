import { scoreText } from "@slopbowl/slopscore";
import {
  Client,
  Events,
  GatewayIntentBits,
  Partials,
  REST,
  Routes,
  SlashCommandBuilder,
  type ChatInputCommandInteraction,
  type Message
} from "discord.js";
import type { DiscordBotConfig } from "./config.js";
import { formatScore } from "./format.js";

const slopCommand = new SlashCommandBuilder()
  .setName("slop")
  .setDescription("Score text or a link for slop signals.")
  .addStringOption((option) =>
    option
      .setName("content")
      .setDescription("Text or URL to score")
      .setRequired(true)
      .setMaxLength(1800)
  );

export async function registerCommands(config: DiscordBotConfig): Promise<void> {
  const rest = new REST({ version: "10" }).setToken(config.token);
  const body = [slopCommand.toJSON()];
  const clientId = config.clientId ?? (await fetchBotClientId(config.token));

  if (config.guildId) {
    await rest.put(Routes.applicationGuildCommands(clientId, config.guildId), { body });
    return;
  }

  await rest.put(Routes.applicationCommands(clientId), { body });
}

export function createBot(): Client {
  const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.DirectMessages, GatewayIntentBits.MessageContent],
    partials: [Partials.Channel]
  });

  client.once(Events.ClientReady, (readyClient) => {
    console.log(`SlopBowl Discord bot ready as ${readyClient.user.tag}`);
  });

  client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isChatInputCommand() || interaction.commandName !== "slop") {
      return;
    }

    await handleSlopCommand(interaction);
  });

  client.on(Events.MessageCreate, async (message) => {
    if (message.author.bot) {
      return;
    }

    if (!message.guildId) {
      await handleTextMessage(message, message.content);
      return;
    }

    if (client.user && message.mentions.has(client.user)) {
      await handleTextMessage(message, stripBotMention(message.content, client.user.id));
    }
  });

  return client;
}

async function handleSlopCommand(interaction: ChatInputCommandInteraction): Promise<void> {
  const content = interaction.options.getString("content", true);
  const response = formatScore(scoreText(content));
  await interaction.reply({ content: response });
}

async function handleTextMessage(message: Message, content: string): Promise<void> {
  const text = content.trim();

  if (text.length === 0) {
    await message.reply("Send text or a link and I will score it.");
    return;
  }

  await message.reply(formatScore(scoreText(text)));
}

function stripBotMention(content: string, botId: string): string {
  return content.replaceAll(`<@${botId}>`, "").replaceAll(`<@!${botId}>`, "").trim();
}

async function fetchBotClientId(token: string): Promise<string> {
  const response = await fetch("https://discord.com/api/v10/users/@me", {
    headers: { Authorization: `Bot ${token}` }
  });

  if (!response.ok) {
    throw new Error(`Discord bot token check failed: ${response.status}`);
  }

  const user = (await response.json()) as { id?: string };
  if (!user.id) {
    throw new Error("Discord bot token check returned no bot id.");
  }

  return user.id;
}
