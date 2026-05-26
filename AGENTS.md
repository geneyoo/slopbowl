# SlopBowl

## SlopScore Engine

- TypeScript package lives at `packages/slopscore`.
- Keep scoring deterministic and config-driven before adding model calls.
- Do not hardcode scoring constants in logic; put rules, weights, caps, labels, and thresholds in config.
- Every score must expose evidence so tuning is debuggable.
- SlopScore means estimated LLM-generation likelihood, not general content quality.

```bash
npm install
npm run build
npm test
npm run slopscore -- score --text "example" --pretty
```

## Discord Adapter

- Lives at `packages/discord-bot`.
- `.env` carries `DISCORD_BOT_TOKEN`, `DISCORD_CLIENT_ID`, optional `DISCORD_GUILD_ID`. Never commit `.env`.
- Use `npm run discord` after `npm run build`.
