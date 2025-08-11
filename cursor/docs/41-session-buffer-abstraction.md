# Session Buffer Abstraction for Spaced Repetition App

## Overview
This document explains how and why to abstract the logic for buffering card state and review logs in a React-based spaced repetition app. It is written for junior developers and covers the reasoning, architecture, and step-by-step implementation.

---

## The Problem

When a user studies cards, each card can be reviewed multiple times in a session. You want to:
- **Persist only the final state** of each card to the backend (to avoid saving intermediate, outdated states).
- **Always persist all review logs** (for analytics and history).
- **Avoid UI lag** by batching network requests and saving in the background.

If you put all this logic in your UI components, the code becomes messy, hard to test, and hard to reuse.

---

## Why Abstract Buffer Logic?

- **Separation of concerns:** UI should only handle rendering and user events, not business logic.
- **Reusability:** Buffer logic can be reused in other components or tests.
- **Testability:** Pure logic is easier to test.
- **Maintainability:** Changes to buffer or persistence logic don't affect UI code.

---

## Architectural Solution

### Where Does Each Piece of Logic Live?

| Layer                | Responsibility                                      |
|----------------------|----------------------------------------------------|
| `fsrsSession.ts`     | Card grading, state transitions, log creation      |
| Buffer Store/Hook    | Buffering, batching, state for cards/logs          |
| Buffer Sync Hook     | Periodic flush, unload/session end handling        |
| API Utils            | POST to backend                                    |
| `.tsx` UI Component  | UI, user events, call buffer logic, render UI      |

### Key Principle
- **Grading logic** (how a card is graded, what log is created) is encapsulated in `FsrsSession.grade`.
- **Buffering and persistence logic** (when/how to save) is handled by a custom hook and store.
- **UI** only calls a single function to "grade and buffer" a card.

---

## API and Usage Pattern

**In your component:**
```tsx
const { gradeAndBuffer, flushAll } = useSessionBuffer(fsrsSession);

function handleGrade(card, rating) {
  gradeAndBuffer(card, rating);
}

// On session end:
<Button onClick={flushAll}>End Session</Button>
```

---

## File Structure and Responsibilities

| File                                 | Purpose                                      |
|--------------------------------------|----------------------------------------------|
| `src/services/fsrsSession.ts`        | Card grading, state transitions, log creation|
| `src/services/useCardBufferStore.ts` | Buffer state for cards/logs                  |
| `src/hooks/useCardBufferSync.ts`     | Periodic, unload, and session-end sync logic |
| `src/services/api.ts`                | API calls for persisting data                |
| `src/hooks/useSessionBuffer.ts`      | Orchestrates grading + buffering             |
| `src/pages/Study.tsx`                | UI, calls `gradeAndBuffer`, renders UI       |

---

## Step-by-Step Implementation Outline

### 1. **Encapsulate Grading in `FsrsSession`**
- `FsrsSession.grade(card, rating)` returns `{ updatedCard, log, isDone }`.
- No buffer or persistence logic here.

### 2. **Create Buffer Store**
- Use Zustand to manage:
  - `activeBuffer: Record<string, Card>` (cards still in session)
  - `completedBuffer: Record<string, Card>` (cards done for this session)
  - `logBuffer: Log[]` (all review logs)
- Expose methods to add/update/move cards and logs.

### 3. **Create Buffer Sync Hook**
- Handles periodic batch POST of completed cards and logs.
- POST all buffers on unload/session end.
- Exposes `flushAll()` for manual session end.

### 4. **Create API Utilities**
- `postCardStates(cards: Card[])`
- `postLogs(logs: Log[])`

### 5. **Create Session Buffer Hook**
- `useSessionBuffer(fsrsSession)` exposes `gradeAndBuffer(card, rating)` and `flushAll()`.
- Handles all logic for grading, buffering, and moving cards/logs.

### 6. **Integrate in UI**
- UI calls `gradeAndBuffer(card, rating)` on grade.
- UI calls `flushAll()` on session end.

---

## Example Code Snippets

### `useSessionBuffer.ts`
```ts
import { useCardBufferStore } from '@/services/useCardBufferStore';
import { useCardBufferSync } from '@/hooks/useCardBufferSync';
import { FsrsSession } from '@/services/fsrsSession';

export function useSessionBuffer(fsrsSession: FsrsSession) {
  const { addOrUpdateActive, moveToCompleted, addLog } = useCardBufferStore();
  const { flushAll } = useCardBufferSync();

  function gradeAndBuffer(card, rating) {
    const { updatedCard, log, isDone } = fsrsSession.grade(card, rating);
    addLog(log);
    if (isDone) {
      moveToCompleted(updatedCard);
    } else {
      addOrUpdateActive(updatedCard);
    }
  }

  return { gradeAndBuffer, flushAll };
}
```

### Usage in `Study.tsx`
```tsx
const { gradeAndBuffer, flushAll } = useSessionBuffer(fsrsSession);

function handleGrade(card, rating) {
  gradeAndBuffer(card, rating);
}

<Button onClick={flushAll}>End Session</Button>
```

---

## Benefits and Rationale
- **Cleaner UI code:** No business logic in components.
- **Centralized logic:** Easy to update, test, and reuse.
- **Flexible:** Change buffer or persistence strategy without touching UI or grading logic.
- **Robust:** Ensures only final card state is persisted, all logs are saved, and no data is lost on session end or tab close.

---

## Gotchas and Best Practices
- **Never put buffer or persistence logic in `fsrsSession.ts`**—keep it pure.
- **Always POST all logs, but only the final state of each card.**
- **Flush all buffers on session end and tab close (use `sendBeacon`).**
- **Test edge cases:** Multiple reviews of the same card, session end, network errors.
- **Document your buffer logic for future maintainers!**

---

## Summary
This abstraction keeps your codebase clean, maintainable, and robust. UI components remain simple, and all business logic is centralized and testable. Follow this pattern for any feature where business logic and persistence should be decoupled from UI rendering. 