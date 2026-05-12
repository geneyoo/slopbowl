#!/usr/bin/env node
import { createBot, registerCommands } from "./bot.js";
import { loadConfig } from "./config.js";

async function main(): Promise<void> {
  const config = loadConfig();
  await registerCommands(config);

  const bot = createBot();
  await bot.login(config.token);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
