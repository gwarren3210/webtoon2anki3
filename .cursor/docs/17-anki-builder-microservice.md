# Task 17: Anki Builder Microservice

This document summarizes the implementation of a microservice to generate Anki flashcard packages (`.apkg`) from `TranslatedWordInfo` data.

## Approach

The microservice is built using Python with the Flask web framework and the `genanki` library for creating Anki packages. It is containerized using Docker and planned for deployment on Google Container Registry (GCR).

## Files Created

- `backend/services/anki/ankiBuilderService.py`: Contains the Flask application, the Anki model and deck definitions, the logic for building the `.apkg` file, and the `/build-package` POST endpoint.
- `backend/services/anki/requirements.txt`: Lists the Python dependencies (`Flask`, `gunicorn`, `genanki`).
- `backend/services/anki/Dockerfile`: Defines the steps to build the Docker image for the microservice.

## How to Build and Run Locally (with Docker)

1.  Navigate to the microservice directory:
    ```bash
    cd backend/services/anki
    ```
2.  Build the Docker image:
    ```bash
    docker build -t anki-builder .
    ```
3.  Run the Docker container, mapping a local port (e.g., 8080) to the container's internal port 5000:
    ```bash
    docker run -p 6001:5000 anki-builder
    ```
    Ensure port 6001 is available on your machine or choose a different available port.

## How to Test the Endpoint

Once the Docker container is running, you can send a POST request to the `/build-package` endpoint with `TranslatedWordInfo` data.

- **Endpoint URL:** `http://localhost:8080/build-package` (replace 8080 if you used a different port)
- **Method:** POST
- **Content-Type:** `application/json`
- **Request Body:** A JSON array of `TranslatedWordInfo` objects (e.g., the sample data used previously).

Example using `curl` (save JSON data to `test_data.json`):
```bash
curl -X POST -H "Content-Type: application/json" -d @test_data.json http://localhost:6001/build-package --output webtoon_anki_package.apkg
```

Example using Postman: Set up a POST request to the URL, go to the Body tab, select 'raw', choose 'JSON', and paste the JSON data.

## Deployment to GCR

To upload the image to GCR, you need the Google Cloud SDK installed and configured.

1.  Tag the image with your GCP project ID:
    ```bash
    docker tag anki-builder gcr.io/[YOUR_GCP_PROJECT_ID]/anki-builder:latest
    ```
2.  Authenticate Docker with gcloud:
    ```bash
    gcloud auth configure-docker
    ```
3.  Push the image to GCR:
    ```bash
    docker push gcr.io/[YOUR_GCP_PROJECT_ID]/anki-builder:latest
    ```

This microservice provides a dedicated service for Anki package generation, separating this concern from other parts of the application. 