# notion-cli

api2cli-compatible wrapper and agent skill for the official Notion CLI (`ntn`).

This package does not reimplement the Notion API. It delegates to Notion's official CLI and publishes a skill so agents know how to use `ntn` safely.

## Install

Install the official CLI:

```bash
curl -fsSL https://ntn.dev | bash
```

Install through api2cli:

```bash
npx api2cli install notion-cli
```

Direct GitHub install:

```bash
npx api2cli install Nardjo/notion-cli
```

## Usage

```bash
ntn --version
ntn login
ntn api ls
ntn pages get <page-id> --json
ntn datasources resolve <database-id> --json
ntn datasources query <data-source-id> --json
ntn workers list --json
```

`notion-cli` is an alias that delegates to `ntn`:

```bash
notion-cli --help
```

## Authentication

The CLI uses `NOTION_API_TOKEN` when set. Otherwise use:

```bash
ntn login
```

## Resources

- Official docs: https://developers.notion.com/cli/get-started/overview
- Command reference: https://developers.notion.com/cli/reference/commands
- Skill: `skills/notion-cli/SKILL.md`
