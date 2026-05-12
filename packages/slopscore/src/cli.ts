#!/usr/bin/env node
import { readFile } from "node:fs/promises";
import { Command } from "commander";
import { analyzeText, scoreText } from "./scorer.js";

const program = new Command();

program
  .name("slopscore")
  .description("Score text content for slop signals.")
  .version("0.1.0");

program
  .command("score")
  .description("Score text from an argument, stdin, or file.")
  .option("-t, --text <text>", "Text to score")
  .option("-f, --file <path>", "File containing text to score")
  .option("--dry-run", "Output normalization, evidence, component scores, and config metadata without final scoring", false)
  .option("--pretty", "Pretty-print JSON", false)
  .action(async (options: { text?: string; file?: string; dryRun?: boolean; pretty?: boolean }) => {
    const text = await resolveText(options);
    const result = options.dryRun ? analyzeText(text) : scoreText(text);
    process.stdout.write(JSON.stringify(result, null, options.pretty ? 2 : 0));
    process.stdout.write("\n");
  });

program.parseAsync(process.argv);

async function resolveText(options: { text?: string; file?: string }): Promise<string> {
  if (options.text) {
    return options.text;
  }

  if (options.file) {
    return readFile(options.file, "utf8");
  }

  if (!process.stdin.isTTY) {
    return readStdin();
  }

  throw new Error("Provide --text, --file, or stdin.");
}

async function readStdin(): Promise<string> {
  const chunks: Buffer[] = [];

  for await (const chunk of process.stdin) {
    chunks.push(Buffer.from(chunk));
  }

  return Buffer.concat(chunks).toString("utf8");
}
