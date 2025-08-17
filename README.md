# Webtoon2Anki

A tool that converts webtoon screenshots into Anki flashcards for efficient language learning.

## Overview

Webtoon2Anki helps language learners create Anki flashcards from their favorite webtoons. Simply take screenshots of the webtoon panels you want to learn from, and the tool will generate flashcards that you can import into your preferred Anki application.

## Architecture

- **Frontend:** Web interface for uploading images and managing flashcard creation.
- **Backend:** Modular TypeScript/Encore services for OCR, translation, text grouping, validation, storage, study mode, and deck management.
- **CLI:** Terminal tool (`w2a`) for managing series, chapters, cards, decks, users, and study sessions.

## Directory Structure

- `/frontend` — Web UI
- `/backend` — Encore backend services
- `/cli` — Command-line interface (deprecated)
- `/tests` — Additional test scripts and data
- `/sample-images` — Example images for testing

## Quick Start Guide (deprecated, only useable through existing vocab via frontend, open a PR for ANKI support)

1. **Prepare Your Screenshots**
   - Take screenshots of the webtoon panels you want to learn from
   - Make sure the text in the screenshots is clear and readable
   - Supported formats: PNG, JPG, JPEG, WEBP
   - Combine screenshots into one high-quality image for best single chapter results

2. **Create Flashcards**
   - Open the Webtoon2Anki website
   - Paste your screenshots into the image input box
   - Wait for the processing to complete

3. **Download and Import**
   - Click the download button to get your .apkg file
   - Import the .apkg file into your preferred Anki application

## Features

- Convert webtoon screenshots to Anki flashcards
- Simple and intuitive user interface
- Quick processing of multiple images
- Compatible with major Anki platforms
- CLI for advanced/automated workflows

## Requirements

- A modern web browser (Chrome, Firefox, Safari, or Edge)
- Internet connection
- Screenshots in PNG, JPG, JPEG, or WEBP format
- Node.js (for CLI and backend development)

## CLI Usage

See [`cli/docs/USAGE.md`](cli/docs/USAGE.md) for full CLI documentation and examples.

## Troubleshooting

- **OCR errors:** Ensure your screenshots are clear and text is not distorted. Try increasing image resolution.
- **API errors:** Check your internet connection and API keys (if self-hosting backend).
- **Import issues:** Make sure you are using the latest Anki version and importing `.apkg` files correctly.
- **CLI issues:** Use `w2a --debug` for detailed error output. Ensure Node.js and dependencies are installed.

## License

MIT License. See [LICENSE](LICENSE) for details. 
