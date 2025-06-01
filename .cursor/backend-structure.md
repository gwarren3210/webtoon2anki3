# Backend Structure

## Overview
The backend is built using Encore.ts and follows a service-oriented architecture. The main components are organized into services, APIs, and utilities.

## Directory Structure

```
backend/
├── .encore/
├── encore.gen/
├── node_modules/
├── services/
│   ├── anki/
│   │   ├── microservice/
│   │   │   ├── Dockerfile
│   │   │   ├── ankiBuilderService.py
│   │   │   └── requirements.txt
│   │   ├── test/
│   │   │   ├── ankiApiClient.test.d.ts
│   │   │   └── ankiApiClient.test.ts
│   │   ├── ankiApiClient.d.ts
│   │   ├── ankiApiClient.ts
│   │   ├── ankiPackageHandler.d.ts
│   │   └── ankiPackageHandler.ts
│   ├── ocr-api/
│   ├── storage/
│   │   ├── README.md
│   │   ├── index.d.ts
│   │   ├── index.ts
│   │   ├── tempStorageService.d.ts
│   │   ├── tempStorageService.test.d.ts
│   │   ├── tempStorageService.test.ts
│   │   └── tempStorageService.ts
│   ├── text-grouper/
│   │   ├── test/
│   │   │   ├── textGrouper.test.d.ts
│   │   │   └── textGrouper.test.ts
│   │   ├── index.d.ts
│   │   ├── index.ts
│   │   ├── textGrouper.d.ts
│   │   └── textGrouper.ts
│   ├── translation/
│   │   ├── test/
│   │   │   ├── papagoTranslateEngine.test.d.ts
│   │   │   └── papagoTranslateEngine.test.ts
│   │   ├── papago-translate.d.ts
│   │   ├── papagoTranslateEngine.d.ts
│   │   ├── papagoTranslateEngine.ts
│   │   ├── translationEngine.d.ts
│   │   └── translationEngine.ts
│   ├── validation/
│   │   ├── README.md
│   │   ├── fileValidationService.d.ts
│   │   ├── fileValidationService.test.d.ts
│   │   ├── fileValidationService.test.ts
│   │   └── fileValidationService.ts
│   ├── README.md
│   ├── encore.service.ts
│   ├── main.d.ts
│   ├── main.test.ts
│   ├── main.ts
│   ├── testMain.d.ts
│   ├── testMain.ts
│   ├── types.d.ts
│   └── types.ts
├── test-data/
├── tmp/
├── .gitignore
├── encore.app
├── jest.config.cjs
├── package-lock.json
├── package.json
├── README.md
├── tsconfig.json
└── tsconfig.tsbuildinfo
```




