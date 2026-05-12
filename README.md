# SlopBowl

Portable SlopScore engine plus an iOS SwiftUI scaffold.

## SlopScore

The scoring core is a deterministic, config-driven TypeScript package:

```bash
npm install
npm run build
npm test
npm run slopscore -- score --text "Nobody is talking about this. They don't want you to know." --pretty
npm run slopscore -- score --text "Nobody is talking about this." --dry-run --pretty
```

Package:

- `packages/slopscore`: reusable library and CLI
- `scoreText(text)`: text-only scoring
- `scorePost(input)`: normalized post input for future X/Threads adapters
- `analyzeText(text)`: dry-run analysis without final score collapse
- `defaultConfig`: tunable rules, weights, caps, labels, and thresholds

## Setup

```bash
xcodegen generate
xcodebuild -project SlopBowl.xcodeproj -scheme SlopBowl -configuration Debug -destination 'generic/platform=iOS Simulator' build CODE_SIGN_IDENTITY="" CODE_SIGNING_REQUIRED=NO
```

## Structure

- `packages/slopscore`: scoring engine
- `SlopBowl/App`: app entry and root composition
- `SlopBowl/Core`: coordinators, models, services, utilities
- `SlopBowl/Features`: feature modules
- `SlopBowl/UI`: shared components and style tokens
- `SlopBowl/Resources`: plist, assets, entitlements
