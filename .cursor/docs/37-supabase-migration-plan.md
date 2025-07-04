# Supabase Frontend to Backend Migration Plan

## 1. Introduction

This document outlines the plan to migrate all Supabase-related logic from the frontend of the application to a dedicated backend service powered by Encore. This migration aims to improve security by removing direct database access from the client, enhance performance by centralizing data-intensive operations, and increase scalability for future growth.

## 2. Analysis of Current Supabase Usage

The frontend currently interacts with Supabase for several key functionalities:

- **Authentication**: User sessions are managed on the client-side via `supabase.auth.getSession()` within the `useSupabaseData` hook.
- **Database Operations**: The application performs complex CRUD (Create, Read, Update, Delete) operations directly from the frontend. The following services and hooks are the primary points of interaction:
    - `frontend/src/services/vocabularyStorageService.ts`: Manages chapters and words, interacting with `chapters`, `series`, `words`, and `chapter_words` tables.
    - `frontend/src/services/supabase/vocabularyService.ts`: Handles fetching, searching, and filtering vocabulary from the `words` and `chapter_words` tables.
    - `frontend/src/services/supabase/analyticsService.ts`: Computes and retrieves analytics data, querying `study_history`, `study_sessions`, and `study_progress` tables. It also uses a simple in-memory cache.
    - `frontend/src/hooks/useSupabaseData.ts`: A central hook that orchestrates data fetching from the services above, manages client-side caching (`sessionStorage`), and handles real-time subscriptions.
- **Real-time Functionality**: The `useSupabaseData` hook subscribes to Supabase's real-time events to keep data synchronized across clients.

## 3. Proposed Backend Architecture

We will create a new Encore service within the `backend` directory named `webtoon`. This service will expose a series of RESTful API endpoints that the frontend will consume.

- **Service**: `backend/webtoon/webtoon.ts`
- **Authentication**: A middleware will be implemented within the Encore service to handle JWT validation, ensuring that all requests are authenticated before reaching the API endpoints.
- **Database Client**: The Supabase Admin SDK will be used on the backend for all database interactions. Credentials will be managed securely using Encore's built-in secret management.

## 4. Phased Migration Plan

The migration will be executed in the following phases to minimize disruption and allow for iterative testing.

### Phase 1: Backend Scaffolding

1.  **Create Encore Service**: Initialize a new Encore service file at `backend/webtoon/webtoon.ts`.
2.  **Setup Supabase Admin Client**: Configure the Supabase Admin client within the Encore service. Store the `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` as secrets using `encore.secrets`.
3.  **Define API Endpoints**: Define the initial API endpoint structures in the `webtoon.ts` file. These will initially be stubs that will be implemented in later phases. Example endpoints include:
    -   `POST /webtoon/chapters/check`
    -   `GET /webtoon/chapters/:id/words`
    -   `POST /webtoon/chapters`
    -   `GET /webtoon/vocabulary`
    -   `GET /webtoon/vocabulary/search`
    -   `GET /webtoon/analytics/retention`
    -   `GET /auth/session`

### Phase 2: Authentication Migration

1.  **Implement Auth Endpoint**: Create the `GET /auth/session` endpoint. This endpoint will take the user's Supabase JWT from the `Authorization` header, validate it using the Supabase Admin client, and return the user's session information.
2.  **Implement Auth Middleware**: Create an Encore middleware that protects all other endpoints. This middleware will use the same JWT validation logic.
3.  **Refactor Frontend**: Modify the `useSupabaseData` hook to call the new `/auth/session` endpoint instead of `supabase.auth.getSession()`. The JWT will be retrieved from the user's session and sent in the header of all subsequent API requests.

### Phase 3: Vocabulary and Chapter Logic Migration

1.  **Implement Backend Endpoints**: Implement the logic for the vocabulary and chapter-related endpoints (`/webtoon/chapters/*`, `/webtoon/vocabulary/*`). This involves moving all database queries from `vocabularyStorageService.ts` and `vocabularyService.ts` to the backend.
2.  **Refactor Frontend Services**: Rewrite the methods in `vocabularyStorageService.ts` and `vocabularyService.ts`. They will no longer contain Supabase queries but will instead make `fetch` calls to the new backend APIs.

### Phase 4: Analytics Logic Migration

1.  **Implement Backend Endpoints**: Implement the analytics endpoints (`/webtoon/analytics/*`). Move all query logic from `analyticsService.ts` to the backend.
2.  **Implement Backend Caching**: Replace the frontend's in-memory cache with a more robust solution on the backend, such as a Redis cache managed by Encore, to improve performance.
3.  **Refactor Frontend Service**: Update `analyticsService.ts` to call the new backend endpoints.

### Phase 5: Real-time Migration

Migrating real-time functionality requires a choice between two approaches:

-   **Option A (Recommended starting point)**: **Polling.** The `useSupabaseData` hook will be modified to poll the backend APIs at a regular interval (e.g., every 30 seconds) to fetch fresh data. This is simpler to implement and is a good initial step.
-   **Option B (Future enhancement)**: **WebSockets.** For true real-time updates, a WebSocket-based solution can be built using Encore. This is a more significant effort and can be addressed as a future improvement if polling is insufficient.

### Phase 6: Frontend Cleanup

1.  **Simplify `useSupabaseData`**: With all data fetching logic moved to services that call the backend, the `useSupabaseData` hook can be greatly simplified. Its primary responsibility will be state management. The client-side caching can be removed in favor of React Query's caching mechanisms if desired.
2.  **Remove Supabase Dependencies**: Uninstall the `@supabase/supabase-js` package from the `frontend/package.json`.
3.  **Delete Supabase Client**: Delete the file `frontend/src/integrations/supabase/client.ts`.

## 5. Testing Strategy

-   **Backend**: For each new endpoint created in the Encore service, a corresponding set of tests will be written to validate its functionality, including edge cases and error handling.
-   **Frontend**: Existing tests for components that rely on the `useSupabaseData` hook should be reviewed and updated. New tests should be added to ensure that the components behave correctly with the new data-fetching mechanism.

## 6. Rollout Plan

The migration will be deployed incrementally:

1.  Deploy the backend Encore service with the new endpoints.
2.  Deploy the updated frontend application.
3.  Monitor the application closely for any errors or performance degradation using logging and monitoring tools. 

## 7. Detailed Task List

### Phase 1: Backend Scaffolding
- [ ] Initialize a new Encore service file at `backend/webtoon/webtoon.ts`.
- [ ] Configure the Supabase Admin client within the Encore service.
- [ ] Store `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` as secrets using `encore.secrets`.
- [ ] Define stub API endpoints in `webtoon.ts`:
    - [ ] `POST /webtoon/chapters/check`
    - [ ] `GET /webtoon/chapters/:id/words`
    - [ ] `POST /webtoon/chapters`
    - [ ] `GET /webtoon/vocabulary`
    - [ ] `GET /webtoon/vocabulary/search`
    - [ ] `GET /webtoon/analytics/retention`
    - [ ] `GET /auth/session`

### Phase 2: Authentication Migration
- [ ] Implement the `GET /auth/session` endpoint on the backend.
- [ ] Implement an Encore middleware for JWT validation on protected routes.
- [ ] Refactor the `useSupabaseData` hook on the frontend to call the new `/auth/session` endpoint.
- [ ] Update the frontend API utility to send the Supabase JWT in the `Authorization` header for all authenticated requests.

### Phase 3: Vocabulary and Chapter Logic Migration
- [ ] Implement the backend logic for all `/webtoon/chapters/*` endpoints.
- [ ] Implement the backend logic for all `/webtoon/vocabulary/*` endpoints.
- [ ] Move all database queries from `frontend/src/services/vocabularyStorageService.ts` to the appropriate backend endpoints.
- [ ] Move all database queries from `frontend/src/services/supabase/vocabularyService.ts` to the appropriate backend endpoints.
- [ ] Refactor `frontend/src/services/vocabularyStorageService.ts` to make `fetch` calls to the new backend APIs.
- [ ] Refactor `frontend/src/services/supabase/vocabularyService.ts` to make `fetch` calls to the new backend APIs.

### Phase 4: Analytics Logic Migration
- [ ] Implement the backend logic for all `/webtoon/analytics/*` endpoints.
- [ ] Move all query logic from `frontend/src/services/supabase/analyticsService.ts` to the backend.
- [ ] Implement a backend caching solution (e.g., using Encore's built-in capabilities or a Redis cache) to replace the frontend's in-memory cache.
- [ ] Refactor `frontend/src/services/supabase/analyticsService.ts` to call the new backend endpoints.

### Phase 5: Frontend Cleanup
- [ ] Simplify the `useSupabaseData` hook, removing all direct data-fetching logic and focusing on state management.
- [ ] Consider replacing the custom `sessionStorage` cache with React Query for more robust client-side state management.
- [ ] Uninstall the `@supabase/supabase-js` package from `frontend/package.json`.
- [ ] Delete the Supabase client file: `frontend/src/integrations/supabase/client.ts`.

### Testing and Deployment
- [ ] Write backend tests for every new Encore endpoint to ensure correctness and handle edge cases.
- [ ] Review and update existing frontend tests to work with the new backend-driven data flow.
- [ ] Deploy the backend Encore service to your hosting environment.
- [ ] Deploy the refactored frontend application.
- [ ] Monitor the live application using logging and performance monitoring tools to identify and address any issues. 