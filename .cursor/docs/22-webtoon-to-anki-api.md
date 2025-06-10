# Webtoon to Anki API Documentation

## Overview
This API service converts webtoon images into Anki flashcards. The process involves several steps: Optical Character Recognition (OCR), text grouping, translation, and Anki package creation. Each step is implemented as a separate microservice, allowing for modular processing and scalability.

## Base URL
```
https://staging-backend-dnz2.encr.app
```

## API Endpoints

### 1. OCR Service
Extracts text from webtoon images using OCR technology.

**Endpoint:** `/ocr`  
**Method:** `POST`  
**Content-Type:** `multipart/form-data`

**Input:**
- `file`: Image file (jpg/png)

**Output:** `OcrResult[]`
```typescript
{
  text: string,
  confidence: number,
  boundingBox: {
    x: number,
    y: number,
    width: number,
    height: number
  }
}[]
```

### 2. Text Grouping Service
Groups OCR results into meaningful text chunks based on spatial relationships.

**Endpoint:** `/group-text`  
**Method:** `POST`  
**Content-Type:** `application/json`

**Input:** `OcrResult[]`
```typescript
{
  text: string,
  confidence: number,
  boundingBox: {
    x: number,
    y: number,
    width: number,
    height: number
  }
}[]
```

**Output:** `OcrLineResult[]`
```typescript
{
  text: string,
  confidence: number,
  boundingBox: {
    x: number,
    y: number,
    width: number,
    height: number
  }
}[]
```

### 3. Translation Service
Translates grouped text from source language to target language.

**Endpoint:** `/translate`  
**Method:** `POST`  
**Content-Type:** `application/json`

**Input:**
```typescript
{
  text: OcrLineResult[],
  sourceLang: string, // optional, defaults to 'ko'
  targetLang: string  // optional, defaults to 'en'
}
```

**Output:** `TranslatedWordInfo[]`
```typescript
{
  original: string,
  translated: string,
  context: string,
  imageUrl?: string
}[]
```

### 4. Anki Package Creation Service
Creates an Anki package (.apkg) file from translated text.

**Endpoint:** `/create-anki-package`  
**Method:** `POST`  
**Content-Type:** `application/json`

**Input:** `TranslatedWordInfo[]`
```typescript
{
  original: string,
  translated: string,
  context: string,
  imageUrl?: string
}[]
```

**Output:**
- Content-Type: `application/octet-stream`
- Content-Disposition: `attachment; filename="output.apkg"`
- Body: `ArrayBuffer` (Anki package file)

## Process Flow
1. Upload webtoon image to OCR service
2. Send OCR results to text grouping service
3. Send grouped text to translation service
4. Send translated text to Anki package creation service
5. Download the resulting .apkg file

## Error Handling
All endpoints return appropriate HTTP status codes:
- `200`: Success
- `400`: Bad Request (missing/invalid input)
- `500`: Internal Server Error

Error responses include a message describing the error:
```json
{
  "error": "Error message description"
}
```

## Example Usage

### 1. OCR Process
```bash
curl -X POST https://staging-backend-dnz2.encr.app/ocr \
  -F "file=@webtoon-image.jpg"
```

### 2. Text Grouping
```bash
curl -X POST https://staging-backend-dnz2.encr.app/group-text \
  -H "Content-Type: application/json" \
  -d @ocr-results.json
```

### 3. Translation
```bash
curl -X POST https://staging-backend-dnz2.encr.app/translate \
  -H "Content-Type: application/json" \
  -d '{
    "text": [...],
    "sourceLang": "ko",
    "targetLang": "en"
  }'
```

### 4. Anki Package Creation
```bash
curl -X POST https://staging-backend-dnz2.encr.app/create-anki-package \
  -H "Content-Type: application/json" \
  -d @translated-text.json \
  --output output.apkg
```

## Notes
- The API is designed to handle Korean webtoons by default (source language: 'ko')
- Translation is optimized for Korean to English conversion
- The OCR service requires an API key for operation
- All services maintain type safety throughout the pipeline
- The final Anki package can be imported directly into Anki desktop or mobile applications 

## Environment Configuration

The OCR service requires an API key to be configured in the Encore environment. This is done through Encore's environment configuration, not through request headers.

### Setting up OCR API Key in Encore

1. In your Encore project, create or update the environment configuration:
   ```bash
   encore env set OCR_API_KEY your-ocr-api-key
   ```

2. Verify the environment variable is set:
   ```bash
   encore env list
   ```

The OCR service will automatically use this environment variable - no need to pass it in the requests.

## Postman Collection

You can import the following collection into Postman to test all endpoints:

```json
{
  "info": {
    "name": "Webtoon to Anki API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "OCR Process",
      "request": {
        "method": "POST",
        "header": [],
        "body": {
          "mode": "formdata",
          "formdata": [
            {
              "key": "file",
              "type": "file",
              "src": "/path/to/webtoon-image.jpg"
            }
          ]
        },
        "url": {
          "raw": "{{baseUrl}}/ocr",
          "protocol": "https",
          "host": ["{{baseUrl}}"],
          "path": ["ocr"]
        }
      }
    },
    {
      "name": "Text Grouping",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"text\": \"Sample text\",\n  \"confidence\": 0.95,\n  \"boundingBox\": {\n    \"x\": 100,\n    \"y\": 100,\n    \"width\": 200,\n    \"height\": 50\n  }\n}"
        },
        "url": {
          "raw": "https://staging-backend-dnz2.encr.app/group-text",
          "protocol": "https",
          "host": ["staging-backend-dnz2", "encr", "app"],
          "path": ["group-text"]
        }
      }
    },
    {
      "name": "Translation",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"text\": [\n    {\n      \"text\": \"안녕하세요\",\n      \"confidence\": 0.95,\n      \"boundingBox\": {\n        \"x\": 100,\n        \"y\": 100,\n        \"width\": 200,\n        \"height\": 50\n      }\n    }\n  ],\n  \"sourceLang\": \"ko\",\n  \"targetLang\": \"en\"\n}"
        },
        "url": {
          "raw": "https://staging-backend-dnz2.encr.app/translate",
          "protocol": "https",
          "host": ["staging-backend-dnz2", "encr", "app"],
          "path": ["translate"]
        }
      }
    },
    {
      "name": "Create Anki Package",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "[\n  {\n    \"original\": \"안녕하세요\",\n    \"translated\": \"Hello\",\n    \"context\": \"Greeting\",\n    \"imageUrl\": \"https://example.com/image.jpg\"\n  }\n]"
        },
        "url": {
          "raw": "https://staging-backend-dnz2.encr.app/create-anki-package",
          "protocol": "https",
          "host": ["staging-backend-dnz2", "encr", "app"],
          "path": ["create-anki-package"]
        }
      }
    }
  ]
}
```

### Testing Steps

1. **OCR Process**
   - Import the collection into Postman
   - Set up the environment variable:
     - `baseUrl`: https://staging-backend-dnz2.encr.app
   - Select the "OCR Process" request
   - In the "Body" tab, select "form-data"
   - Add a file with key "file" and select your webtoon image
   - Send the request
   - Expected response: Array of OCR results with text and bounding boxes

2. **Text Grouping**
   - Use the OCR results from the previous step
   - Select the "Text Grouping" request
   - In the "Body" tab, paste the OCR results array
   - Send the request
   - Expected response: Grouped text results

3. **Translation**
   - Use the grouped text results from the previous step
   - Select the "Translation" request
   - In the "Body" tab, paste the grouped text array
   - Optionally modify sourceLang and targetLang
   - Send the request
   - Expected response: Array of translated word information

4. **Create Anki Package**
   - Use the translated results from the previous step
   - Select the "Create Anki Package" request
   - In the "Body" tab, paste the translated word information array
   - Send the request
   - Expected response: Binary .apkg file

### Environment Variables

For easier testing, you can set up the following environment variables in Postman:

```json
{
  "id": "webtoon-to-anki-env",
  "name": "Webtoon to Anki Environment",
  "values": [
    {
      "key": "baseUrl",
      "value": "https://staging-backend-dnz2.encr.app",
      "enabled": true
    },
    {
      "key": "ocrApiKey",
      "value": "your-ocr-api-key",
      "enabled": true
    }
  ]
}
```

Then update the request URLs to use `{{baseUrl}}` instead of the hardcoded URL. 