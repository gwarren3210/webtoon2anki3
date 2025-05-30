# OCR Detection Lessons & Decisions

## 1. OCR Library Selection
- **PaddleOCR** was chosen over EasyOCR for its superior accuracy, language support (especially Korean), and better extensibility for comic/webtoon use cases.
- EasyOCR was considered but lacked some advanced features and performance needed for this project.

## 2. TypeScript-Only Backend
- All OCR logic is implemented in **TypeScript** using Encore.ts, with no Python subprocesses or external API calls.
- This ensures easier deployment, maintainability, and integration with the rest of the Encore backend.

## 3. Speech Bubble Detection
- **opencv4nodejs** is used to detect both rectangular and oval (ellipse) speech bubbles in comic images.
- The detection logic uses contour analysis, polygon approximation, and ellipse fitting.
- Detected regions are returned with bounding box info and region type.

## 4. Tiling/Region Detection Approach
- Several strategies were considered for breaking down large images for OCR.
- **Template matching and shape detection** (rectangles/ellipses) was selected for its reliability and no need for ML training.
- Other options (sliding window, ML-based, hybrid) were documented for future reference.

## 5. Testing & Debugging
- Tests are colocated with the service and use direct function calls for reliability.
- Logging is added to tests for easier debugging of region detection.
- Initial attempt to test via API import failed due to module resolution; direct import is preferred for unit tests.

## 6. Project Structure & Conventions
- Follows project rules: named exports only, clear separation of orchestration/logic, modular file structure, and colocated tests.
- All OCR logic lives under `backend/services/ocr/` and API endpoints under `backend/api/ocr/`.

## 7. Issues & Resolutions
- Encountered module resolution issues when trying to test via API endpoint; resolved by testing the service directly.
- Ensured all documentation and code comments reflect the TypeScript-only approach.

## 8. Next Steps
- Implement actual OCR logic for each detected region (currently a placeholder).
- Continue refining detection and OCR accuracy as needed.

---

This document should be referenced for future OCR-related work and onboarding. 