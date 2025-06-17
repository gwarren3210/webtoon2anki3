# Frontend Implementation Details

## Overview
This document details the frontend implementation of the Webtoon2Anki application, focusing on the user interface, state management, and integration with backend services.

## 1. Core Components

### ImageUpload
- Handles file selection and validation
- Supports multiple image formats (PNG, JPG, JPEG, WEBP)
- Provides drag-and-drop functionality
- Shows upload progress and preview

### ProcessingStatus
- Displays current processing stage
- Shows progress percentage
- Handles error states
- Provides retry functionality

### AnkiPreview
- Displays generated flashcards
- Supports card flipping
- Allows card editing
- Configurable front/back display

### DebugViewer
- Shows processing results
- Displays OCR output
- Shows translation results
- Helps with troubleshooting

## 2. State Management

### Processing States
```typescript
type ProcessingStage = 
  | 'ocr'
  | 'grouping'
  | 'dialogue'
  | 'wordlist'
  | 'complete'
  | 'error'
  | 'loading_saved';
```

### Data Structures
```typescript
interface ProcessingResults {
  ocrResults?: OcrResult[];
  groupedResults?: OcrLineResult[];
  wordListResults?: WordInfo[];
  error?: string;
}

interface WordInfo {
  korean: string;
  english: string;
  importanceScore: number;
}
```

## 3. Service Integration

### WebtoonProcessingService
- Orchestrates the processing pipeline
- Handles API calls to backend services
- Manages state updates
- Provides progress callbacks

### AnkiService
- Creates Anki packages
- Handles download functionality
- Manages card configuration
- Provides test functionality

## 4. User Interface

### Layout
- Responsive design
- Mobile-friendly interface
- Clear visual hierarchy
- Intuitive navigation

### Features
- Image upload with preview
- Processing status display
- Card preview and editing
- Download functionality
- Settings configuration

## 5. Error Handling

### Validation
- File type validation
- Size limits
- Required fields
- Format checking

### Error Recovery
- Automatic retry
- Manual retry option
- Clear error messages
- State recovery

## 6. Configuration

### Card Settings
```typescript
interface CardConfig {
  front_fields: string[];
  back_fields: string[];
  create_duplicate: boolean;
}
```

### Processing Options
- Language selection
- Word count limits
- Importance thresholds
- Output format

## 7. Performance Considerations

### Optimization
- Lazy loading
- Image compression
- Caching
- Batch processing

### Resource Management
- Memory usage
- Network requests
- File handling
- State cleanup

## 8. Testing

### Unit Tests
- Component testing
- Service testing
- State management
- Error handling

### Integration Tests
- API integration
- User flows
- Error scenarios
- Performance testing

## 9. Future Enhancements

### Planned Features
- Batch processing
- Custom templates
- Progress saving
- User preferences

### UI Improvements
- Dark mode
- Accessibility
- Animations
- Responsive design

## 10. Development Guidelines

### Code Style
- TypeScript strict mode
- ESLint configuration
- Prettier formatting
- Component structure

### Best Practices
- Error boundaries
- Loading states
- Type safety
- Documentation 