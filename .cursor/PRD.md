# Product Requirements Document (PRD): WebtoonCards

*Product Requirements Document for Korean Comic to Flashcard Application with In-App Study Mode*

---

## 1. Document Overview

- **Product Name:** WebtoonCards
- **Date:** June 18, 2025
- **Version:** 2.1
- **Stakeholders:** Engineering, Design, Language Learning Community
- **Document Type:** Product Proposal (High-level) with Feature Proposals (Detailed)

---

## 2. Executive Summary

**WebtoonCards** is a language learning platform that enables users to study Korean vocabulary through pre-made decks generated from webtoon content. Users can search and browse decks by series and study them as-is using an in-app spaced repetition system (SRS) with progress tracking and a stats dashboard. If a desired deck does not exist, users can create a new one by uploading images, which are processed into a public deck. All decks are public by default, and there is no moderation or review process. User authentication is required, and all study progress is saved in the cloud and automatically synced across devices. Anki export is deprecated, and mobile support is not present. The current state already includes all major flows: pre-made deck study, custom deck creation, in-app SRS, progress tracking, and stats dashboard.

---

## 3. Problem Statement

### Primary Problem
Language learners studying Korean through webtoons lack a unified, efficient platform for finding and studying relevant vocabulary decks. Existing workflows require manual deck creation or fragmented tools, leading to inefficiency and reduced engagement.

### User Pain Points
- "I want to quickly find and study vocabulary from my favorite webtoon series."
- "I don't want to manually create decks unless absolutely necessary."
- "I want my study progress to be tracked and available wherever I log in."

---

## 4. Target Users & Use Cases

### Primary User: Korean Language Learner
- **Profile:** Intermediate Korean learner (B1-B2 level)
- **Goal:** Study vocabulary from authentic webtoon content using ready-made decks
- **Current Behavior:** Searches for or creates decks as needed, studies in-app

### Secondary User: Language Teacher
- **Profile:** Korean language instructor
- **Goal:** Create learning materials for students
- **Current Behavior:** Manually processes webtoons for classroom use
- **Pain Points:** Bulk processing inefficiency, no student progress tracking

### Use Cases
1. **Study from Pre-Made Deck:** User searches or browses by series, selects a deck, and studies using the in-app SRS and stats dashboard.
2. **Create New Deck:** If a deck does not exist, user uploads images, which are processed into a new public deck for immediate study.

---

## 5. Solution Overview

WebtoonCards provides a seamless, cloud-based platform for studying Korean vocabulary from webtoons. The primary flow is searching and studying from pre-made decks, with the option to create a new deck if needed. All decks are public, and study progress is tracked per deck and synced to the cloud. The in-app study mode uses a spaced repetition algorithm and provides a stats dashboard for progress tracking. There is no deck moderation, curation, or reporting, and no mobile or Anki export support.

---

## 6. Goals & Success Metrics

- **Reduce Time to Study:** Users can find and start studying a deck in under 30 seconds.
- **Increase Engagement:** Average study session length > 15 minutes.
- **Cloud Sync:** 100% of user progress is saved and available on any device after login.
- **Deck Coverage:** Most popular series have at least one public deck available.

---

## 7. Functional Requirements

### Core Features
- **Pre-Made Decks:** Users can search and browse decks by series and study them as-is.
- **Deck Creation:** Users can create a new public deck by uploading images if a deck does not exist.
- **In-App Study Mode:** SRS-based study interface with per-deck progress tracking.
- **Stats Dashboard:** Users can view their study statistics and progress for each deck.
- **Authentication:** Login required; all progress is saved in the cloud and automatically synced.

### Non-Features
- No Anki export
- No mobile support
- No moderation, curation, or reporting for decks
- No social, gamification, or community features

---

## 8. Technical Requirements

- **Frontend:** React, Vite, TypeScript, Tailwind CSS, shadcn-ui
- **Backend:** Encore (TypeScript), modular service architecture, planned Pipeline Service for unified image-to-deck flow
- **Cloud Storage:** All user progress and deck data stored and synced in the cloud
- **Authentication:** Required for all study and deck creation features

---

## 9. User Experience Requirements

- **Deck Discovery:** Fast, intuitive search and browse by series
- **Study Interface:** Clean, responsive SRS-based flashcard UI with stats dashboard
- **Deck Creation:** Simple image upload and processing for new decks
- **Progress Tracking:** Per-deck stats and history, always available after login

---

## 10. Implementation Notes

- All decks are public by default; there is no moderation or review process.
- No central or community curation of decks; decks are created by users as needed.
- No reporting or improvement suggestion mechanism for decks.
- No mobile or offline support; web only.
- Anki export is deprecated and not supported.

---

## 11. Appendix: Main Project Directory Structure
- `/frontend` — Web UI (React, Vite, TypeScript, Tailwind CSS, shadcn-ui)
- `/backend` — Encore backend services (modular, TypeScript, planned Pipeline Service)
- `/cli` — Command-line interface (Node.js, TypeScript)
- `/tests` — Additional test scripts and data
- `/sample-images` — Example images for testing

---

## 12. Conclusion

The proposed in-app study mode with spaced repetition represents a significant evolution of WebtoonCards from a file generation tool to a comprehensive language learning platform. By eliminating workflow fragmentation and providing intelligent study capabilities, this feature addresses the core user pain points while establishing the foundation for future enhancements.

**Recommended Next Steps:**
1. **Research SRS Algorithms:** Investigate optimal spaced repetition implementation
2. **Design Study Interface:** Create wireframes and user flows
3. **Plan Database Schema:** Design vocabulary and progress storage
4. **Begin Implementation:** Start with basic flashcard interface

This roadmap positions WebtoonCards to become the leading platform for authentic Korean language learning through webtoon content. 