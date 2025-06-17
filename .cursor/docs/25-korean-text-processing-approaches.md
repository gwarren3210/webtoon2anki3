# Korean Text Processing and Word Selection Approaches

## Overview
This document outlines various approaches for processing Korean text and selecting important words for flashcard creation in the Webtoon2Anki project. The goal is to improve the quality and efficiency of vocabulary extraction from webtoon content.

## Current Challenges

1. **Text Processing**
   - Simple text splitting is insufficient for Korean
   - Need to handle compound words, particles, and verb conjugations
   - Dictionary form extraction is necessary for consistent learning

2. **Word Selection**
   - Too many words per chapter (300+ unique words)
   - Need to condense to 20-50 most important words
   - Importance criteria needs definition

## Proposed Solutions

### 1. Korean NLP Integration

#### A. Python-based Solution (Recommended)
```python
from konlpy.tag import Mecab

class KoreanTextProcessor:
    def __init__(self):
        self.tokenizer = Mecab()
    
    def process_text(self, text: str) -> List[TokenizedWord]:
        # Tokenize and extract dictionary forms
        tokens = self.tokenizer.pos(text)
        return [
            TokenizedWord(
                surface=token[0],    # Word as it appears
                lemma=token[1],      # Dictionary form
                pos=token[2],        # Part of speech
                frequency=1
            )
            for token in tokens
        ]
```

#### B. JavaScript-based Solution
```typescript
interface TokenizedWord {
    surface: string;    // Word as it appears
    lemma: string;      // Dictionary form
    pos: string;        // Part of speech
    frequency: number;
    context: string;
}

class KoreanTextProcessor {
    private tokenizer: any; // node-mecab-ko instance

    async tokenizeText(text: string): Promise<TokenizedWord[]> {
        const tokens = await this.tokenizer.tokenize(text);
        return tokens.map(token => ({
            surface: token.surface,
            lemma: token.lemma,
            pos: token.pos,
            frequency: 1,
            context: text
        }));
    }
}
```

### 2. Word Selection Strategies

#### A. AI-Powered Selection
- Use Gemini to analyze dialogue and select important words
- Pros:
  - Context-aware selection
  - Can understand word importance
- Cons:
  - Additional API cost
  - May miss some important words

#### B. Frequency-Based Selection
```typescript
function selectByFrequency(words: TokenizedWord[], maxWords: number = 30): TokenizedWord[] {
    const wordFrequency = new Map<string, number>();
    
    // Count word frequency
    words.forEach(word => {
        const key = word.lemma;
        wordFrequency.set(key, (wordFrequency.get(key) || 0) + 1);
    });
    
    // Sort by frequency and select top N
    return Array.from(wordFrequency.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, maxWords)
        .map(([lemma, freq]) => ({
            lemma,
            frequency: freq,
            // ... other properties
        }));
}
```

#### C. Difficulty-Based Selection
- Use Korean word frequency database
- Select words based on difficulty level
- Pros:
  - More targeted learning
  - Appropriate difficulty level
- Cons:
  - Requires maintaining word frequency database
  - May miss context-specific important words

#### D. Hybrid Approach
```typescript
interface WordScore {
    word: string;
    frequency: number;
    difficulty: number;
    importance: number; // AI-generated score
}

function calculateWordScore(word: WordScore): number {
    return (
        word.frequency * 0.4 +
        (1 - word.difficulty) * 0.3 +
        word.importance * 0.3
    );
}
```

### 3. Implementation Plan

1. **Phase 1: Basic Implementation**
   - Implement frequency-based selection
   - Add basic Korean text tokenization
   - Filter out common particles and auxiliary verbs

2. **Phase 2: Enhanced Processing**
   - Integrate Korean NLP tools
   - Add dictionary form extraction
   - Implement difficulty-based filtering

3. **Phase 3: Advanced Features**
   - Add AI-powered importance scoring
   - Implement hybrid selection approach
   - Add user customization options

## Integration with Current Pipeline

1. **New Microservice Structure**
```
backend/
  services/
    korean-text/
      processor.ts
      tokenizer.ts
      wordSelector.ts
      types.ts
```

2. **Pipeline Integration**
```typescript
// Current flow
OCR -> Text Grouping -> Translation -> Anki Package

// Enhanced flow
OCR -> Text Grouping -> Korean Text Processing -> Word Selection -> Translation -> Anki Package
```

## Future Considerations

1. **Performance Optimization**
   - Batch processing for large texts
   - Caching of processed results
   - Parallel processing of word selection

2. **User Customization**
   - Allow users to set word limits
   - Customize selection criteria
   - Save user preferences

3. **Learning Analytics**
   - Track word difficulty
   - Monitor learning progress
   - Adjust selection based on user performance

## Next Steps

1. Implement basic frequency-based selection
2. Add Korean text tokenization
3. Test with sample webtoon content
4. Gather user feedback
5. Iterate on selection criteria

## References

- [KoNLPy Documentation](https://konlpy.org/en/latest/)
- [Mecab-ko Documentation](https://bitbucket.org/eunjeon/mecab-ko)
- [Korean Word Frequency Database](https://www.krdict.kr/) 