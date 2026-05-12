# SlopBowl

## SlopScore Engine

- TypeScript package lives at `packages/slopscore`.
- Keep scoring deterministic and config-driven before adding model calls.
- Do not hardcode scoring constants in logic; put rules, weights, caps, labels, and thresholds in config.
- Every score must expose evidence so tuning is debuggable.

```bash
npm install
npm run build
npm test
npm run slopscore -- score --text "example" --pretty
```

## Project Shape

- SwiftUI only. No Storyboards/XIBs.
- MVVM with coordinator-owned navigation.
- Feature code lives under `SlopBowl/Features/[FeatureName]`.
- Shared domain and infrastructure live under `SlopBowl/Core`.
- Shared UI and design tokens live under `SlopBowl/UI`.

## Build

```bash
xcodegen generate
xcodebuild -project SlopBowl.xcodeproj -scheme SlopBowl -configuration Debug -destination 'generic/platform=iOS Simulator' build CODE_SIGN_IDENTITY="" CODE_SIGNING_REQUIRED=NO
```
