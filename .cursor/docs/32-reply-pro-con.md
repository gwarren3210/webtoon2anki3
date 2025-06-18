# Executive Summary

This report provides a comprehensive, research-driven guide for implementing a Spaced Repetition System (SRS) in the Webtoon2Anki application. It covers algorithm selection, architecture, session management, mobile/offline strategies, analytics, and Anki integration. Each section includes code examples, schema designs, and a balanced analysis of pros and cons to inform decision-making.

---

# 1. SRS Algorithm Selection and Comparison

## SM-2 Algorithm

**Overview:**  
SM-2 is the classic SuperMemo algorithm, widely used in Anki and other SRS tools. It uses a simple model based on interval, repetition count, and an easiness factor (EF) to schedule reviews.

**TypeScript Implementation Example:**
```typescript
type SuperMemoItem = { interval: number; repetition: number; efactor: number; };
type SuperMemoGrade = 0 | 1 | 2 | 3 | 4 | 5;

function supermemo(item: SuperMemoItem, grade: SuperMemoGrade): SuperMemoItem {
  let { interval, repetition, efactor } = item;
  if (grade >= 3) {
    if (repetition === 0) interval = 1;
    else if (repetition === 1) interval = 6;
    else interval = Math.round(interval * efactor);
    repetition += 1;
  } else {
    repetition = 0;
    interval = 1;
  }
  efactor = Math.max(1.3, efactor + (0.1 - (5 - grade) * (0.08 + (5 - grade) * 0.02)));
  return { interval, repetition, efactor };
}
```
**Pros:**
- Simple, fast, and easy to implement in TypeScript[1][2][3].
- Well-understood, with many open-source libraries available[1][2][4][3][5].
- Low computational overhead, ideal for browser/mobile use.

**Cons:**
- Less adaptive to individual differences and item difficulty[6][7][8].
- Can lead to "ease hell" (cards stuck at low intervals after repeated failures)[9].
- Not state-of-the-art for optimizing long-term retention.

## SM-17 and SM-18 Algorithms

**Overview:**  
SM-17 and SM-18 are advanced SuperMemo algorithms that use more sophisticated models, including item difficulty, stability, and retrievability matrices. They fit forgetting curves to real user data and adapt intervals more precisely.

**Key Features:**
- SM-17 uses power regression for forgetting curves and optimizes intervals based on actual recall data[10][11].
- SM-18 further refines item difficulty estimation, using expectation-based metrics for each repetition[12].

**Pros:**
- More efficient scheduling, reducing review workload by up to 2-3x compared to SM-2 for large datasets[6][7][8].
- Better adapts to user performance and item difficulty, improving retention and reducing unnecessary reviews[11][12].
- Handles irregular review patterns and interruptions more gracefully.

**Cons:**
- Significantly more complex to implement; requires more data and computation[11][12].
- No widely adopted open-source TypeScript implementations.
- May be overkill for smaller datasets or less frequent users.

## Anki's Algorithm

**Overview:**  
Anki is based on SM-2 but introduces modifications such as separate new/learning/review queues, ease factor adjustments, and leech detection[9].

**Pros:**
- Proven effectiveness in large user base[9].
- Handles "ease hell" and leeches better than vanilla SM-2.
- Open-source and well-documented.

**Cons:**
- Still inherits some SM-2 limitations (e.g., less adaptive than SM-17/18).
- More complex than pure SM-2, but less so than SM-17/18.

## Custom and Language-Learning SRS

Some language apps use custom SRS algorithms, often inspired by SuperMemo but tailored for vocabulary, context, or multimedia learning. These may include:
- Adaptive intervals based on word frequency or user error rates.
- Contextual review (e.g., showing words in sentences).
- Integration with gamification or progress streaks.

**Pros:**  
- Can be tailored to specific learning goals and user needs.

**Cons:**  
- Requires more design and testing to ensure effectiveness.

## Algorithm Comparison Table

| Algorithm | Complexity | Adaptivity | Open Source | Browser Suitability | Review Load | Retention |
|-----------|------------|------------|-------------|---------------------|-------------|-----------|
| SM-2      | Low        | Low        | Yes         | Excellent           | High        | Good      |
| SM-17     | High       | High       | No          | Moderate            | Low         | Excellent |
| SM-18     | Very High  | Very High  | No          | Moderate            | Lowest      | Excellent |
| Anki      | Medium     | Medium     | Yes         | Excellent           | Medium      | Very Good |

**Recommendation:**  
Start with SM-2 or Anki's variant for rapid development and proven results. Consider SM-17/18 for future upgrades if you need maximum efficiency and have the resources for a more complex implementation[6][7][8].

---

# 2. Implementation Architecture

## Data Models

**Vocabulary Item Schema:**
```typescript
interface VocabItem {
  id: string;
  korean: string;
  english: string;
  context: string;
  metadata: object;
  srs: {
    interval: number;
    repetition: number;
    efactor: number;
    due: Date;
    state: 'new' | 'learning' | 'reviewing' | 'mastered';
    history: Array;
  };
}
```
**IndexedDB Schema:**
- Store vocab items in an object store keyed by `id`.
- Use secondary indexes for `due` (for efficient session scheduling) and `state` (for filtering by learning stage)[13][14].

**Pros:**
- IndexedDB supports large datasets and offline access.
- Secondary indexes enable fast queries for due cards and progress tracking.

**Cons:**
- IndexedDB API is verbose; consider using a wrapper library (e.g., Dexie.js).

## State Management

- Use React Context or Zustand for SRS state (current session, progress, etc.).
- For large sets, avoid storing all items in React state; fetch only session-relevant items from IndexedDB.

**Pros:**
- Context is simple for small/medium apps.
- Zustand or Redux offer better performance for large, complex state.

**Cons:**
- Overuse of global state can hurt performance; always prefer lazy loading from IndexedDB for large vocab sets.

## Performance Optimization

- Paginate or virtualize vocab lists in the UI.
- Batch updates to IndexedDB to avoid blocking the main thread.
- Use Web Workers for heavy computations if needed.

**Pros:**
- Ensures smooth 60fps animations and responsive UI.

**Cons:**
- Adds some architectural complexity.

---

# 3. Study Session Management

## Session Scheduling

- Query IndexedDB for items where `due  X days (e.g., 180) and high EF, or after N consecutive correct reviews.
- Move mastered items to a separate state to reduce review load.

**Pros:**
- Focuses effort on weak items.
- Gives users a sense of accomplishment.

**Cons:**
- Risk of "premature graduation" if criteria are too lax.

## Session Length and Interruption Handling

- Allow users to pause/resume sessions; persist session state in IndexedDB.
- On resume, reload session from last saved state.

**Pros:**
- User-friendly for mobile and busy learners.

**Cons:**
- Requires careful state management to avoid data loss.

---

# 4. Mobile and Offline Considerations

## Service Workers

- Use a service worker to cache app shell and static assets for offline use.
- Store all SRS data in IndexedDB for full offline functionality.

**Pros:**
- Enables true offline study sessions[13].
- Improves load times and reliability.

**Cons:**
- Service worker bugs can be hard to debug.

## Data Synchronization

- For multi-device sync, implement a background sync queue that uploads/downloads changes when online.
- Use conflict resolution strategies (e.g., last-write-wins or merge histories).

**Pros:**
- Seamless experience across devices.

**Cons:**
- Sync conflicts can be complex to resolve.

## Mobile UX

- Use swipe gestures for grading cards (left/right/up/down for fail/hard/good/easy).
- Large touch targets and minimal UI for distraction-free study.

**Pros:**
- Intuitive and fast for mobile users.

**Cons:**
- Requires careful gesture handling to avoid accidental input.

## Performance

- Minimize memory usage by loading only session-relevant data.
- Use lazy loading and background prefetching for upcoming cards.

**Pros:**
- Preserves battery and ensures smooth animations.

**Cons:**
- More complex data flow.

## PWA Features

- Enable "Add to Home Screen" and offline install.
- Use push notifications for daily review reminders.

**Pros:**
- Native-like experience without app store friction.

**Cons:**
- Some PWA features are not supported on all browsers.

---

# 5. Learning Analytics and Progress Tracking

## Key Metrics

- Retention rate (percentage of correct reviews).
- Number of mastered items.
- Daily/weekly study streaks.
- Average interval and EF per item.

**Pros:**
- Helps users track progress and stay motivated.

**Cons:**
- Too many metrics can overwhelm users.

## Progress Visualization

- Use progress bars, streak counters, and pie charts for state distribution.
- Show "words mastered this week" and "next review due" timelines.

**Pros:**
- Visual feedback boosts engagement.

**Cons:**
- Requires extra UI work.

## Analytics Dashboard

- Implement a dashboard with filters (by date, state, difficulty).
- Allow export of progress data for personal analysis.

**Pros:**
- Power users can analyze their learning.

**Cons:**
- Not all users will use advanced analytics.

## A/B Testing

- Randomly assign users to different SRS parameter sets (e.g., initial interval, EF adjustment).
- Track retention and review load to optimize settings.

**Pros:**
- Data-driven improvement of SRS effectiveness.

**Cons:**
- Requires infrastructure for experiment management.

## User Feedback

- In-app feedback forms and quick surveys.
- Option to flag cards as "too easy/hard" for manual adjustment.

**Pros:**
- Direct input for continuous improvement.

**Cons:**
- Needs moderation and analysis.

---

# 6. Anki Integration and .apkg Compliance

## Anki SRS Algorithm

- Anki uses a modified SM-2 with additional features for leeches, ease factor adjustments, and separate learning/review queues[9].

**Pros:**
- Familiar to many users.
- Proven effectiveness.

**Cons:**
- Not as adaptive as SM-17/18.

## AnkiConnect API

- AnkiConnect exposes a REST API for deck, note, and card management[15][16].
- Allows programmatic sync between your app and Anki desktop.

**Pros:**
- Enables real-time integration with Anki.
- Supports advanced workflows (e.g., auto-import/export).

**Cons:**
- Requires Anki desktop to be running with the plugin enabled.

## .apkg Format

- .apkg is a zip archive containing an SQLite database (`collection.anki2`), media files, and a JSON media map[17][18][19].
- Cards, notes, and scheduling info are stored in the database.

**Pros:**
- Enables full deck export/import with media and scheduling.

**Cons:**
- Requires SQLite manipulation in the browser (possible with sql.js, but complex).

## Dual-Mode Approach

- Support both in-app SRS and Anki export.
- Store SRS data in a way that can be mapped to Anki's schema for .apkg export.

**Pros:**
- Users can choose their preferred workflow.

**Cons:**
- Increases development complexity.

## Data Synchronization

- Sync progress by exporting/importing scheduling info in .apkg or via AnkiConnect.

**Pros:**
- Users can move between systems.

**Cons:**
- Risk of data loss or conflicts if not carefully managed.

## User Migration

- Allow users to export/import decks and progress.
- Map internal SRS states to Anki's fields for compatibility.

**Pros:**
- Maximizes user flexibility and data portability.

**Cons:**
- Requires careful schema mapping.

## Tradeoffs Table

| Approach         | Pros                                         | Cons                                      |
|------------------|----------------------------------------------|-------------------------------------------|
| Proprietary SRS  | Full control, custom features                | Less community support, harder migration  |
| Anki Compatible  | Familiar, easy migration, community support  | Limited by Anki's model, more constraints |

---

# Implementation Roadmap

1. **Phase 1:**  
   - Implement SM-2 in TypeScript[1][2][3][5].
   - Design IndexedDB schema and React component architecture.
   - Build basic study session management and progress tracking.

2. **Phase 2:**  
   - Add mobile UX enhancements and offline support.
   - Integrate analytics dashboard and A/B testing.
   - Implement Anki .apkg export and AnkiConnect integration.

3. **Phase 3:**  
   - Explore SM-17/18 or custom SRS upgrades.
   - Add advanced analytics, social features, and customization.

---

# Code Templates and Starter Implementations

- Use open-source SM-2 TypeScript libraries for rapid prototyping[1][2][4][3][5].
- IndexedDB: Use Dexie.js for schema and queries.
- React: Use Context or Zustand for session state.
- AnkiConnect: Use fetch/axios to call the local REST API[15][16].
- .apkg: Use JSZip and sql.js to generate zip and SQLite files in-browser[17][19].

---

# Best Practices and Pitfalls

**Best Practices:**
- Start simple (SM-2, basic UI), then iterate.
- Use open standards and libraries where possible.
- Test performance with large datasets early.
- Prioritize mobile and offline UX from the start.

**Common Pitfalls:**
- Overcomplicating the initial SRS algorithm.
- Storing too much data in React state (use IndexedDB).
- Ignoring sync and migration until late in development.
- Neglecting user feedback and analytics.

---

# References

All information in this report is supported by the cited sources throughout each section.

[1] https://github.com/VienDinhCom/supermemo
[2] https://github.com/kirklin/SuperMemo2/
[3] https://www.npmjs.com/package/@dtjv/sm-2
[4] https://www.npmjs.com/package/@kirklin/supermemo2
[5] https://github.com/dtjv/sm-2
[6] https://masterhowtolearn.wordpress.com/2018/10/30/is-sm-17-in-supermemo-better-than-sm-2-in-anki/
[7] https://supermemopedia.com/wiki/Can_you_use_R-metric_to_compare_Algorithm_SM-2_with_Algorithm_SM-17%3F
[8] https://supermemopedia.com/wiki/Algorithm_SM-17_vs._older_SuperMemos
[9] https://juliensobczak.com/inspect/2022/05/30/anki-srs/
[10] https://super-memory.com/help/new.htm
[11] https://supermemo.guru/wiki/SuperMemo_Algorithm:_30-year-long_labor
[12] https://supermemo.guru/wiki/Item_difficulty_in_Algorithm_SM-18
[13] https://courses.cs.washington.edu/courses/cse444/16sp/sections/section2.pdf
[14] https://pages.di.unipi.it/ghelli/bd2/11.physicaldesign.pdf
[15] https://deepwiki.com/amikey/anki-connect/1-ankiconnect-overview
[16] https://hexdocs.pm/anki_connect/AnkiConnect.Actions.Miscellaneous.html
[17] https://github.com/SergioFacchini/anki-cards-web-browser/blob/master/documentation/Processing%20Anki's%20.apkg%20files.md
[18] https://docs.fileformat.com/web/apkg/
[19] https://www.reddit.com/r/Anki/comments/14nuank/how_to_access_cards_of_a_deck_apkg_file/
[20] https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/72965210/1fe93a55-066b-4ddb-a925-0184a0a5628c/paste.txt
[21] https://www.youtube.com/watch?v=GJZ01QgOldw
[22] https://www.youtube.com/watch?v=Ck_6qQDpz6c
[23] https://supermemopedia.com/wiki/Algorithm_SM-17
[24] https://github.com/open-spaced-repetition/fsrs-vs-sm17
[25] https://docs.ankiweb.net/importing/packaged-decks.html
[26] https://www.npmjs.com/search?q=keywords%3Asupermemo
[27] https://faqs.ankiweb.net/what-spaced-repetition-algorithm
[28] https://help.supermemo.org/wiki/What's_new_in_SuperMemo_18%3F
[29] https://forums.ankiweb.net/t/has-anyone-done-a-live-comparison-of-fsrs-and-sm2-as-implemented-in-anki-it-looks-like-no-so-can-anyone-help-me-set-it-up/34996
[30] https://forums.ankiweb.net/t/creating-an-anki-card-deck-apkg-sqlite/32146
[31] https://groups.google.com/g/anki-android/c/XRG3lmiIVdQ/m/p-B3KEwNamgJ