# Environment Setup for Python OCR (Docker)

This document summarizes the process and challenges encountered while setting up the Python environment for the OCR and tiling scripts, ultimately utilizing Docker for a stable environment.

## Initial Attempts (Python Virtual Environment)

Initial attempts to set up a Python virtual environment and install `paddleocr` and `Pillow` directly on the Windows system failed due to persistent `ImportError: cannot import name '_imaging' from 'PIL'`. This issue persisted even after reinstalling packages and recreating the virtual environment.

Refactoring `image_tiling.py` to use `opencv-python` instead of Pillow was attempted, but the underlying environment issue with conflicting dependencies (likely related to numpy or core libraries) remained unresolved in the virtual environment.

## Transition to Docker

To bypass the environment issues, we transitioned to using Docker to create a clean and isolated Python environment.

A `Dockerfile` was created in `backend/python/ocr` to:
1.  Use a base Python image.
2.  Set the working directory to `/app`.
3.  Copy the Python scripts into the container.
4.  Install necessary system dependencies for OpenCV.
5.  Install Python packages (`opencv-python`, `paddleocr`) using pip.

## Docker Base Image and Dependency Troubleshooting

Several iterations were required to get the Docker build working correctly:

1.  **Initial Base Image (`python:3.8-slim-buster`)**:
    *   Initial `apt-get` dependencies included `libgl1-mesa-glx libsm6 libxext6 librender1`.
    *   Build failed because `librender1` was not found in the repositories. Corrected `librender1` to `libfontconfig1`.
    *   Still encountered potential dependency issues or conflicts.

2.  **Attempt with Alpine (`python:3.8-alpine`)**:
    *   Switched to Alpine for a smaller image size.
    *   Required different system package manager (`apk`) and different package names (`mesa-gl libsm libxext fontconfig ttf-dejavu`).
    *   Build failed during `pip install` with a "Broken toolchain" error, requiring the addition of build tools (`build-base python3-dev`).
    *   Build still failed with a `shapely` compilation error (`'intp_t' is not a type identifier`), indicating compatibility issues with building complex Python package C extensions on Alpine's minimal environment.

3.  **Return to Debian-based (`python:3.8-slim`)**:
    *   Switched back to a Debian-based slim image (`python:3.8-slim`) for better compatibility with pre-built binaries and standard libraries.
    *   `apt-get` dependencies included `libgl1-mesa-glx libsm6 libxext6 libfontconfig1`.
    *   Build was successful.
    *   Running the `image_tiling.py` script in this container initially failed with `ImportError: libgthread-2.0.so.0`. Added `libglib2.0-0` to the `apt-get` dependencies.
    *   Rebuilding the image and running the script was successful, confirming the environment setup.

## Current State

The Docker environment using the `python:3.8-slim` base image with the necessary `apt-get` dependencies (`libgl1-mesa-glx libsm6 libxext6 libfontconfig1 libglib2.0-0`) and pip installed packages (`opencv-python`, `paddleocr`) is functional and can successfully run the `image_tiling.py` script. This environment will be used for the Python OCR processing steps. 