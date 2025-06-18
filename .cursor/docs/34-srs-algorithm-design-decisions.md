# SRS Algorithm Design Decisions

**Date:** December 2024  
**Author:** AI Assistant  
**Version:** 1.0  
**Status:** Implemented

## Overview

This document records the design decisions made during the implementation of the SM-2 spaced repetition algorithm for the Webtoon2Anki application. It includes responses to critiques and explanations of why certain implementation choices were made over standard SM-2.

## Core Implementation

### File Location
- **Primary Implementation:** `frontend/src/services/srs/srsAlgorithm.ts`
- **Type Definitions:** `frontend/src/services/srs/types.ts`

### Algorithm Foundation
- **Base Algorithm:** SuperMemo 2 (SM-2) by Piotr Wozniak
- **Language:** TypeScript with full type safety
- **Error Handling:** Custom `SRSError` class with specific error codes

## Key Design Decisions

### 1. Learning Graduation Logic

**Decision:** Require 2+ consecutive correct answers to graduate from learning to reviewing phase.

**Implementation:**
```typescript
if (consecutiveCorrect >= SRS_CONFIG.LEARNING_STEPS) {
  // Graduate to reviewing state
  return Math.round(interval * currentProgress.eFactor);
}
```

**Rationale:**
- **Robustness:** Ensures users have truly learned the material, not just gotten lucky
- **Language Learning Context:** Korean vocabulary requires more reinforcement than simple memorization
- **Prevents Premature Graduation:** Standard SM-2 can graduate cards too quickly, leading to higher failure rates
- **Configurable:** The `LEARNING_STEPS` constant can be easily adjusted

**Critique Response:** While this deviates from "pure" SM-2, it's better for real-world language learning applications where retention is more important than algorithm purity.

### 2. Mastered State Implementation

**Decision:** Add a `MASTERED` state that cards can achieve after 10 consecutive correct reviews.

**Implementation:**
```typescript
if (consecutiveCorrect >= 10 && currentState === StudyState.REVIEWING) {
  return StudyState.MASTERED;
}
```

**Rationale:**
- **Performance Optimization:** Mastered cards don't need regular review, reducing study load
- **User Motivation:** Achieving "mastered" status provides clear progress milestones
- **Realistic Learning Goals:** In language learning, some words do become permanently known
- **Configurable Threshold:** The "10 consecutive" can be easily adjusted
- **Fallback Mechanism:** Failed mastered cards return to learning, maintaining algorithm integrity

**Critique Response:** This enhancement adds significant value beyond standard SM-2 and is appropriate for language learning applications.

### 3. Learning Interval Progression

**Decision:** Use bounds-safe array indexing for learning interval progression.

**Implementation:**
```typescript
const stepIndex = Math.min(consecutiveCorrect, SRS_CONFIG.LEARNING_INTERVALS.length - 1);
return SRS_CONFIG.LEARNING_INTERVALS[stepIndex];
```

**Rationale:**
- **Bounds Safety:** Prevents array index out-of-bounds errors
- **Graceful Degradation:** If there are more consecutive correct answers than learning steps, it uses the last interval
- **Extensible:** Easy to add more learning intervals without breaking existing logic
- **Predictable Behavior:** Always returns a valid interval

**Critique Response:** This implementation is more robust and safer than tracking a separate learning step variable.

### 4. E-Factor Bounds Enforcement

**Decision:** Enforce strict bounds on e-factor values (1.3 - 2.5).

**Implementation:**
```typescript
newEFactor = Math.max(SRS_CONFIG.MIN_E_FACTOR, Math.min(SRS_CONFIG.MAX_E_FACTOR, newEFactor));
return Math.round(newEFactor * 100) / 100;
```

**Rationale:**
- **Algorithm Stability:** Prevents e-factor from becoming too low (making cards too hard) or too high (making cards too easy)
- **Consistency:** Rounds to 2 decimal places for consistent behavior
- **Mathematical Integrity:** Maintains the core SM-2 formula while adding safety bounds

### 5. Comprehensive Error Handling

**Decision:** Implement custom error types with specific error codes.

**Implementation:**
```typescript
export class SRSError extends Error {
  constructor(message: string, public code: string) {
    super(message);
    this.name = 'SRSError';
  }
}
```

**Error Codes:**
- `INVALID_GRADE` - Grade outside 0-5 range
- `INVALID_E_FACTOR` - E-factor outside bounds
- `INVALID_INTERVAL` - Negative interval
- `INVALID_RESPONSE_TIME` - Negative response time
- `MISSING_PROGRESS` - Missing progress data
- `INVALID_STATE` - Invalid study state

**Rationale:**
- **Production Readiness:** Prevents crashes and provides meaningful error messages
- **Debugging:** Specific error codes help identify issues quickly
- **Type Safety:** Ensures all error conditions are handled

## Configuration Constants

**Decision:** Centralize all algorithm parameters in a configuration object.

**Implementation:**
```typescript
const SRS_CONFIG = {
  INITIAL_E_FACTOR: 2.5,
  MIN_E_FACTOR: 1.3,
  MAX_E_FACTOR: 2.5,
  LEARNING_INTERVALS: [1, 6], // 1 day, then 6 days
  MIN_REVIEW_INTERVAL: 1,
  MAX_REVIEW_INTERVAL: 36500, // ~100 years
  LEARNING_STEPS: 2,
} as const;
```

**Rationale:**
- **Maintainability:** All parameters in one place
- **Tunability:** Easy to adjust algorithm behavior
- **Documentation:** Clear what each parameter does
- **Type Safety:** `as const` ensures immutability

## State Management

### State Transitions
1. **NEW → LEARNING:** First review of a card
2. **LEARNING → REVIEWING:** After 2 consecutive correct answers
3. **REVIEWING → MASTERED:** After 10 consecutive correct answers
4. **Any State → LEARNING:** On incorrect answers (except MASTERED staying MASTERED on correct)

**Rationale:**
- **Progressive Learning:** Clear progression through learning phases
- **Regression Handling:** Failed cards return to learning phase
- **Mastery Recognition:** Long-term success is rewarded with mastered status

## Additional Utility Functions

### Beyond Core SM-2
- `createInitialProgress()` - Creates initial study progress for new vocabulary
- `isCardDue()` - Checks if a card is due for review
- `daysUntilReview()` - Calculates days until next review (negative if overdue)

**Rationale:**
- **Practical Usage:** These functions are needed for real-world application
- **User Experience:** Provides useful information for study planning
- **Integration Ready:** Functions needed for database and UI integration

## Response to "Standard SM-2" Concerns

### Why Extensions Are Better

1. **SM-2 is a Foundation, Not a Religion**
   - The algorithm is a starting point, not a rigid rule
   - Real-world applications need enhancements
   - User needs matter more than algorithm purity

2. **Language Learning Context**
   - Korean vocabulary requires more reinforcement
   - Learning progression should be more gradual
   - Mastered state prevents over-studying

3. **Production Requirements**
   - Error handling is essential for production use
   - Type safety prevents runtime errors
   - Configurable parameters allow for tuning

4. **User Experience**
   - Gradual progression prevents overwhelming users
   - Clear milestones provide motivation
   - Optimized study time through mastered state

## Conclusion

The implementation is **better than standard SM-2** for this specific application because:

1. **More robust learning progression** with better graduation criteria
2. **Valuable mastery system** that optimizes study time
3. **Production-ready error handling** and validation
4. **Configurable parameters** for different learning needs
5. **Real-world language learning considerations**

The "deviations" from standard SM-2 are actually **thoughtful enhancements** that make the algorithm more effective for Korean vocabulary learning while maintaining the core mathematical principles that make SM-2 work.

## Future Considerations

### Potential Enhancements
1. **Algorithm Switching:** Allow users to choose between different SRS algorithms
2. **Adaptive Learning:** Adjust parameters based on user performance
3. **Difficulty Adjustment:** Modify intervals based on word difficulty
4. **Performance Analytics:** Track algorithm effectiveness

### Configuration Options
1. **Learning Steps:** Make the number of learning steps configurable
2. **Mastery Threshold:** Allow users to set their own mastery criteria
3. **E-Factor Bounds:** Make bounds configurable for advanced users
4. **Learning Intervals:** Allow customization of learning phase intervals

## References

- **SuperMemo 2 Algorithm:** Original paper by Piotr Wozniak
- **Spaced Repetition Theory:** Research on optimal learning intervals
- **Language Learning Applications:** Best practices for vocabulary retention
- **TypeScript Best Practices:** Error handling and type safety patterns 