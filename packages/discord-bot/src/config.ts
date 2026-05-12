import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { config as loadDotenv } from "dotenv";

const packageRoot = join(dirname(fileURLToPath(import.meta.url)), "..");

loadDotenv({ path: ".env" });
loadDotenv({ path: join(packageRoot, ".env") });

export interface DiscordBotConfig {
  token: string;
  clientId?: string;
  guildId?: string;
}

export function loadConfig(env: NodeJS.ProcessEnv = process.env): DiscordBotConfig {
  const token = env.DISCORD_BOT_TOKEN ?? "";
  const clientId = env.DISCORD_CLIENT_ID;
  const guildId = env.DISCORD_GUILD_ID;

  if (!token) {
    throw new Error("DISCORD_BOT_TOKEN is required.");
  }

  return {
    token,
    clientId: clientId && clientId.length > 0 ? clientId : undefined,
    guildId: guildId && guildId.length > 0 ? guildId : undefined
  };
}
