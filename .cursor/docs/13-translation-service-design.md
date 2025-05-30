# Design Document: Translation Service

## 1. Goal

The primary goal is to implement a translation feature within the `webtoon2anki3` application. This feature should translate text extracted from webtoon images, specifically focusing on translating individual words while retaining their original context (the full line they appeared in).

## 2. Data Structure: `TranslatedWordInfo`

### Decision:

We defined a new TypeScript type, `TranslatedWordInfo`, to store the necessary information for each translated word.

```typescript
export type TranslatedWordInfo = {
  originalWord: string;
  originalWordBbox: BoundingBox; // Optional - discussed below
  originalLine: string;
  originalLineBbox: BoundingBox; // Optional - discussed below
  translatedWord: string;
  translatedLine?: string; // Optional translation of the whole line
};
```

### Rationale (Bounding Boxes):

The inclusion of `originalWordBbox` and `originalLineBbox` was discussed. These fields would allow for visual linking between the translated text and the original image (e.g., highlighting the original word/line when hovering over the translation, interactive selection). However, adding these would require a significant refactor of the existing OCR/text processing pipeline to provide word-level bounding boxes.

**Pros of including Bounding Boxes:**
*   Enables visual linking features (highlighting, interactive selection).
*   Can help with layout preservation if translations are overlaid on the image.

**Cons of including Bounding Boxes:**
*   Requires significant refactoring of existing OCR/text processing.
*   Increased complexity in data handling.

**Decision:** The user acknowledged the pros and cons and will decide later if the refactor is worth the visual features or if a simpler structure without bounding boxes is sufficient.

## 3. Service Architecture and Abstraction

### Decision:

To ensure flexibility and allow switching between different translation methods, a dedicated translation service with an abstraction layer will be implemented within `backend/services/translation/`.

### File Outline:

*   `backend/services/translation/translationEngine.ts`: 
   * Defines the `ITranslationEngine` interface, outlining the methods (e.g., `translateWord`, `translateLine`) that any implementation must provide.
*   `backend/services/translation/translationService.ts`: The main service class. It will: 
   * receive an instance of an `ITranslationEngine` via dependency injection 
   * process the input text data
   * call the appropriate methods on the engine 
   * format the results as `TranslatedWordInfo`
*   Specific Engine Implementations (e.g., `googleTranslateEngine.ts`, `papagoTranslateEngine.ts`, `libreTranslateEngine.ts`): 
   * Files implementing the `ITranslationEngine` interface for specific translation APIs or methods.

### Rationale:

This structure promotes separation of concerns and makes it easy to swap out translation providers without modifying the core translation logic in `translationService.ts`.

## 4. Translation API Exploration (Korean to English)

### Background:

The user implemented OCR using OCR.space and now needs to translate the extracted Korean text to English. A search was conducted to find suitable free translation APIs.

### Options Explored (with Perplexity):

*   **LibreTranslate API:**
    *   **Pros:** Free, open-source, self-hostable, direct API, easy Node.js integration.
    *   **Cons:** Public instances may have rate limits, accuracy is good but potentially lower than commercial services for Korean.
    *   **Accuracy:** Moderate.
*   **Google Translate API:**
    *   **Pros:** High accuracy.
    *   **Cons:** Official API is paid; free access only via unofficial web tools/scrapers.
    *   **Accuracy:** High.
*   **Lingvanex Korean Translation API:**
    *   **Pros:** Supports various translation types.
    *   **Cons:** Free tier has usage limits; paid for significant use.
    *   **Accuracy:** Not explicitly ranked but listed as an option.
*   **DeepL Translator:**
    *   **Pros:** Highest accuracy for Korean-English among tested.
    *   **Cons:** No official free API for automation; free use is web-based/manual.
    *   **Accuracy:** Highest.
*   **QuillBot AI Translator:**
    *   **Pros:** Free web use.
    *   **Cons:** Not a direct API; manual or unofficial automation only.
    *   **Accuracy:** Not explicitly ranked but mentioned.
*   **Papago (NAVER) API:**
    *   **Pros:** Very high accuracy for Korean (especially idioms/slang), official API exists.
    *   **Cons:** Difficult to obtain API key outside South Korea (phone verification, business info issues), no free tier as of 2025.
    *   **Accuracy:** Very High.
*   **ChatGPT/GPT-4 API:**
    *   **Pros:** High accuracy (anecdotal), easy integration.
    *   **Cons:** Paid API.
    *   **Accuracy:** High (anecdotal).

### Conclusion on Free APIs:

Directly integrating a stable, free, high-accuracy API for Korean to English is challenging:

*   **LibreTranslate** is the best free, open-source API option but may have lower accuracy for Korean compared to commercial options.
*   **Papago** offers very high accuracy but is effectively inaccessible for free/easy API key acquisition for non-Korean users.
*   **DeepL and Google Translate** are high accuracy but require paid APIs for automation.

## 5. Exploring Unofficial Papago Solutions

### Background:

Due to the difficulty in obtaining a free Papago API key, unofficial methods mimicking browser requests were explored as a potential workaround.

### Options and Analysis:

*   **Community-made npm packages (e.g., `papago-translate`, `nodepapago`):**
    *   **Pros:** Easy to integrate, simple API.
    *   **Cons:** Unofficial (against ToS), prone to breaking if Papago updates their site, reliability risks.
*   **Custom Puppeteer/Playwright Scripts:**
    *   **Pros:** Highly customizable, can adapt to site changes, no external wrapper dependency.
    *   **Cons:** Heavy (requires browser), slower, requires maintenance, unofficial (against ToS), prone to blocking.

### Decision:

Given the limitations of official free APIs and the high accuracy of Papago for Korean, exploring unofficial Papago solutions (like `papago-translate` or a custom scraper) is a potential path, **with the strong caveat that these are unofficial, violate terms of service, and are not reliable for production use.**

## 6. Next Steps

*   Decide whether word/line bounding boxes are essential, influencing the `TranslatedWordInfo` structure and potential refactoring needs.
*   Choose a translation method based on the API exploration and proceed with implementing a specific `ITranslationEngine` (e.g., using LibreTranslate or evaluating the feasibility/risks of an unofficial Papago wrapper). 