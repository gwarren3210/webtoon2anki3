# 🧩 CLI Implementation Plan for Webtoon2Anki (w2a)

## 1. Project Structure
- Create a new folder `/cli` in the project root.
- Structure:
  - `cli/index.ts` — Main entry point
  - `cli/commands/` — Individual command modules (e.g., `series.ts`, `chapter.ts`)
  - `cli/utils/` — Shared utilities (API client, config, prompts, output)
  - `cli/types/` — Type definitions for CLI data
  - `cli/docs/` — CLI-specific markdown documentation

## 2. Command Framework
- Use `commander` for command/flag parsing and help output.
- Integrate `inquirer` for interactive prompts when required args are missing.
- Support `--json`, `--debug`, and `--no-prompt` flags globally.
- All commands should be modular and discoverable.

## 3. Config & Session Management
- Store config and session in `~/.webtoon-cli/`:
  - `config.json` for preferences
  - `session.json` for auth/session
- Implement utility functions for reading/writing config and session files.
- Add `login` and `logout` commands to manage session state.

## 4. API Client
- Create a reusable HTTP client in `cli/utils/apiClient.ts`:
  - Handles base URL, auth token, error formatting, and debug output.
  - Reads API base URL and credentials from `.env` or config.

## 5. Command Implementation
- Implement the following commands (with interactive prompts and flag support):
  - `login`, `logout`
  - `series:list`, `series:create`, `series:search`
  - `chapter:add`, `chapter:list`, `chapter:lock`, `chapter:unlock`
  - `card:add`, `card:edit`, `card:delete`, `card:list`
  - `study:start`, `study:progress`
  - `user:create`, `user:login`, `user:progress`, `user:reset`
  - `deck:list`, `deck:feature`, `deck:preview`
  - `dev:seed`, `dev:reset`, `dev:export`, `dev:watch` (all require `--allow-dev`)
  - `help`, `version`, `config:set`, `config:get`
- Each command should:
  - Validate required args
  - Prompt for missing args (unless `--no-prompt`)
  - Support `--json` and `--debug` output
  - Use current user context from session

## 6. Missing API Endpoints
- Audit the CLI feature list against the current backend API.
- For each missing endpoint:
  - Scaffold a stub in the backend (with TODO comments and types)
  - Document the required request/response shape
  - Add a reference to the CLI command that will use it

## 7. Documentation
- Create `cli/docs/USAGE.md` for CLI usage and command reference.
- Document config/session file structure and troubleshooting tips.
- Add examples for scripting, automation, and interactive use.

## 8. Local Package Setup
- Add a `package.json` in `/cli` for dependencies and scripts.
- Support local install via `npm link` for easy CLI access as `w2a`.
- Add build and lint scripts as needed.

## 9. Milestones & Deliverables
- [ ] Scaffold CLI folder and entry point
- [ ] Implement config/session management
- [ ] Implement API client
- [ ] Implement `login`/`logout` and `series:list` as templates
- [ ] Audit and scaffold missing backend endpoints
- [ ] Implement remaining commands
- [ ] Write documentation
- [ ] Test local install and usage

---

This plan will be updated as the CLI project progresses. All major steps and design decisions will be documented here for transparency and collaboration. 