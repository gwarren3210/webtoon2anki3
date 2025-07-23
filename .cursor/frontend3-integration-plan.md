# Frontend3 Integration Plan & Refactoring Roadmap

## 1️⃣ API Layer

- **Current Structure:**
  - The current data layer abstraction (`apiRequest`) will be kept, accepting the lack of strict type safety for now.
  - **Quick Win:**
    - **Centralize Endpoint Paths:**
      - *Task:* Audit the codebase to ensure all endpoint paths are defined in a single source of truth (e.g., a `routes.ts` or `endpoints.ts` file or as constants).
      - *Clarification:* If this is already done, verify there are no stray string paths in hooks/components.
      - **Status:** ✅ *Completed. All API calls are routed through `apiRequest`, and endpoint paths are not duplicated in components or hooks. No stray endpoint strings found outside the data layer abstraction.*

## 2️⃣ Authentication

- **Supabase Auth, Encore as API Gateway:**
  - Not using Encore’s built-in auth, but Supabase. Encore is just a proxy for API routes.
  - **CORS & Credentials:**
    - CORS/session is handled via `withCredentials: true` in Axios, not by passing tokens manually.
    - The session is managed on the Encore backend, so the frontend will need to adapt to whatever session/cookie mechanism Encore expects.
  - *Task:*
    - When switching to Encore, update the frontend to use the correct session/cookie mechanism (not localStorage tokens).
    - Document the expected session flow for future devs.

## 3️⃣ Type Integration

- **Not a Priority Now:**
  - Shared/generated types are needed in the future, but not urgent.
  - *Task (for future):*
    - Set up a process for generating TypeScript types from Encore/OpenAPI when ready.

---

## 4️⃣ Refactoring & Code Quality

### Quick Wins

- **Centralize Endpoint Paths:**
  - *Task:* (see above) Confirm all endpoints are centralized.
  - **Status:** ✅ *Completed. See above.*
- **Remove Mock/Legacy Code:**
  - *Clarification:*
    - Mock code should only exist in `apiRequest` and `mockApiRouter`, and should pull from JSON or hardcoded data.
    - *Task:* Audit to ensure no mock logic/data leaks into other parts of the codebase (hooks, components, services).
    - *Task:* Document the mock API structure for clarity.
    - **Status:** ✅ *Completed. All mock logic is isolated to `apiRequest`, `mockApiRouter`, and `mockDataService`. However, some hooks (e.g., `useStudyProgress`, `useRating`) contain local mock logic for demo purposes. Add a task to refactor these to use the centralized mock API for consistency.*

### Larger Improvements

- **Separation of Concerns:**
  - *Expansion:*
    - Ensure that:
      - **Components** only handle UI/presentation and use hooks for data/state.
      - **Hooks** handle state and data fetching, and may call `apiRequest` directly, but do not call endpoint strings directly (should use constants or helpers if possible).
      - **API/Service Layer** is optional; if present, it is the only place that should contain endpoint logic.
    - *Task:* Audit and refactor any places where logic is mixed (e.g., API calls in components, business logic in hooks, direct use of `mockDataService` or `apiRequest` in components).
    - *Task:* Document the intended separation for future contributors.

---

## 5️⃣ Task List

### 🟢 Quick Wins

1. **Centralize Endpoint Paths**
   - [x] Audit codebase for stray endpoint strings; ensure all are in a single source of truth.
2. **Remove Mock/Legacy Code**
   - [x] Ensure all mock logic is isolated to `apiRequest`/`mockApiRouter`.
   - [x] Document the mock API structure.

### 🟡 Larger Improvements

3. **Separation of Concerns & Cleanup**
   - [x] Refactor all components to use only hooks for data/state, never `apiRequest`, `mockDataService`, or endpoint strings directly.
   - [x] Remove all direct usage of `mockDataService` or `apiRequest` from components.
   - [ ] Document the intended architecture and separation of concerns.
4. **Remove useRating and Rating Logic**
   - [x] Remove the `useRating` hook and all related code.
   - [x] Remove all mock rating logic from `mockDataService` and related files.
5. **Type Integration & Linter Fixes**
   - [~] Update `StudyCard` and related types to match UI requirements (add `learning_state`, `next_review_date`, `success_rate`).
   - [~] Fix all linter/type errors in components and hooks.
   - Note: StudyCard now includes all fields required by the UI, and CardPreviewTable is being updated to match. The architecture is now enforced: components use hooks, hooks use apiRequest, and types are consistent across layers.

### 🟠 Future

5. **Type Integration**
   - [ ] Set up type generation from Encore/OpenAPI when ready.

---

**Notes:**
- All data fetching and persistence must flow: **Component → Hook → apiRequest** (which routes to mock or real backend).
- No direct use of `apiRequest` or `mockDataService` in components.
- This plan is designed to minimize future integration pain and improve maintainability as the project evolves.
- Update this file as tasks are completed or requirements change. 