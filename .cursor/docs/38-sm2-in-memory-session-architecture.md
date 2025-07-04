# SM-2 In-Memory Session Architecture

## Overview and Goals

This document describes the architecture for implementing a Spaced Repetition System (SRS) using the SM-2 algorithm with in-memory session management. The design is intended for a CLI-based language learning app, with a focus on simplicity, extensibility, and a clear upgrade path to Redis-backed session storage in the future.

**Goals:**
- Provide a robust, interactive study session experience using SM-2 SRS.
- Keep the CLI thin; all SRS logic and session management live in the backend.
- Enable easy future migration to Redis for resilience and scalability.

---

## High-Level Architecture

**Components:**
- **CLI:** Handles user input/output, relays actions to backend via API.
- **Backend:** Manages study sessions, SRS logic, and queues in memory.
- **Session Manager:** Maintains a map of active sessions (sessionId → session object/generator).

**Diagram:**
```
+--------+        API        +-------------------+
|  CLI   | <--------------> |   Backend Server  |
+--------+                  +-------------------+
                                 |
                                 v
                        In-Memory Session Manager
```

## Session Dataflow Diagram

**SM-2 In-Memory Session Dataflow**

```
cli             backend           db
 |   start   --->|                |
 |              |---fetch deck--->|
 |              |<--deck/cards----|
 |<--sessionId-- |                |
 |   next   ---->|                |
 |              |                 |
 |<--card------- |                |
 | grade  -----> |                |
 |              |---update------->|
 |              |<--ack-----------|  (ack = acknowledgement/confirmation)
 |<--next card-- |                |
 ... (repeat until session ends) ...
 |   quit   ---->|                |
 |              |                 |
 |<--ack-------- |                |
```

**Explanation:**
- The CLI initiates a session by sending a `start` request to the backend.
- The backend fetches the relevant deck/cards from the database and creates an in-memory session, returning a `sessionId` to the CLI.
- For each study step, the CLI requests the next card, receives it, and submits a grade after user input.
- The backend updates the card's SRS state in the database and returns an "ack" (acknowledgement/confirmation) to the CLI, along with the next card (or session end).
- This loop continues until the session ends or the user quits, at which point the backend cleans up the session and acknowledges the quit.

---

## Session Lifecycle & API Contract

**Endpoints:**
- `POST /study/session/start` → returns `sessionId`
- `POST /study/session/next` (with `sessionId`) → returns next card to review
- `POST /study/session/grade` (with `sessionId`, `cardId`, `grade`) → updates state, returns next card or session end
- `POST /study/session/quit` (optional, to clean up session)

**Lifecycle:**
1. CLI starts a session (`/start`), receives a `sessionId`.
2. CLI requests the next card (`/next`).
3. CLI submits a grade for the card (`/grade`).
4. Repeat steps 2–3 until session ends or user quits.
5. CLI can quit session (`/quit`).

---

## In-Memory Session Management

- **Session State:** Each session is an object (or generator/state machine) stored in a backend map: `Map<sessionId, SessionState>`.
- **Session State Shape:**
  - User/session ID
  - Queues: learning, review, mistakes, new
  - Progress stats
  - Current card
  - Any other needed metadata
- **Session Expiry:** Sessions are removed from memory on quit or after a timeout.

---

## SRS/Queue Logic (SM-2)

- **Queues:**
  - **New:** Cards never seen before.
  - **Learning:** Cards in the process of being learned (failed or just introduced, need to be seen again soon).
  - **Review:** Cards due for review (interval > 1 day).
  - **Mistakes:** Cards failed during the session (can grow during session).
- **Session Loop:**
  1. Always check if any learning/mistake card is due (based on steps or time).
  2. If not, show the next card from the review or new queue.
  3. After grading:
     - Update card's SRS state (interval, e-factor, etc.) using SM-2.
     - If failed, re-insert into learning/mistake queue at the right position.
     - If passed, update due date and move to review queue (or remove if mastered).
- **All SRS logic is centralized in the backend.**

---

## CLI Responsibilities (Thin Client)

- Prompt user for input (show word, reveal definition, ask for grade).
- Relay user actions to backend via API.
- Display results and session summary.
- No SRS or queue logic in the CLI.

---

## Future-Proofing for Redis

- **Session state is always serializable** (plain JS objects, no closures).
- **Session manager logic is modular**—easy to swap in Redis for session storage.
- **Session state shape is documented** for easy migration.
- **Session expiry logic** can be mapped to Redis TTL.

---

## Upgrade Path to Redis

1. Replace in-memory map with Redis for session storage.
2. On each API call, load session state from Redis, process, and save back.
3. No major changes to API or session logic needed.
4. Add session recovery, multi-device support, and resilience.

---

## Rationale for Choices

- **In-memory for simplicity:** Fast, easy to implement, perfect for small-scale or prototyping.
- **Backend-centric SRS logic:** Ensures consistency, easier analytics, and future web/mobile support.
- **Thin CLI:** Easier to maintain, less duplication, and more portable.
- **Redis-ready:** Minimal future migration effort for scaling and resilience.

---

## Design Alternatives Considered

Several architectural options were evaluated before selecting the in-memory backend session manager approach. Below is a summary of the alternatives, their trade-offs, and the reasoning behind our choice:

### 1. Stateless/Serverless + Database
- **Description:** Each API call reconstructs session state from a database (e.g., SQL, NoSQL, or Redis), processes the action, and writes the updated state back.
- **Pros:**
  - Infinitely horizontally scalable (no in-memory state).
  - High resilience—no session loss if a server crashes.
  - Easy to deploy as serverless functions or microservices.
- **Cons:**
  - Higher latency due to DB round-trips on every action.
  - More complex state serialization/deserialization.
  - Harder to implement advanced SRS features (e.g., undo, peeking ahead, analytics).
- **Why not chosen:**
  - Overkill for a small-scale or prototype CLI app.
  - Adds complexity and latency without immediate benefit.

### 2. Fully Client-Side SRS Logic
- **Description:** The CLI (or frontend) implements all SRS logic, queues, and state management. Backend only stores raw card data and grades.
- **Pros:**
  - No backend session state required.
  - Simple backend API.
- **Cons:**
  - Duplicates SRS logic across clients (CLI, web, mobile).
  - Harder to ensure consistency and analytics.
  - Difficult to support multi-device or session recovery.
- **Why not chosen:**
  - Centralizing SRS logic in the backend ensures consistency and easier future expansion.

### 3. Backend Generator with Sticky Sessions
- **Description:** Each session is an in-memory generator/state machine on a backend server. Clients must always connect to the same server (sticky sessions).
- **Pros:**
  - Fast, rich session logic.
- **Cons:**
  - Not resilient—sessions are lost if the server crashes.
  - Not horizontally scalable without sticky session infrastructure.
- **Why not chosen:**
  - Acceptable for prototyping, but not robust for even moderate scale or reliability.

### 4. Hybrid/Session Plan
- **Description:** Backend returns a precomputed "plan" (ordered list of cards/steps) at session start. Client follows the plan, submitting grades as it goes.
- **Pros:**
  - Backend still controls SRS logic.
  - Stateless between actions.
- **Cons:**
  - Less flexible for dynamic session changes (e.g., many mistakes).
  - Harder to support advanced SRS features.
- **Why not chosen:**
  - Not as flexible or robust for interactive SRS sessions.

### 5. Streaming/Event-Driven (WebSocket, SSE)
- **Description:** Backend exposes a real-time API for study sessions. Clients receive cards and submit grades over a persistent connection.
- **Pros:**
  - Real-time, supports collaborative or multi-device study.
- **Cons:**
  - More complex infrastructure.
  - Overkill for CLI and single-user sessions.
- **Why not chosen:**
  - Complexity not justified for current requirements.

### 6. In-Memory Backend Session Manager (Chosen)
- **Description:** Each session is managed as an in-memory object or generator on the backend. All SRS logic and queues are centralized. Sessions are ephemeral and lost on server restart.
- **Pros:**
  - Fast, simple, and easy to implement.
  - Centralizes SRS logic for consistency and analytics.
  - Thin, maintainable CLI.
  - Easy to upgrade to Redis for resilience and scalability.
- **Cons:**
  - Not resilient to server restarts (sessions lost).
  - Not horizontally scalable (single server only).
- **Why chosen:**
  - Perfect for prototyping, small-scale, or single-user CLI apps.
  - Lays a clear foundation for future Redis-backed upgrade.

### 7. Redis-Backed Session Manager (Future Upgrade Path)
- **Description:** Session state is stored in Redis, allowing for resilience and horizontal scaling. On each API call, session state is loaded from Redis, processed, and saved back.
- **Pros:**
  - High resilience and scalability.
  - Enables session recovery, multi-device support, and analytics.
  - Minimal changes needed from in-memory approach.
- **Cons:**
  - Slightly more complex (serialization, Redis management).
- **Why as future step:**
  - Not needed for initial prototype, but easy to adopt when scaling is required.

---

## Pseudocode Example: Session Manager

```js
// In-memory session manager
const sessions = new Map();

function startSession(userId, deckId) {
  const sessionId = generateSessionId();
  const session = createSessionObject(userId, deckId); // includes queues, stats, etc.
  sessions.set(sessionId, session);
  return sessionId;
}

function getNextCard(sessionId) {
  const session = sessions.get(sessionId);
  // SRS logic to pick next card from queues
  return session.currentCard;
}

function submitGrade(sessionId, cardId, grade) {
  const session = sessions.get(sessionId);
  // Update SRS state, queues, stats
  // Possibly re-insert card into learning/mistake queue
  // Update session.currentCard
}

function quitSession(sessionId) {
  sessions.delete(sessionId);
}
```

---

## Diagrams

```
+--------+        API        +-------------------+
|  CLI   | <--------------> |   Backend Server  |
+--------+                  +-------------------+
                                 |
                                 v
                        In-Memory Session Manager
```

---

## Next Steps

- Implement backend session manager and API endpoints as described.
- Keep session state serializable and modular for future Redis upgrade.
- Document session state and API contract for maintainability. 