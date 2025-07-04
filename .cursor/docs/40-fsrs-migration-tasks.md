# FSRS Migration Tasks

This document outlines all actionable tasks for migrating the SRS backend from SM-2 to FSRS (using `ts-fsrs`).

---

## 1. Database Schema Migration

- [ ] Remove all SM-2-specific fields from the study progress table/model:
  - [ ] Remove: `eFactor`, `interval`, `consecutiveCorrect`, `consecutiveIncorrect`, `totalReviews`, `state` (if not compatible), etc.
- [ ] Add/replace with FSRS fields:
  - [ ] `id` (primary key)
  - [ ] `userId`
  - [ ] `vocabularyId`
  - [ ] `due` (datetime)
  - [ ] `stability` (float)
  - [ ] `difficulty` (float)
  - [ ] `elapsed_days` (int)
  - [ ] `scheduled_days` (int)
  - [ ] `learning_steps` (int)
  - [ ] `reps` (int)
  - [ ] `lapses` (int)
  - [ ] `state` (enum: New, Learning, Review, Relearning)
  - [ ] `last_review` (datetime, nullable)
  - [ ] (Optional) `createdAt`, `updatedAt`
- [ ] (Optional) Add a `ReviewLog` table for analytics/undo/optimizer:
  - [ ] `id`, `cardId`, `userId`, `rating`, `state`, `due`, `stability`, `difficulty`, `elapsed_days`, `scheduled_days`, `learning_steps`, `review` (datetime)

---

## 2. TypeScript Types Refactor

- [ ] Remove all SM-2 types/interfaces.
- [ ] Replace `StudyProgress` with a type matching the FSRS `Card`.
- [ ] Update all code to use the new FSRS types.

---

## 3. Backend Logic Refactor

- [ ] Remove all SM-2 logic from `srsAlgorithm.ts` and related files.
- [ ] Integrate `ts-fsrs`:
  - [ ] Use `createEmptyCard` for new cards.
  - [ ] Use `fsrs.repeat(card, now)` for scheduling.
  - [ ] Use `fsrs.next(card, now, rating)` for a single review outcome.
- [ ] Map DB rows to/from FSRS `Card` objects.
- [ ] Update all endpoints/services to use the new FSRS logic and types.

---

## 4. Frontend/Client Refactor

- [ ] Update all code that expects SM-2 fields to use FSRS fields.
- [ ] Update UI to use FSRS states and ratings (Again, Hard, Good, Easy).

---

## 5. Data Migration

- [ ] (If keeping old progress) Write a migration script to convert SM-2 progress to FSRS `Card` format (approximate mapping).
- [ ] (If not) Drop the old table/fields and start fresh.

---

## 6. Testing

- [ ] Write new tests for FSRS logic.
- [ ] Test all endpoints and UI flows for regressions.

---

## 7. Documentation

- [ ] Update README and any developer docs to describe the new FSRS-based system.

---

## 8. Deployment

- [ ] Deploy DB schema changes (with backup if needed).
- [ ] Deploy backend and frontend changes together.

---

## 9. (Optional) Advanced: Parameter Optimization

- [ ] Add support for optimizer routines using review logs if desired.

---

**End of migration task list.** 