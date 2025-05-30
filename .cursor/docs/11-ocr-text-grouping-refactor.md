---
description:
globs:
alwaysApply: false
---
# 11 - OCR Text Grouping Refactor: Context and Process

## Context

This conversation focused on refactoring the existing OCR implementation, specifically the part responsible for processing and grouping text results from image tiles. The goal was to improve the organization, maintainability, and accuracy of the text grouping logic.

The initial OCR implementation used the `ocr-space-api-wrapper` and had some basic tiling logic in `backend/services/ocr-api/smartOcrProcessor.ts`. The text merging and coordinate adjustment for tiles were identified as areas needing refinement, and the need for a dedicated service for text grouping became apparent.

## Problem

The primary problem was the lack of a dedicated, robust mechanism for grouping individual OCR text results (words or small phrases with bounding boxes) into logical lines or blocks (like speech bubbles), especially when dealing with results from overlapping image tiles. The existing approach for merging text from tiles was basic and needed improvement for correct text ordering and accurate combined bounding boxes.

## Goal

The main goal was to create a separate, testable service for text grouping and implement refined logic for grouping text based on spatial proximity (bounding boxes) and correctly ordering text within those groups, accounting for potential variations in vertical alignment.

## Steps Taken

1.  **Identified Next Steps from `OCR-TASKS.md`**: Reviewed the existing task list to prioritize the refinement of OCR implementation, particularly text merging and error handling.
2.  **Developed Initial Grouping Logic**: Based on a user-provided example, implemented core functions for grouping text by vertical proximity (`groupTextByProximity`), sorting text horizontally within groups (`sortGroupByHorizontalPosition`), combining text (`combineTextInGroup`), and calculating combined bounding boxes (`calculateCombinedBoundingBox`). These were initially placed in `backend/services/ocr-api/ocrApiUtils.ts`.
3.  **Created New Service**: Decided to move the grouping logic to a new dedicated service for better separation of concerns. Created the `backend/services/text-grouper` directory.
4.  **Moved Grouping Functions**: Transferred the grouping and bounding box calculation functions to `backend/services/text-grouper/textGrouper.ts` and created an `index.ts` to export them.
5.  **Cleaned Up Old File**: Attempted to remove the moved functions from `backend/services/ocr-api/ocrApiUtils.ts`. (Note: Encountered technical difficulties with the tool for complete removal, required manual intervention).
6.  **Updated Imports**: Modified `backend/services/ocr-api/smartOcrProcessor.ts` to import the grouping functions from the new `text-grouper` service.
7.  **Defined New Type**: Created a new TypeScript type `OcrLineResult` in `backend/services/ocr-api/types.ts` to represent the output format of the grouped text (a line of text with a combined bounding box).
8.  **Created Processing Function**: Implemented the `processAndGroupOcrResults` function in `backend/services/text-grouper/textGrouper.ts` to orchestrate the grouping, combining, and bounding box calculation, returning `OcrLineResult` objects.
9.  **Developed Unit Tests**: Created `backend/services/text-grouper/test/textGrouper.test.ts` and added test cases for `processAndGroupOcrResults` and the individual utility functions. Also added a test to process sample data from `ocrOutputSample.json` and output the results to a new JSON file.
10. **Troubleshooted Tests**: Resolved issues with Jest configuration not finding the new test file and fixed a test failure related to the horizontal sorting logic.
11. **Refined Sorting Logic**: Improved `sortGroupByHorizontalPosition` to use a vertical tolerance based on the median text height within a group to handle minor vertical alignment variations and ensure correct horizontal text ordering.
