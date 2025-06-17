# System Architecture Diagram

## Overview
This document provides a visual representation of the Webtoon2Anki system architecture using Mermaid.js diagrams.

## System Components

```mermaid
graph TB
    subgraph Frontend
        UI[User Interface]
        State[State Management]
        Services[Frontend Services]
    end

    subgraph Backend
        API[API Gateway]
        
        subgraph Microservices
            OCR[OCR Service]
            Trans[Translation Service]
            Anki[Anki Package Service]
        end
        
        subgraph External Services
            GCV[Google Cloud Vision]
            Papago[Papago API]
            AnkiConnect[AnkiConnect]
        end
    end

    subgraph Storage
        Cache[Cache Service]
        DB[(Database)]
        Storage[Cloud Storage]
    end

    %% Frontend Connections
    UI --> State
    State --> Services
    Services --> API

    %% Backend Connections
    API --> OCR
    API --> Trans
    API --> Anki
    
    %% Microservice Connections
    OCR --> GCV
    Trans --> Papago
    Anki --> AnkiConnect
    
    %% Storage Connections
    OCR --> Cache
    Trans --> Cache
    Anki --> Storage
    API --> DB
```

## Data Flow

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant API
    participant OCR
    participant Trans
    participant Anki
    participant Storage

    User->>Frontend: Upload Image
    Frontend->>API: Send Image
    API->>OCR: Process Image
    OCR->>Storage: Store Results
    OCR-->>API: Return Text
    API->>Trans: Translate Text
    Trans->>Storage: Cache Translations
    Trans-->>API: Return Translations
    API->>Anki: Create Package
    Anki->>Storage: Store Package
    Anki-->>API: Return Package
    API-->>Frontend: Send Package
    Frontend-->>User: Download Package
```

## Service Dependencies

```mermaid
graph LR
    subgraph Dependencies
        direction TB
        A[Frontend] --> B[API Gateway]
        B --> C[OCR Service]
        B --> D[Translation Service]
        B --> E[Anki Service]
        C --> F[Google Cloud Vision]
        D --> G[Papago API]
        E --> H[AnkiConnect]
    end
```

## Deployment Architecture

```mermaid
graph TB
    subgraph Google Cloud
        direction TB
        A[Cloud Run] --> B[Container Registry]
        A --> C[Cloud Storage]
        A --> D[Cloud SQL]
        A --> E[Cloud Monitoring]
    end

    subgraph External Services
        direction TB
        F[Google Cloud Vision]
        G[Papago API]
        H[AnkiConnect]
    end

    A --> F
    A --> G
    A --> H
```

## Component Details

### Frontend Components
```mermaid
graph TB
    subgraph Frontend Components
        direction TB
        A[ImageUpload] --> B[ProcessingStatus]
        B --> C[AnkiPreview]
        C --> D[DebugViewer]
        E[Settings] --> A
        E --> B
        E --> C
    end
```

### Backend Services
```mermaid
graph TB
    subgraph Backend Services
        direction TB
        A[API Gateway] --> B[OCR Service]
        A --> C[Translation Service]
        A --> D[Anki Service]
        B --> E[Image Processing]
        B --> F[Text Extraction]
        C --> G[Translation Queue]
        C --> H[Cache Management]
        D --> I[Package Generation]
        D --> J[Template Management]
    end
```

## Error Handling Flow

```mermaid
graph TB
    subgraph Error Handling
        direction TB
        A[Error Detection] --> B{Error Type}
        B -->|API Error| C[API Error Handler]
        B -->|Service Error| D[Service Error Handler]
        B -->|External Error| E[External Error Handler]
        C --> F[Error Response]
        D --> F
        E --> F
        F --> G[User Notification]
    end
```

## Security Architecture

```mermaid
graph TB
    subgraph Security
        direction TB
        A[API Gateway] --> B[Authentication]
        A --> C[Authorization]
        B --> D[Token Validation]
        C --> E[Access Control]
        D --> F[User Session]
        E --> F
    end
``` 