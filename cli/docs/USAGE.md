# Webtoon2Anki CLI (w2a) Usage Guide

## Getting Started

To run the CLI, you first need to install its dependencies and link it so the `w2a` command is available in your terminal.

1.  **Navigate to the CLI Directory:**
    ```bash
    cd cli
    ```

2.  **Install Dependencies:**
    ```bash
    npm install
    ```

3.  **Link the CLI for Global Use:**
    ```bash
    npm link
    ```
    This makes the `w2a` command available from any directory.

4.  **Run a Command:**
    You can now run any `w2a` command from anywhere in your terminal.
    ```bash
    # Show help for all commands
    w2a --help

    # List all series
    w2a series list
    ```

## Overview
The `w2a` CLI allows you to manage webtoon series, chapters, vocabulary cards, decks, users, and study sessions from the terminal. All commands support interactive prompts for missing arguments (unless `--no-prompt` is used) and can output results as pretty tables or JSON.

---

## Global Options
- `--json` — Output as JSON
- `--debug` — Show debug info (request/response, stack traces)
- `--no-prompt` — Suppress interactive prompts (for scripting)

---

## Command Summary
| Command Group | Subcommands & Description |
|--------------|--------------------------|
| `series`     | `list`, `create`, `search` |
| `chapter`    | `add`, `list`, `lock`, `unlock` |
| `card`       | `add`, `edit`, `delete`, `list` |
| `study`      | `start`, `progress` |
| `user`       | `create`, `login`, `progress`, `reset` |
| `deck`       | `list`, `create`, `view`, `due`, `feature`, `preview` |
| `dev`        | `seed`, `reset`, `export`, `watch` (all require `--allow-dev`) |
| `config`     | `set`, `get` |
| `login`/`logout` | Authenticate and manage session |

---

## Example Usage
```bash
# Series management
w2a series list
w2a series create "Tower of God" --genre=action --language=korean
w2a series search "God"

# Chapter management
w2a chapter add 1 5 --title="Episode 5" --source-file="./ep5.txt"
w2a chapter list 1
w2a chapter lock 1 5
w2a chapter unlock 1 5

# Card management
w2a card add 10 --word="사랑" --definition="love"
w2a card edit 123 --definition="affection"
w2a card delete 123
w2a card list 10

# Study
w2a study start 5
w2a study progress user123

# User management
w2a user create johndoe --email=john@example.com --password=secret
w2a user login johndoe
w2a user progress user123
w2a user reset user123

# Deck management
w2a deck list --genre=romance
w2a deck create --series="Solo Leveling" --chapter="1.1" --max-length=30 --name="Solo Leveling Ch 1.1"
w2a deck view 42
w2a deck due 42
w2a deck feature 42 --badge=verified
w2a deck preview 42

# Dev utilities (guarded)
w2a dev seed --allow-dev
w2a dev reset --allow-dev
w2a dev export --allow-dev
w2a dev watch --allow-dev

# Config
w2a config set defaultUser johndoe
w2a config get defaultUser

# Auth
w2a login
w2a logout
```

---

## Interactive Prompts
- If required arguments are missing, the CLI will prompt you for them unless `--no-prompt` is used.
- Sensitive fields (like passwords) are not masked by default.

---

## Configuration & Session
- Config and session are stored in `~/.webtoon-cli/`:
  - `config.json` for preferences (e.g., default user)
  - `session.json` for auth/session token
- Use `w2a config:set` and `w2a config:get` to manage config values.

---

## API Endpoints
Each command calls a specific API endpoint. If the endpoint does not exist yet, you will see an error. See the CLI source for the expected endpoint for each command.

---

## Troubleshooting
- Use `--debug` for detailed error output and request/response info.
- Use `--json` for machine-readable output.
- For dev commands, always pass `--allow-dev`.

---

## More Help
- Run `w2a --help` or `w2a <command> --help` for detailed command usage. 