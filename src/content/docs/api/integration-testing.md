---
title: Integration Testing
description: Overview of integration testing for Quizfreely's API.
---

This document outlines the integration testing suite for the QuizFreely API, covering setup, execution, and CI integration.

## Overview

The integration tests verify the end-to-end functionality of the API, simulating real HTTP requests and validating database interactions. They are located in the `quizfreely/api/tests/` directory.

### Key Components

1.  **Database Management (Testcontainers)**:
    -   The tests rely on a dedicated PostgreSQL instance managed by [Testcontainers for Go](https://golang.testcontainers.org/).
    -   During the test setup (`TestMain` in `integration_test.go`), a Docker container running PostgreSQL is spun up.
    -   Database migrations are automatically applied using `dbmate` to ensure the schema matches the production definition.
    -   The container is shared across all tests within the package for efficiency, meaning all tests run against the same database instance.

2.  **In-Process API Execution**:
    -   The API server itself does not run as a separate binary. Instead, it is instantiated directly within the test process using `server.NewRouter(dbPool)`.
    -   An `httptest.NewServer` instance hosts this router, allowing tests to make standard HTTP calls to a local ephemeral port.
    -   This approach simplifies debugging and ensures the exact same router logic used in production is tested.

3.  **Test Execution**:
    -   Tests are written using the standard `testing` package and `testify/require` for assertions.
    -   The `TestMain` function orchestrates the entire lifecycle: starting the container, running migrations, executing all tests via `m.Run()`, and finally cleaning up resources.

## Running Tests Locally

To run the integration tests on your local machine, ensure you have Docker running (required for Testcontainers) and execute:

```bash
# From the quizfreely/api directory
go test -v ./tests/...
```

## Continuous Integration (CI)

The integration tests are also run in GitHub Actions, defined in `.github/workflows/integration-tests.yml` in `quizfreely/api`.

It runs the tests the same way you would locally, and with `gotestfmt` for more pretty output. They're not fully automated or anything we trigger/run them "manually" with "workflow-dispatch" when we want to test.
