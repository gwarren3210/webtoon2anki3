# Implementation Roadmap: SRS Study Mode for Webtoon2Anki

## Pre-Implementation Questions & Decisions

### 1. Architecture & Technology Stack

**Current State Analysis:**
- **Frontend:** React + TypeScript + Vite (handled by Lovable)
- **Backend:** Node.js + Encore.dev microservices (handled by Cursor)
- **Database:** Supabase (PostgreSQL) with existing schema
- **Current Features:** OCR processing, translation, Anki export
- **Existing Schema:** series, chapters, words, chapter_words tables

**Key Decisions:**
1. **User Authentication:** Anonymous sessions for Phase 1 (using Supabase anonymous auth)
2. **Data Persistence:** Supabase database (already set up and working)
3. **API Architecture:** REST APIs for backend + Supabase client for frontend
4. **Integration Strategy:** SRS will integrate with existing processing pipeline and use existing database schema

### 2. SRS Algorithm & Data Models

**Algorithm Choice:** SM-2 (recommended from research)
- **Pros:** Simple, proven, fast implementation
- **Cons:** Less adaptive than newer algorithms
- **Decision:** Start with SM-2, upgrade to SM-17/18 later if needed

**Existing Database Schema:**
```sql
-- Already exists in Supabase
series (id, name, created_at)
chapters (id, series_id, chapter_number, created_at)
words (id, word, definition, metadata, created_at)
chapter_words (id, chapter_id, word_id, frequency, context, importance_score, created_at)
```

**SRS Data Model Extensions:**
1. **Study Progress Table:** Track SRS parameters for each word
2. **Study Sessions Table:** Record study session history
3. **User Progress Table:** Track mastery levels and statistics

**Proposed SRS Schema Extensions:**
```sql
-- New table for SRS study progress
study_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  word_id UUID REFERENCES words(id) ON DELETE CASCADE,
  interval INTEGER DEFAULT 0,
  repetition INTEGER DEFAULT 0,
  efactor REAL DEFAULT 2.5,
  due_date TIMESTAMP WITH TIME ZONE,
  state TEXT DEFAULT 'new', -- 'new', 'learning', 'reviewing', 'mastered'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- New table for study sessions
study_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  cards_studied INTEGER DEFAULT 0,
  correct_answers INTEGER DEFAULT 0,
  session_duration INTEGER DEFAULT 0, -- in seconds
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- New table for study history
study_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  word_id UUID REFERENCES words(id) ON DELETE CASCADE,
  session_id UUID REFERENCES study_sessions(id) ON DELETE CASCADE,
  grade INTEGER NOT NULL, -- 0-5 (SM-2 grades)
  response_time INTEGER, -- in milliseconds
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

**Data Model Decisions:**
1. **Vocabulary Storage:** Use existing words and chapter_words tables
2. **Study Progress:** Track SRS parameters per word in study_progress table
3. **Session Management:** Record sessions and individual responses for analytics
4. **Mastery Criteria:** Define "mastered" based on consecutive correct reviews and interval length

### 3. User Experience & Workflow

**Current Workflow:** Upload → Process → Review → Download → Study in Anki
**Target Workflow:** Upload → Process → Review → Study in-app (separate section) → Optional Anki export

**UX Decisions:**
1. **Study Mode Integration:** Separate section from main processing flow
2. **Progress Visibility:** Show learning progress across chapters/series in study dashboard
3. **Mobile Priority:** Desktop-first design (mobile optimization in later phases)
4. **Offline Capability:** Not prioritized for MVP

### 4. Anki Compatibility Strategy

**Current:** Anki export (.apkg files)
**Future:** In-app study + optional Anki export

**Compatibility Decisions:**
1. **Dual Mode:** Maintain both workflows simultaneously
2. **Data Sync:** Study progress stays in-app, Anki export remains independent
3. **Migration Path:** Users can choose between in-app study or Anki export
4. **Export Format:** Maintain .apkg export for power users and existing workflow

### 5. Development Priorities

**MVP Scope Decisions:**
1. **Core Features:** Basic study mode with SRS algorithm and progress tracking
2. **Performance Requirements:** Support 1,000+ vocabulary items per user (scalable to 10,000+)
3. **Analytics:** Basic progress tracking and study statistics for MVP
4. **Testing Strategy:** Unit tests for SRS logic, integration tests for data flow

## Implementation Roadmap

### Phase 1: Foundation & Backend (Weeks 1-3) - Cursor

#### Week 1: SRS Algorithm & Database Schema
**Goals:**
- Implement SM-2 algorithm in TypeScript
- Design SRS database schema extensions
- Create database migrations for new tables
- Create unit tests for SRS logic

**Deliverables:**
```typescript
// services/srs/srsAlgorithm.ts - SM-2 implementation
// services/srs/types.ts - Data model definitions
// services/srs/srsAlgorithm.test.ts - Unit tests
// supabase/migrations/xxx_add_srs_tables.sql - Database migrations
```

**Key Decisions:**
- Finalize SRS table schema design
- Define study progress tracking structure
- Establish mastery criteria

#### Week 2: Study Session Management
**Goals:**
- Implement study session logic
- Create card scheduling algorithms
- Build progress tracking system
- Create Supabase service layer

**Deliverables:**
```typescript
// services/srs/studySession.ts - Session management
// services/srs/cardScheduler.ts - Due card calculation
// services/srs/progressTracker.ts - Progress tracking
// services/supabase/studyProgressService.ts - Database operations
```

**Key Decisions:**
- Session interruption handling strategy
- Card scheduling parameters
- Progress persistence approach

#### Week 3: Integration & Testing
**Goals:**
- Integrate SRS with existing processing pipeline
- Create comprehensive integration tests
- Performance testing and optimization
- Deploy database migrations

**Deliverables:**
```typescript
// Integration with existing OCR/translation pipeline
// End-to-end test suite
// Performance benchmarks
// Database migration deployment
```

**Key Decisions:**
- Integration points with existing services
- Data flow between processing and study
- Performance optimization strategies

### Phase 2: Frontend Implementation (Weeks 4-8) - Lovable

#### Week 4: Supabase Integration & Data Management
**Goals:**
- Implement Supabase client integration
- Create vocabulary import from processing pipeline
- Build data persistence for study progress
- Set up Supabase service layer

**Deliverables:**
```typescript
// services/supabase/vocabularyService.ts - Vocabulary CRUD
// services/supabase/studyProgressService.ts - Progress persistence
// services/supabase/studySessionService.ts - Session management
// services/api/vocabularyApi.ts - Import from processing
```

**Key Decisions:**
- Supabase client configuration
- Data migration from processing results
- Error handling for database operations

#### Week 5: Study Interface Foundation
**Goals:**
- Create basic flashcard component
- Implement card flipping animation
- Build study session UI
- Connect to Supabase data

**Deliverables:**
```typescript
// components/StudyMode/Flashcard.tsx
// components/StudyMode/StudySession.tsx
// hooks/useStudySession.ts
// hooks/useSupabaseData.ts
```

**Key Decisions:**
- Card design and layout
- Animation performance
- Study controls (buttons vs gestures)

#### Week 6: Study Session Management
**Goals:**
- Implement study session configuration
- Create progress indicators
- Build session interruption handling
- Real-time progress updates

**Deliverables:**
```typescript
// components/StudyMode/SessionConfig.tsx
// components/StudyMode/ProgressIndicator.tsx
// services/studySessionManager.ts
// hooks/useStudyProgress.ts
```

**Key Decisions:**
- Session configuration options
- Progress visualization design
- Interruption recovery UX

#### Week 7: Vocabulary Management UI
**Goals:**
- Create vocabulary dashboard
- Implement search and filtering
- Build mastery indicators
- Connect to existing vocabulary data

**Deliverables:**
```typescript
// components/Vocabulary/VocabularyDashboard.tsx
// components/Vocabulary/SearchFilter.tsx
// components/Vocabulary/MasteryIndicator.tsx
// services/supabase/vocabularyService.ts
```

**Key Decisions:**
- Dashboard layout and organization
- Search and filter capabilities
- Mastery visualization design

#### Week 8: Integration & Polish
**Goals:**
- Integrate study mode with main application
- Implement navigation between processing and study
- Add basic analytics and progress tracking
- Performance optimization

**Deliverables:**
```typescript
// Navigation integration
// Basic analytics dashboard
// Progress tracking integration
// Performance optimizations
```

**Key Decisions:**
- Navigation flow between sections
- Analytics scope for MVP
- Integration testing approach

### Phase 3: Analytics & Advanced Features (Weeks 9-12)

#### Week 9: Analytics Foundation
**Goals:**
- Implement learning analytics service
- Create study insights and metrics
- Build progress visualization components
- Set up Supabase analytics queries

**Deliverables:**
```typescript
// services/analytics/metricsService.ts - Learning metrics
// services/analytics/insightsService.ts - Study insights
// components/Analytics/Dashboard.tsx - Analytics dashboard
// components/Analytics/ProgressCharts.tsx - Data visualization
```

**Key Decisions:**
- Analytics scope and metrics to track
- Data visualization library choice
- Real-time vs batch analytics

#### Week 10: Advanced SRS Features
**Goals:**
- Implement advanced SRS algorithms (SM-17/18)
- Add card customization options
- Create study difficulty adjustment
- Performance optimization

**Deliverables:**
```typescript
// services/srs/advancedSrsAlgorithm.ts - SM-17/18
// components/StudyMode/CardCustomization.tsx
// services/srs/difficultyAdjustment.ts
// Performance optimizations
```

**Key Decisions:**
- Algorithm upgrade strategy
- Customization options scope
- Performance benchmarks

#### Week 11: Mobile Optimization
**Goals:**
- Optimize for mobile devices
- Implement touch gestures
- Add offline study capabilities
- Mobile-specific UI improvements

**Deliverables:**
```typescript
// Mobile-responsive components
// Touch gesture handlers
// Offline study mode
// Mobile UI optimizations
```

**Key Decisions:**
- Mobile-first design approach
- Offline data synchronization
- Touch interaction patterns

#### Week 12: Polish & Launch Preparation
**Goals:**
- Comprehensive testing and bug fixes
- Performance optimization
- User experience improvements
- Documentation and deployment

**Deliverables:**
```typescript
// Comprehensive test suite
// Performance optimizations
// UX improvements
// Documentation and deployment
```

**Key Decisions:**
- Launch criteria and testing strategy
- Performance optimization priorities
- Documentation scope

## Technical Architecture

### Backend Architecture (Cursor)
```
services/
├── srs/
│   ├── srsAlgorithm.ts      # SM-2 implementation
│   ├── studySession.ts      # Session management
│   ├── cardScheduler.ts     # Due card calculation
│   ├── progressTracker.ts   # Progress tracking
│   └── types.ts            # Data models
├── vocabulary/
│   ├── vocabularyService.ts # CRUD operations
│   ├── searchService.ts     # Search and filtering
│   └── importService.ts     # Import from processing
└── analytics/
    ├── metricsService.ts    # Learning metrics
    └── insightsService.ts   # Study insights
```

### Frontend Architecture (Lovable)
```
components/
├── StudyMode/
│   ├── Flashcard.tsx        # Card component
│   ├── StudySession.tsx     # Session UI
│   ├── SessionConfig.tsx    # Configuration
│   └── ProgressIndicator.tsx # Progress display
├── Vocabulary/
│   ├── VocabularyDashboard.tsx # Main dashboard
│   ├── SearchFilter.tsx     # Search interface
│   └── MasteryIndicator.tsx # Progress indicators
└── Analytics/
    ├── Dashboard.tsx        # Analytics dashboard
    ├── ProgressCharts.tsx   # Data visualization
    └── StudyInsights.tsx    # Learning insights

services/
├── srs/
│   ├── srsAlgorithm.ts      # SM-2 implementation (frontend)
│   ├── studySession.ts      # Session management
│   ├── cardScheduler.ts     # Due card calculation
│   └── progressTracker.ts   # Progress tracking
├── supabase/
│   ├── vocabularyService.ts # Vocabulary CRUD operations
│   ├── studyProgressService.ts # Study progress persistence
│   ├── studySessionService.ts # Session management
│   └── analyticsService.ts  # Learning analytics
└── api/
    ├── vocabularyApi.ts     # API calls for vocabulary import
    └── exportApi.ts         # Anki export functionality
```

### Database Schema (Supabase)
```
Existing Tables:
├── series (id, name, created_at)
├── chapters (id, series_id, chapter_number, created_at)
├── words (id, word, definition, metadata, created_at)
└── chapter_words (id, chapter_id, word_id, frequency, context, importance_score, created_at)

New SRS Tables:
├── study_progress (id, word_id, interval, repetition, efactor, due_date, state, created_at, updated_at)
├── study_sessions (id, session_date, cards_studied, correct_answers, session_duration, created_at)
└── study_history (id, word_id, session_id, grade, response_time, created_at)
```

### Data Flow Architecture
```
Processing Pipeline → Vocabulary Import → Supabase Database → Study Mode → Progress Tracking
                                    ↓
                              Anki Export (maintained)
```

## Success Criteria

### Technical Metrics
- **Performance:** Study mode loads in < 2 seconds
- **Reliability:** 99.9% uptime for study features
- **Scalability:** Support 1,000+ vocabulary items (scalable to 10,000+)
- **Storage:** Efficient IndexedDB usage with proper indexing

### User Experience Metrics
- **Time to First Study:** < 30 seconds (vs current 2-3 minutes)
- **Session Duration:** > 15 minutes average
- **Retention Rate:** > 80% weekly active users
- **Navigation:** Seamless flow between processing and study modes

### Learning Effectiveness
- **Vocabulary Retention:** > 85% after 1 week
- **Study Consistency:** > 5 sessions per week
- **Mastery Progress:** > 70% of words reach "Mastered"
- **User Satisfaction:** > 4.5/5 rating

## Risk Mitigation

### Technical Risks
- **SRS Algorithm Complexity:** Start with SM-2, iterate based on user feedback
- **IndexedDB Performance:** Implement proper indexing and lazy loading
- **Data Loss:** Robust error handling and backup strategies

### User Adoption Risks
- **Learning Curve:** Intuitive design, guided tutorials
- **Feature Overload:** Phased rollout, progressive disclosure
- **Data Loss Concerns:** Clear data persistence and recovery options

### Integration Risks
- **Backend-Frontend Handoff:** Clear data contracts, comprehensive documentation
- **Anki Compatibility:** Maintain export functionality, gradual migration
- **Data Migration:** Careful schema design, backward compatibility

## Next Steps

### Immediate Actions (This Week)
1. **Set Up Development Environment:** Prepare backend and frontend workspaces
2. **Create Project Structure:** Set up folder structure and basic files
3. **Begin SRS Algorithm Implementation:** Start with SM-2 in TypeScript
4. **Design IndexedDB Schema:** Plan storage structure for vocabulary and progress

### Week 1 Deliverables
- [ ] SM-2 algorithm implementation with tests
- [ ] Vocabulary and study progress data models
- [ ] IndexedDB schema design
- [ ] Integration plan with existing pipeline

### Success Indicators
- [ ] SRS algorithm passes all unit tests
- [ ] Data models support all required functionality
- [ ] IndexedDB schema supports efficient queries
- [ ] Integration points are clearly defined

---

## Implementation Summary

**Architecture Decisions:**
- **Anonymous sessions** for Phase 1
- **Supabase database** for data persistence
- **REST APIs** for vocabulary import from processing pipeline
- **Separate study section** from main processing flow
- **Desktop-first design** with mobile optimization in later phases
- **Maintain Anki export** while adding in-app study capability

**Development Approach:**
- **Phase 1 (Weeks 1-3):** Backend SRS logic and integration (Cursor)
- **Phase 2 (Weeks 4-8):** Frontend implementation with IndexedDB (Lovable)
- **Phase 3 (Weeks 9-12):** Analytics and advanced features (Mixed)

**Key Benefits:**
- **Simplified architecture** with Supabase storage
- **Faster development** without backend database complexity
- **Maintained compatibility** with existing Anki workflow
- **Scalable approach** that can evolve with user needs

The roadmap is now ready for implementation with clear technical decisions and a realistic timeline.

## Key Benefits & Considerations

### Benefits of This Approach
1. **Leverages Existing Infrastructure:** Uses your already-established Supabase database and schema
2. **Simplified Architecture:** No need for separate IndexedDB implementation
3. **Real-time Capabilities:** Supabase provides real-time subscriptions for live updates
4. **Scalable Storage:** PostgreSQL can handle large amounts of vocabulary and study data
5. **Built-in Authentication:** Can easily add user accounts later using Supabase Auth
6. **Data Persistence:** Study progress persists across devices and sessions
7. **Analytics Ready:** Database queries enable rich analytics and insights
8. **Maintained Compatibility:** Keeps existing Anki export workflow intact

### Technical Considerations
1. **Database Schema Design:** Need to carefully design SRS tables to work with existing schema
2. **Migration Strategy:** Plan for adding new tables without disrupting existing data
3. **Performance Optimization:** Ensure efficient queries for large vocabulary sets
4. **Real-time Updates:** Consider when to use real-time subscriptions vs regular queries
5. **Error Handling:** Robust error handling for network issues and database operations
6. **Data Synchronization:** Handle offline scenarios and data conflicts
7. **Security:** Implement proper Row Level Security (RLS) policies for user data

### Risk Mitigation
1. **Database Migration:** Test migrations thoroughly in development environment
2. **Performance Testing:** Benchmark with realistic data volumes
3. **Backup Strategy:** Ensure proper backup of study progress data
4. **Rollback Plan:** Have plan to revert to previous state if issues arise
5. **User Data Protection:** Implement proper data privacy and security measures 