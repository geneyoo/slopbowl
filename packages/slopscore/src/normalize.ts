import type { NormalizedText } from "./types.js";

const urlPattern = /https?:\/\/[^\s]+/gi;
const hashtagPattern = /#[\p{L}\p{N}_]+/gu;
const mentionPattern = /@[\p{L}\p{N}_]+/gu;
const tokenPattern = /[\p{L}\p{N}']+/gu;

export function normalizeText(text: string): NormalizedText {
  const original = text.trim();
  const lower = original.toLowerCase();
  const urls = original.match(urlPattern) ?? [];
  const hashtags = original.match(hashtagPattern) ?? [];
  const mentions = original.match(mentionPattern) ?? [];
  const tokens = lower.match(tokenPattern) ?? [];
  const sentences = original
    .split(/[.!?\n]+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);

  const allCapsTokenCount = original
    .split(/\s+/)
    .filter((token) => /^[A-Z]{3,}$/.test(token.replace(/[^A-Z]/g, "")))
    .length;

  return {
    original,
    lower,
    tokens,
    sentences,
    urls,
    hashtags,
    mentions,
    wordCount: tokens.length,
    exclamationCount: (original.match(/!/g) ?? []).length,
    questionCount: (original.match(/\?/g) ?? []).length,
    allCapsTokenCount
  };
}

