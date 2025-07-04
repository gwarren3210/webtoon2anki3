# SM-2 In-Memory Session Implementation Context

This file provides detailed context for implementing the SM-2 in-memory session architecture for a CLI-based language learning app. It is intended for use in the next development chat to ensure all requirements, design decisions, and technical details are clear.

---

## 1. Architecture Summary
- **Backend-centric SRS:** All spaced repetition logic, card queues, and session management are handled in the backend.
- **In-memory sessions:** Each study session is managed as an in-memory object (generator/state machine) on the backend, keyed by a unique sessionId.
- **Thin CLI:** The CLI only handles user interaction and relays actions to the backend via API calls.
- **Future-proof:** The design is modular and serializable, making it easy to upgrade to Redis-backed session storage for resilience and scalability.

---

## 2. Main Components to Implement
- **Session Manager:**
  - Map of sessionId → SessionState object
  - Handles session creation, retrieval, update, and cleanup
- **Session State Object:**
  - User/session ID
  - Queues: new, learning, review, mistakes
  - Progress stats (cards reviewed, grades, etc.)
  - Current card
  - Any other needed metadata (e.g., timestamps)
- **SRS Logic:**
  - Implements SM-2 algorithm for interval, e-factor, and state transitions
  - Handles queue management (inserting/reordering cards based on grade)
- **API Endpoints:**
  - `POST /study/session/start` → returns sessionId
  - `POST /study/session/next` (with sessionId) → returns next card to review
  - `POST /study/session/grade` (with sessionId, cardId, grade) → updates state, returns next card or session end
  - `POST /study/session/quit` (optional, to clean up session)
- **CLI Integration:**
  - Prompts user for input, displays cards, submits actions to backend
  - No SRS or queue logic in CLI

---

## 3. Data Structures
- **SessionState:**
  - `sessionId: string`
  - `userId: string`
  - `deckId: string`
  - `queues: { new: Card[], learning: Card[], review: Card[], mistakes: Card[] }`
  - `progress: { reviewed: number, grades: number[], ... }`
  - `currentCard: Card | null`
  - `createdAt: Date`
  - `lastActive: Date`
- **Card:**
  - `id: string`
  - `korean: string`
  - `english: string`
  - `importanceScore: number`
  - `studyProgress: StudyProgress`
- **StudyProgress:**
  - `state: StudyState`
  - `interval: number`
  - `eFactor: number`
  - `consecutiveCorrect: number`
  - `consecutiveIncorrect: number`
  - `totalReviews: number`
  - `nextReviewDate: Date`
  - `lastReviewedDate?: Date`
  - `firstSeenDate: Date`

---

## 4. API Contract
- **POST /study/session/start**
  - Request: `{ userId, deckId }`
  - Response: `{ sessionId }`
- **POST /study/session/next**
  - Request: `{ sessionId }`
  - Response: `{ card: Card | null, progress: ProgressStats }`
- **POST /study/session/grade**
  - Request: `{ sessionId, cardId, grade: SRSGrade }`
  - Response: `{ card: Card | null, progress: ProgressStats }`
- **POST /study/session/quit**
  - Request: `{ sessionId }`
  - Response: `{ success: boolean }`

---

## 5. Enums/Types
- **SRSGrade:**
  - 0: BLACKOUT (didn't remember at all)
  - 1: INCORRECT (remembered but got it wrong)
  - 2: HARD (remembered with difficulty)
  - 3: GOOD (remembered with some effort)
  - 4: EASY (remembered easily)
  - 5: PERFECT (remembered instantly)
- **StudyState:**
  - 'new', 'learning', 'reviewing', 'mastered'

---

## 6. Session Dataflow & State Transitions
- CLI starts session → backend fetches deck/cards, initializes queues, returns sessionId
- CLI requests next card → backend picks next card from queues (learning/mistake > review > new)
- CLI submits grade → backend updates SRS state, re-queues card if needed, updates stats, returns next card
- Repeat until session ends or user quits
- On quit, backend cleans up session

---

## 7. Edge Cases & Error Handling
- **Session not found:** Return error if sessionId is invalid or expired
- **No cards left:** Return `{ card: null }` to indicate session is complete
- **Invalid grade:** Validate grade is 0-5 (SRSGrade)
- **Session timeout:** Optionally expire sessions after inactivity
- **Backend crash:** Sessions are lost (acceptable for now; Redis upgrade will address this)

---

## 8. Design Decisions & Future Considerations
- **All SRS logic is backend-only:** Ensures consistency and easier analytics
- **Session state is serializable:** For easy migration to Redis
- **API is modular:** Minimal changes needed for future scaling
- **CLI is thin:** No business logic, only user interaction
- **Upgrade path to Redis:** Swap in Redis for session storage when needed

---

## 9. References
- See `.cursor/docs/38-sm2-in-memory-session-architecture.md` for full design rationale, alternatives considered, and diagrams.

---

## 10. Relevant SRS Utilities & Functions

This section documents the most important SRS utilities and functions available in the codebase. Use these to implement session logic, card scheduling, progress tracking, and session management. Each entry includes a description, when to use it, input/output types, and a reference to the source file.

### A. Core SM-2 Algorithm ([srsAlgorithm.ts](backend/srs/srsAlgorithm.ts))

- **updateEfactor(currentEFactor: number, grade: SRSGrade): number**
  - **Description:** Updates the e-factor for a card based on the grade received (SM-2 formula).
  - **When to use:** After grading a card, to update its e-factor.
  - **Inputs:**
    - `currentEFactor: number` (current e-factor)
    - `grade: SRSGrade` (user's recall grade, 0-5)
  - **Output:**
    - `number` (new e-factor)

- **calculateInterval(currentProgress: StudyProgress, grade: SRSGrade): number**
  - **Description:** Calculates the next review interval for a card based on its current state and grade.
  - **When to use:** After grading, to determine when the card should next be reviewed.
  - **Inputs:**
    - `currentProgress: StudyProgress`
    - `grade: SRSGrade`
  - **Output:**
    - `number` (interval in days)

- **calculateNextReview(interval: number): Date**
  - **Description:** Returns the next review date given an interval in days.
  - **When to use:** When scheduling the next review for a card.
  - **Inputs:**
    - `interval: number` (days)
  - **Output:**
    - `Date` (next review date)

- **processGrade(grade: SRSGrade, currentProgress: StudyProgress, responseTime?: number): StudyProgress**
  - **Description:** Main entry point for SM-2 logic. Updates StudyProgress based on the grade and response time.
  - **When to use:** After grading a card, to update all SRS fields.
  - **Inputs:**
    - `grade: SRSGrade`
    - `currentProgress: StudyProgress`
    - `responseTime?: number`
  - **Output:**
    - `StudyProgress` (updated progress)

- **createInitialProgress(vocabularyId: string, userId: string): StudyProgress**
  - **Description:** Initializes a new StudyProgress object for a card.
  - **When to use:** When adding a new card to a deck/session.
  - **Inputs:**
    - `vocabularyId: string`
    - `userId: string`
  - **Output:**
    - `StudyProgress`

- **isCardDue(progress: StudyProgress): boolean**
  - **Description:** Checks if a card is due for review.
  - **When to use:** To filter/schedule due cards.
  - **Inputs:**
    - `progress: StudyProgress`
  - **Output:**
    - `boolean`

- **daysUntilReview(progress: StudyProgress): number**
  - **Description:** Returns days until the next review (negative if overdue).
  - **When to use:** For scheduling and prioritization.
  - **Inputs:**
    - `progress: StudyProgress`
  - **Output:**
    - `number`

- **SRSError**
  - **Description:** Error class for SRS algorithm issues.

---

### B. Card Scheduling ([cardScheduler.ts](backend/srs/cardScheduler.ts))

- **CardScheduler**
  - **Description:** Class for managing study deck creation, card prioritization, and scheduling.
  - **When to use:** To build and manage the study queue for a session.
  - **Inputs:**
    - `config?: CardSchedulerConfig`
  - **Output:**
    - Instance with methods for scheduling and stats.

- **getDueCards(vocabularyWithProgress[], config?): ScheduledCard[]**
  - **Description:** Returns all due cards for review.
  - **When to use:** To get the list of cards due for the current session.
  - **Inputs:**
    - `vocabularyWithProgress: VocabularyWithProgress[]`
    - `config?: CardSchedulerConfig`
  - **Output:**
    - `ScheduledCard[]`

- **getNewCards(vocabularyWithProgress[], config?): ScheduledCard[]**
  - **Description:** Returns all new cards.
  - **When to use:** To get new cards for introduction.
  - **Inputs/Outputs:** Same as above.

- **getLearningCards(vocabularyWithProgress[], config?): ScheduledCard[]**
  - **Description:** Returns all learning cards.
  - **When to use:** To get cards in the learning phase.
  - **Inputs/Outputs:** Same as above.

- **getReviewCards(vocabularyWithProgress[], config?): ScheduledCard[]**
  - **Description:** Returns all review cards.
  - **When to use:** To get cards in the review phase.
  - **Inputs/Outputs:** Same as above.

- **getStudyDeck(vocabularyWithProgress[], config?): ScheduledCard[]**
  - **Description:** Returns a mixed deck for study, prioritized and shuffled as needed.
  - **When to use:** To build the session's study queue.
  - **Inputs/Outputs:** Same as above.

- **getStudyStats(vocabularyWithProgress[], config?): object**
  - **Description:** Returns study statistics for the current deck/session.
  - **When to use:** For progress display and analytics.
  - **Inputs/Outputs:** Same as above.

- **CardPriority**
  - **Description:** Enum for card priority levels (OVERDUE, DUE_TODAY, LEARNING, NEW, FUTURE).

- **CardSchedulerConfig, DEFAULT_SCHEDULER_CONFIG**
  - **Description:** Configuration and defaults for scheduling.

---

### C. Progress Tracking ([progressTracker.ts](backend/srs/progressTracker.ts))

- **updateProgress(progress: StudyProgress, grade: SRSGrade, responseTime?): StudyProgress**
  - **Description:** Updates study progress based on a new grade (delegates to processGrade in srsAlgorithm).
  - **When to use:** After grading, to update all SRS fields for a card.
  - **Inputs:**
    - `progress: StudyProgress`
    - `grade: SRSGrade`
    - `responseTime?: number`
  - **Output:**
    - `StudyProgress`

- **calculateMastery(progress: StudyProgress): number**
  - **Description:** Calculates mastery level (0-100) for a vocabulary item.
  - **When to use:** For progress display, analytics, or mastery checks.
  - **Inputs:**
    - `progress: StudyProgress`
  - **Output:**
    - `number`

- **getStudyStreak(studyHistory: StudyHistory[]): number**
  - **Description:** Calculates the current study streak in days.
  - **When to use:** For streak tracking and user motivation.
  - **Inputs:**
    - `studyHistory: StudyHistory[]`
  - **Output:**
    - `number`

- **getProgressStats(progressList, studySessions, studyHistory): StudyStats**
  - **Description:** Returns comprehensive study statistics for a user/session.
  - **When to use:** For analytics, dashboards, or session summaries.
  - **Inputs:**
    - `progressList: StudyProgress[]`
    - `studySessions: StudySession[]`
    - `studyHistory: StudyHistory[]`
  - **Output:**
    - `StudyStats`

- **validateProgress(progress: StudyProgress): boolean**
  - **Description:** Validates a StudyProgress object.
  - **When to use:** Before saving or processing progress data.
  - **Inputs:**
    - `progress: StudyProgress`
  - **Output:**
    - `boolean`

- **isCardDue(progress: StudyProgress): boolean**
  - **Description:** Checks if a card is due for review (delegates to srsAlgorithm).
  - **When to use:** For scheduling and filtering.
  - **Inputs:**
    - `progress: StudyProgress`
  - **Output:**
    - `boolean`

- **daysUntilReview(progress: StudyProgress): number**
  - **Description:** Returns days until next review (delegates to srsAlgorithm).
  - **When to use:** For scheduling and prioritization.
  - **Inputs:**
    - `progress: StudyProgress`
  - **Output:**
    - `number`

- **ProgressTrackerError**
  - **Description:** Error class for progress tracking issues.

---

### D. Study Session Management ([studySession.ts](backend/srs/studySession.ts))

- **createStudySession(userId: string, config: StudySessionConfig): StudySession**
  - **Description:** Creates a new study session object.
  - **When to use:** At the start of a study session.
  - **Inputs:**
    - `userId: string`
    - `config: StudySessionConfig`
  - **Output:**
    - `StudySession`

- **endStudySession(session: StudySession): StudySession**
  - **Description:** Ends a study session, setting end time and duration.
  - **When to use:** When the session is finished or user quits.
  - **Inputs:**
    - `session: StudySession`
  - **Output:**
    - `StudySession`

- **pauseStudySession(session: StudySession): StudySession**
  - **Description:** Pauses a study session.
  - **When to use:** If session pausing is supported.
  - **Inputs/Outputs:** Same as above.

- **resumeStudySession(session: StudySession): StudySession**
  - **Description:** Resumes a paused study session.
  - **When to use:** If session pausing is supported.
  - **Inputs/Outputs:** Same as above.

- **updateSessionStats(session: StudySession, isCorrect: boolean): StudySession**
  - **Description:** Updates session stats after each card.
  - **When to use:** After grading a card.
  - **Inputs:**
    - `session: StudySession`
    - `isCorrect: boolean`
  - **Output:**
    - `StudySession`

- **calculateSessionStats(session: StudySession): object**
  - **Description:** Calculates statistics for the session.
  - **When to use:** For session summary or analytics.
  - **Inputs:**
    - `session: StudySession`
  - **Output:**
    - `object` (stats)

- **canContinueSession(session: StudySession, config: StudySessionConfig): boolean**
  - **Description:** Checks if the session can continue (e.g., cards left, time limit).
  - **When to use:** Before serving next card.
  - **Inputs:**
    - `session: StudySession`
    - `config: StudySessionConfig`
  - **Output:**
    - `boolean`

- **getSessionSummary(session: StudySession): object**
  - **Description:** Returns a summary of the session.
  - **When to use:** At the end of a session.
  - **Inputs:**
    - `session: StudySession`
  - **Output:**
    - `object` (summary)

- **StudySessionError**
  - **Description:** Error class for session management issues.

---

### E. Types & Enums ([types.ts](backend/srs/types.ts))

- **SRSGrade, StudyState, StudyProgress, StudySession, StudyHistory, StudyStats, StudySessionConfig, VocabularyWithProgress**
  - **Description:** Core types and enums for SRS logic. Use these for type safety and consistency throughout the implementation.

---

#### References
- [srsAlgorithm.ts](backend/srs/srsAlgorithm.ts)
- [cardScheduler.ts](backend/srs/cardScheduler.ts)
- [progressTracker.ts](backend/srs/progressTracker.ts)
- [studySession.ts](backend/srs/studySession.ts)
- [types.ts](backend/srs/types.ts) 