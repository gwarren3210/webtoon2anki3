# Next Chat Context - Image Processor Endpoint

This document provides context for the next conversation related to the image processor Encore endpoint.

## Current Status

- A new Encore service `image-processor` has been created with a raw POST endpoint `/process-image` for image uploads.
- The `/process-image` endpoint utilizes the `processWebtoonImage` function from `backend/services/main.ts` to perform the image processing pipeline (OCR, grouping, translation, Anki package creation).
- The endpoint handles temporary file creation and cleanup for the uploaded image.
- Language parameters (`sourceLang` and `targetLang`) are read from query parameters.
- The OCR API key is expected to be provided via the `OCR_API_KEY` environment variable.
- Test public endpoints (`/hello` and `/test-post`) have been added to the `image-processor` service and are confirmed to be visible in the Encore Development Dashboard when `encore run` is properly started.

## Outstanding Items / Potential Next Steps

- **Testing the `/process-image` endpoint:** Verify that the endpoint correctly accepts image uploads, processes them using the `processWebtoonImage` function, and returns a valid `.apkg` file.
- **Handling different image formats:** Currently, the code assumes a `.jpg` extension for the temporary file. This might need to be adjusted to handle various image formats (e.g., PNG, etc.) by inspecting the uploaded file's MIME type.
- **Error Handling:** Enhance error handling within the `imageProcessor.ts` endpoint for more specific error responses to the client.
- **API Key Management:** Review and finalize the secure management of the OCR API key (e.g., using Encore's built-in secrets management if not already fully implemented). The current code reads from `process.env`, which is standard, but ensuring the secret is properly configured in Encore is important for deployment.
- **Progress indication:** For large images or long processing times, consider adding some form of progress indication to the client.
- **Asynchronous Processing:** For very long-running tasks, consider offloading the image processing to a background job or worker to avoid tying up the HTTP request thread.
- **Input Validation:** Implement more robust validation for the input image file (size, type, etc.) beyond the basic check for no image data.

## Context for Next Chat

The next conversation can focus on any of the outstanding items listed above, or address any issues encountered during testing of the `/process-image` endpoint. We have a functional endpoint structure, and the next steps involve refining its robustness, error handling, and potentially optimizing for larger inputs. 