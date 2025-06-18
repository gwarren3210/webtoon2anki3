# Executive Summary

This report provides a comprehensive guide for implementing Spaced Repetition System (SRS) algorithms in the Webtoon2Anki language learning application, focusing on optimizing vocabulary retention for Korean language learners. It covers algorithm selection, implementation architecture, study session management, mobile and offline considerations, analytics, and Anki integration. The recommendations prioritize the SM-2 algorithm for initial implementation, a React/TypeScript architecture with IndexedDB for storage, and best practices for mobile and offline support[1].

# 1. Algorithm Analysis Report

## SRS Algorithm Comparison

### SM-2 Algorithm
- **Overview:** Developed for SuperMemo, SM-2 is widely used in Anki and other SRS apps. It schedules reviews based on user performance, adjusting intervals and difficulty (E-Factor) for each card[1].
- **Advantages:** Simple, effective, well-documented, and proven for vocabulary learning[1].
- **Disadvantages:** Does not account for complex memory models or item difficulty drift over time[1].
- **TypeScript Example:**
```typescript
interface Card {
  interval: number;
  repetition: number;
  efactor: number;
  dueDate: Date;
}

function updateSM2(card: Card, grade: number): Card {
  if (grade >= 3) {
    if (card.repetition === 0) card.interval = 1;
    else if (card.repetition === 1) card.interval = 6;
    else card.interval = Math.round(card.interval * card.efactor);
    card.repetition += 1;
  } else {
    card.repetition = 0;
    card.interval = 1;
  }
  card.efactor = Math.max(1.3, card.efactor + (0.1 - (5 - grade) * (0.08 + (5 - grade) * 0.02)));
  card.dueDate = new Date(Date.now() + card.interval * 24 * 60 * 60 * 1000);
  return card;
}
```
- **Complexity:** O(1) per card update[1].

### SM-17/SM-18 Algorithms
- **Overview:** Newer SuperMemo algorithms (SM-17, SM-18) use more sophisticated models, including memory stability and retrievability, for personalized scheduling[1].
- **Advantages:** Higher theoretical retention, adapts to user memory patterns[1].
- **Disadvantages:** More complex, less transparent, limited open-source implementations, higher computational cost[1].
- **Suitability:** May be overkill for browser/mobile SRS with 10,000+ items and limited resources[1].

### Anki's Algorithm
- **Overview:** Anki uses a modified SM-2 with additional features (lapses, learning steps, custom intervals)[1].
- **Effectiveness:** Proven in large-scale use, balances simplicity and flexibility[1].
- **Suitability:** Highly compatible with .apkg export and Anki ecosystem[1].

### Custom and Language-Specific Algorithms
- **Overview:** Some apps use Leitner systems, adaptive SRS, or hybrid models[1].
- **Suitability:** May be considered for future optimization or A/B testing[1].

### Recommendation
- **Best Fit:** SM-2 or Anki's variant for initial implementation due to simplicity, effectiveness, and compatibility with Anki export[1].

# 2. Implementation Architecture Guide

## Data Models

### Vocabulary Item Schema
| Field         | Type     | Description                  |
|---------------|----------|------------------------------|
| id            | string   | Unique identifier            |
| korean        | string   | Korean word/phrase           |
| english       | string   | English translation          |
| context       | string   | Example sentence/context     |
| metadata      | object   | Source, tags, etc.           |

### SRS Progress Schema
| Field         | Type     | Description                  |
|---------------|----------|------------------------------|
| cardId        | string   | Reference to vocabulary item |
| interval      | number   | Days until next review       |
| repetition    | number   | Repetition count             |
| efactor       | number   | Easiness factor              |
| dueDate       | Date     | Next review date             |
| status        | string   | New/Learning/Review/Mastered |

## State Management

- **Recommended:** React Context or Zustand for SRS state, with IndexedDB for persistence[1].
- **Pattern:** Load SRS state into memory on app start, update in-memory and persist to IndexedDB on changes[1].

## IndexedDB Schema

- **Stores:** `vocabulary`, `srsProgress`
- **Indexes:** By `dueDate` for efficient review scheduling[1].

## Performance Optimization

- **Batch updates** to IndexedDB to minimize blocking[1].
- **Virtualized lists** for large vocabulary sets[1].
- **Web Workers** for heavy SRS calculations if needed[1].

# 3. Study Session Management Guide

## Session Scheduling

- **Algorithm:** Select cards with `dueDate  Review > New)[1].
- **Session Size:** Configurable (e.g., 10-30 cards per session)[1].

## Difficulty Tracking

- **Mechanism:** Use SM-2 E-Factor and repetition count to adjust difficulty[1].

## Mastery Criteria

- **Definition:** Card is "Mastered" after N consecutive correct reviews (e.g., 5)[1].
- **Progression:** New → Learning → Review → Mastered[1].

## Session Interruption Handling

- **Strategy:** Persist session state in IndexedDB; resume on next app launch[1].

# 4. Mobile and Offline Implementation Guide

## Service Worker Implementation

- **Purpose:** Cache app shell and SRS data for offline use[1].
- **Example:** Use Workbox or custom service worker to cache IndexedDB and assets[1].

## Mobile UX Patterns

- **Touch gestures:** Swipe for grading cards, tap for reveal[1].
- **Responsive design:** Ensure smooth 60fps animations and layouts[1].

## Data Synchronization

- **Strategy:** Use background sync API or manual sync when online[1].

## PWA Features

- **Installability:** Add manifest and service worker for PWA compliance[1].
- **Offline-first:** All SRS features must work without internet[1].

# 5. Analytics and Progress Tracking Guide

## Key Metrics

- **Retention rate, review streaks, cards mastered, session frequency, average grade**[1].

## Progress Visualization

- **Designs:** Progress bars, streak counters, mastery charts[1].

## Analytics Dashboard

- **Pattern:** Use React charts (e.g., recharts, chart.js) for visualization[1].

## A/B Testing

- **Method:** Randomly assign users to different SRS parameters, track retention and engagement[1].

# 6. Anki Integration and Compatibility Guide

## AnkiConnect API

- **Usage:** For direct integration with Anki desktop via local API[1].
- **Limitation:** Only works when Anki is running on the same device[1].

## .apkg Format

- **Specification:** SQLite-based format with media and note tables[1].
- **Implementation:** Use open-source libraries (e.g., anki-apkg-export) to generate .apkg files in browser[1].

## Dual-Mode Architecture

- **Approach:** Maintain in-app SRS and allow export/import to Anki[1].

## Data Synchronization

- **Strategy:** Export/import progress as CSV or .apkg; no real-time sync with Anki[1].

## User Migration

- **Solution:** Allow users to export all data for import into Anki or other SRS apps[1].

# Implementation Roadmap

1. **Phase 1:** SM-2 algorithm, React SRS components, IndexedDB storage, basic study session management[1].
2. **Phase 2:** Mobile UX, offline support, analytics dashboard, .apkg export[1].
3. **Phase 3:** Advanced SRS algorithms, A/B testing, enhanced analytics, AnkiConnect integration[1].

# Code Templates and Starter Implementations

- **SM-2 Algorithm:** See TypeScript example above[1].
- **IndexedDB Wrapper:** Use idb-keyval or Dexie.js for simplified IndexedDB access[1].
- **React SRS Component Skeleton:**
```typescript
function StudySession() {
  const [cards, setCards] = useState([]);
  // Load due cards, handle grading, update progress
  // ...
}
```
- **Service Worker Registration:**
```typescript
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js');
}
```

# Best Practices and Common Pitfalls

- **Best Practices:** Keep SRS logic pure and testable, batch database writes, optimize for mobile, provide clear progress feedback[1].
- **Pitfalls:** Blocking UI with heavy SRS calculations, poor offline handling, lack of user feedback on progress[1].

---

**Note:** For further details, refer to SuperMemo research papers, Anki documentation, and open-source SRS implementations[1].

[1] https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/72965210/1fe93a55-066b-4ddb-a925-0184a0a5628c/paste.txt