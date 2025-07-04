#### 📍 Step 1: Start with the App Summary

 I'm creating a Korean language-learning app for desktop and mobile web that uses vocabulary from Korean webtoons. It's called **Webtoon Cards**.

 The app helps beginner to intermediate learners study vocabulary pulled from Korean webtoons using SM-2 spaced repetition flashcards. The visual identity should balance fun and utility—appealing to webtoon fans while remaining focused enough for serious study. Think cozy but not cartoonish.

 I want the **light mode** to be playful and colorful (with webtoon-style accents), and the **dark mode** to be sleek and minimal.

---

#### 📍 Step 2: Send the Page Structure Prompt

 Please design the following pages:

 **1. Landing Page:**

 * A minimal landing page focused on user sign-up and login, with strong, upbeat visuals.
 * The main application navbar should not be visible here; it should only appear after login.
 * Similarly, after login, the landing page should not be visible
 * Contains options for guest login, user login, and registration.
 * A clear, friendly overview of how the app works (flashcards + webtoons).

 **Layout & Sections:**
 - **Top Navigation Bar (Sticky):**
   - Left: App logo + "Webtoon Cards"
   - Center: Navigation links (`Home`, `Explore`, `Library`, `Profile`, `Upload`)
   - Right: `Login`/`Sign Up` (logged out), `Avatar`/`Sign Out` (logged in)
   - Responsive: Collapses to hamburger menu on mobile; highlight current page
 - **Hero Section:**
   - Main title: "Learn Korean with Webtoons"
   - Subtitle: "Master Korean vocabulary with flashcards built from your favorite manhwa, powered by spaced repetition."
   - Korean subtitle: "웹툰으로 배우는 한국어"
   - Buttons: `Start Learning` (to Explore/Study), `Guest Mode` (sample flashcards)
   - Large, centered, with subtle down-arrow animation
 - **Feature Cards:**
   - Three cards: `Choose Your Webtoon`, `Study with Flashcards`, `Track Progress`
   - Playful icons, clear spacing, optionally clickable
 - **How It Works:**
   - Numbered steps: 1. Choose Webtoon 2. Study 3. Track Progress 4. (Optional) Upload
   - Horizontal on desktop, stacked on mobile
 - **Vocab Flashcard Preview:**
   - Example card: Korean word, romanization, English, example sentence
   - Flip effect or animation recommended
 - **Benefits Section:**
   - Bullet points/icons: SM-2, community decks, uploads, stats
   - 2-3 column layout, optional hover
 - **Footer:**
   - About, Privacy Policy, Contact, GitHub/Feedback, language toggle (optional)

 **2. Explore Page:**

 * Modern, engaging page for discovering and browsing webtoon-based vocabulary decks.
 * Target users: beginner/intermediate Korean learners, webtoon fans, gamified learners.
 * Visual style: modern, friendly, strong hierarchy; supports light/dark mode; mobile-first responsive.

 **Core Features:**
 - **Search & Discovery:**
   - Primary search bar (Korean/English titles)
   - Advanced filters: difficulty, genres, popularity, card count
   - Multi-select for genres/difficulty; predictive, fast search
 - **Series Modal:**
   - Clicking on a series opens a modal with:
     - A short description of the series and its tags
     - A list of available chapter decks for that series, with metadata (cards, difficulty, etc.)
     - Chapters that are not yet unlocked display a lock icon; the first chapter is always unlocked
     - To unlock a chapter, the user must reach a mastery goal in the previous chapter
 - **Content Display:**
   - Each deck card shows: cover image, difficulty badge, genre tags, "New!"/"Trending" indicators
   - Metadata: English & Korean titles, star rating, card count, active learners, short vocab focus, author
   - Actions: Start Learning (CTA), Bookmark/Save, Preview
 - **Layout:**
   - Medium-sized cards balancing visuals and info
   - Adaptive grid: detailed or compact view
   - Rich info hierarchy, genre color coding
 - **Enhanced Features:**
   - Personalized recommendations, learning path suggestions
   - Difficulty progression, recently viewed decks
   - Vocabulary focus filters (grammar, conversation, business, culture)
   - Study time estimates (quick vs. deep study)
 - **Social & Community:**
   - User reviews/ratings, study group indicators, social proof, discussion threads
 - **Visual Enhancements:**
   - Progress/completion indicators, quality badges (Editor's Choice, Community Favorite, Verified, Beginner Friendly)
   - Trending indicators, consistent genre color themes
 - **Technical/Content Notes:**
   - Lazy loading for images, accessibility (contrast, keyboard, screen reader)
   - Responsive across devices
   - Feature mix of popular/new decks, highlight beginner-friendly and diverse genres
   - Use static data only—no backend

 **3. Study Page:**

  * Minimalist, single-card focus for reviewing flashcards (with placeholder Korean text).
  * No scrolling required; all interactive elements always visible.

  **Layout & Structure:**
  - Large, centered flashcard (60-70% of screen height)
  - Fixed header: deck/chapter, number of cards left from (new, mistakes, old), undo button to previous card state
  - Fixed footer: SM-2 difficulty buttons always visible (dimmed when on the word side)
  - Generous white space around card content

  **Card Content:**
  - Primary: Korean term/phrase (large text)
  - Secondary: English definition/translation
  - Supporting: Example or usage note
  - Subtle card flip animation

  **Interaction:**
  - SM-2 buttons: Again, Hard, Good, Easy, Mastered - can also be navigated by keyboard
  - Tap/click to flip card and reveal answer - can also be flipped with space bar

  **Visual Design:**
  - High contrast for readability (light/dark mode)
  - Consistent spacing and breathing room
  - Subtle animations: card flip, button hover, progress

 **4. User Library Page:**

 * Shows the series/decks a user is studying.
 * Highlights what needs review using badges or progress bars for subtle urgency.
 * Option to "Review All" or filter by series.

 **5. Profile Page:**

 * Avatar, username, and learning stats (streak, cards learned, most studied series).
 * Manage uploads or account settings.

 **6. (Optional) Upload Flow:**

 * Users can upload their own webtoon chapters and choose to keep them private or contribute to the public library.

---

### 🔍 **UI Description:**

#### 🖼 **Overall Style:**

* **Modern and minimal** layout with clear visual hierarchy.
* **Soft gradient background** (light blue/purple) that gives a calm and inviting feel.
* Balanced white space and centered alignment create a sense of focus.

#### 🎨 **Color Palette:**

* Dominant use of **soft purples and blues**, giving it a **tech-savvy but friendly** vibe.
* Gradient on the button (from lavender to blue) adds subtle polish without being loud.
* High contrast between black/gray text and the background ensures readability.

#### 🧭 **Layout and Structure:**

* Logo and app name ("WebtoonCards") top left, providing branding.
* The main content area is **centered and card-based**, focusing the user's attention.


#### 🗣 **Tone & Vibe:**

* **Friendly and instructional** — using direct but soft language
* **Trustworthy and lightweight** — feels welcoming to new users and appropriate for both casual and serious learners.

---

### 🧠 Summary for Designer or Builder:

 A clean, gradient-accented web UI designed for inputting information in a low-friction, high-focus way. Typography is modern and readable, the color scheme leans friendly and tech-forward (lavender/blue), and the UX is intuitive with a clear call to action. Optimized for beginner users entering chapter data in a learning flow.