---
name: notion-cli
description: "Use the official Notion CLI (`ntn`) to call the Notion API, read/write pages as Markdown, query data sources, manage file uploads, and operate Notion Workers. Use when user mentions Notion CLI, ntn, Notion API from terminal, Notion pages, Notion databases/data sources, Notion files, Notion Workers, worker deploy, worker env vars, or querying/updating Notion content."
category: productivity
install_command: "curl -fsSL https://ntn.dev | bash"
---

# notion-cli

Use the official Notion CLI, invoked as `ntn`. This skill is intentionally a wrapper guide around Notion's own CLI, not a custom REST wrapper.

References:
- https://developers.notion.com/cli/get-started/overview
- https://developers.notion.com/cli/get-started/installation
- https://developers.notion.com/cli/reference/commands

## When To Use This Skill

- Call Notion API endpoints from the terminal
- Inspect supported Notion API paths and endpoint docs
- Read, create, update, or trash Notion pages
- Query Notion data sources and resolve database IDs to data source IDs
- Upload or list files through Notion file uploads
- Create, deploy, inspect, execute, and debug Notion Workers
- Manage Worker environment variables, syncs, OAuth, runs, and webhooks

## Installed CLI

```bash
ntn --version
ntn --help
```

If `ntn` is missing:

```bash
curl -fsSL https://ntn.dev | bash
```

This machine also has an api2cli-compatible alias:

```bash
notion-cli --help
```

The alias delegates to `ntn`; prefer `ntn` in examples because it matches Notion's docs.

## Authentication

Prefer an existing token in `NOTION_API_TOKEN` for API/page/data source/file commands:

```bash
echo "${NOTION_API_TOKEN:+set}"
```

If no token is available, use browser login for interactive workspace auth:

```bash
ntn login
ntn logout
```

Important env vars:

| Variable | Purpose |
| --- | --- |
| `NOTION_API_TOKEN` | API token; overrides keychain auth |
| `NOTION_API_VERSION` | Overrides `Notion-Version` |
| `NOTION_WORKSPACE_ID` | Selects workspace without prompting |
| `NOTION_KEYRING=0` | Uses file auth at `~/.config/notion/auth.json` |
| `NOTION_WORKERS_CONFIG_FILE` | Selects `workers.json` path |
| `NOTION_HOME` | Overrides CLI state/cache root |

## Working Rules

- Run `ntn <command> --help` before using unfamiliar syntax.
- Use `ntn api ls` to discover supported public API endpoints.
- Use `ntn api <path> --docs` and `ntn api <path> --spec` before constructing complex requests.
- Prefer `ntn pages get/create/update` for Markdown page content.
- Use `ntn api` for properties, templates, comments, custom endpoint methods, or endpoints not covered by convenience commands.
- Confirm before destructive operations: `ntn pages trash`, `ntn workers delete`, `ntn workers env unset`, `ntn workers env push`, sync state reset, or `--allow-deleting-content`.
- Never print or commit Notion tokens.

## API Commands

| Command | Description |
| --- | --- |
| `ntn api ls` | List supported public API endpoints; no auth required |
| `ntn api ls --json` | Endpoint index as JSON |
| `ntn api <path> --help` | Help for one endpoint |
| `ntn api <path> --docs` | Official markdown docs for one endpoint |
| `ntn api <path> --spec` | Reduced OpenAPI fragment for one endpoint |
| `ntn api v1/users page_size==100` | GET with query param |
| `ntn api v1/pages -d '{"parent":{"page_id":"abc123"}}'` | POST with JSON body |
| `ntn api v1/pages parent[page_id]=abc123` | POST with inline body field |
| `ntn api v1/pages/abc123 -X PATCH archived:=true` | Method override with typed JSON assignment |

Inline input syntax:

| Syntax | Meaning | Example |
| --- | --- | --- |
| `Header:Value` | Header | `Accept:application/json` |
| `name==value` | Query param | `page_size==100` |
| `path=value` | Body string | `parent[page_id]=abc123` |
| `path:=json` | Typed JSON body | `archived:=true` |

Body source rule: use exactly one of stdin JSON, `-d/--data`, or inline body inputs.

## Pages

| Command | Description |
| --- | --- |
| `ntn pages get <page-id>` | Retrieve page as Markdown with frontmatter |
| `ntn pages get <page-id> --json` | Retrieve page as JSON, useful for truncated/unknown blocks |
| `ntn pages create --content '# Title\n\nBody' --json` | Create page from inline Markdown |
| `ntn pages create --parent page:<id> < page.md` | Create page under page parent from stdin |
| `ntn pages create --parent database:<id> < page.md` | Create page under database parent |
| `ntn pages create --parent data-source:<id> < page.md` | Create page under data source parent |
| `ntn pages update <page-id> --content '# Updated' --json` | Replace page content from inline Markdown |
| `ntn pages update <page-id> < page.md` | Replace page content from file/stdin |
| `ntn pages update <page-id> --allow-deleting-content < page.md` | Allow child page/database deletion during update; confirm first |
| `ntn pages trash <page-id> --yes` | Trash page; confirm first |

Flags: `--content <markdown>`, `--parent page:<id>|database:<id>|data-source:<id>`, `--json`, `--plain`, `--notion-version <version>`.

## Data Sources

| Command | Description |
| --- | --- |
| `ntn datasources resolve <database-id> --json` | Resolve a database ID to contained data source IDs |
| `ntn datasources query <data-source-id> --json` | Query pages in a data source |
| `ntn datasources query <id> --limit 50 --json` | Limit page size |
| `ntn datasources query <id> --start-cursor <cursor> --json` | Continue pagination |
| `ntn datasources query <id> -s "Name asc" -s "Created desc" --json` | Sort results |
| `ntn datasources query <id> --filter '{"property":"Done","checkbox":{"equals":true}}' --json` | Filter with raw Notion JSON |
| `ntn datasources query <id> --filter-file filter.json --json` | Read filter from file |
| `ntn datasources query <id> --filter-file - --json` | Read filter from stdin |

Use `datasources resolve` first when the user gives a database ID. `datasources query` requires a data source ID.

## Files

| Command | Description |
| --- | --- |
| `ntn files create < file.png` | Upload local bytes from stdin |
| `ntn files create --filename photo.png --content-type image/png < /tmp/blob --json` | Upload stdin with explicit metadata |
| `ntn files create --external-url https://example.com/photo.png --json` | Create external URL upload |
| `ntn files get <upload-id> --json` | Retrieve upload details |
| `ntn files list --json` | List file uploads |

Note: `ntn files list` currently returns only the first page.

## Workers

| Command | Description |
| --- | --- |
| `ntn workers new [directory]` | Scaffold Worker project |
| `ntn workers new my-worker --install --git` | Scaffold, install deps, init git |
| `ntn workers deploy --name <name> --json` | Create/deploy new Worker |
| `ntn workers deploy --json` | Update existing Worker from `workers.json` |
| `ntn workers deploy --local-build --json` | Build locally before upload |
| `ntn workers list --json` | List Workers |
| `ntn workers get [worker-id] --json` | Show Worker details |
| `ntn workers create --name <name> --json` | Create Worker without deploying code |
| `ntn workers delete [worker-id] --yes --json` | Delete Worker; confirm first |
| `ntn workers exec <key> -d '{"foo":"bar"}'` | Execute capability with JSON input |
| `ntn workers exec <key> --stream` | Stream capability output |
| `ntn workers exec <key> --local --dotenv .env` | Execute locally with env file |
| `ntn workers capabilities list --json` | List deployed capabilities |
| `ntn workers usage --json` | Show current-period AI credit usage |
| `ntn workers tui` | Open interactive terminal UI |

Common Worker flags: `--worker-id <id>`, `--workers-config-file <path>`, `--json`, `--plain`.

### Worker Env

| Command | Description |
| --- | --- |
| `ntn workers env set KEY=value OTHER=value` | Set one or more remote env vars |
| `ntn workers env list [worker-id] --json` | List env var keys; values hidden |
| `ntn workers env unset <key> --worker-id <id>` | Remove remote env var; confirm first |
| `ntn workers env pull [worker-id] --file .env --yes` | Pull remote env vars to file |
| `ntn workers env pull [worker-id] --no-file` | Print env vars instead of writing |
| `ntn workers env push [worker-id] --file .env --yes` | Push local `.env`; confirm first |

### Worker Syncs

| Command | Description |
| --- | --- |
| `ntn workers sync status [capability-key] --no-watch --json` | Print sync status once |
| `ntn workers sync status --interval 5` | Watch sync status |
| `ntn workers sync trigger <key> --json` | Trigger sync now |
| `ntn workers sync trigger <key> --preview --json` | Preview without writing target |
| `ntn workers sync trigger <key> --context '<json>' --local` | Resume preview locally |
| `ntn workers sync pause <key> --json` | Pause sync |
| `ntn workers sync resume <key> --json` | Resume sync |
| `ntn workers sync state get <key> --json` | Show cursor/stats |
| `ntn workers sync state reset <key> --json` | Reset cursor/stats; confirm first |

### Worker OAuth, Runs, Webhooks

| Command | Description |
| --- | --- |
| `ntn workers oauth show-redirect-url` | Print OAuth redirect URL |
| `ntn workers oauth start <key> --json` | Start provider OAuth flow |
| `ntn workers oauth token <key> --plain` | Print OAuth token for debugging; avoid logging |
| `ntn workers runs list [worker-id] --json` | List recent runs |
| `ntn workers runs logs <run-id> --json` | Fetch logs for a run |
| `ntn workers webhooks list [worker-id] --json` | List webhook URLs |

## Diagnostics And Maintenance

| Command | Description |
| --- | --- |
| `ntn doctor` | Check auth, keychain, network, and config health |
| `ntn update` | Update CLI |
| `ntn update --force` | Reinstall latest version |
| `ntn completions zsh` | Generate shell completions |

## Output Format

`ntn` does not use the api2cli JSON envelope. Commands that support `--json` return Notion CLI's native JSON. Use `--plain` only for simple tab-separated scripting.

## Verification

Minimum checks after install or update:

```bash
ntn --version
ntn --help
ntn api ls --plain
ntn doctor
```
