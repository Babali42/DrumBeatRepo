# Contributing to Drum Beat Repository 🥁

Thank you for your interest in contributing! Whether you're a musician, developer, or designer — there's a place for you here. This guide will help you get set up and make your first contribution.
 
---

## Table of Contents

- [Ways to Contribute](#ways-to-contribute)
- [Setup](#setup)
- [Running the App](#running-the-app)
- [Testing](#testing)
- [Code Coverage](#code-coverage)
- [Architecture](#architecture)
- [Submitting a Contribution](#submitting-a-contribution)
---

## Ways to Contribute

### Fix or improve something
Browse the [open issues](https://github.com/Babali42/DrumBeatRepo/issues) — there's something for everyone: code, music patterns, design, and small improvements. Issues labeled [`good first issue`](https://github.com/Babali42/DrumBeatRepo/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22) are a great place to start.

### Add a new drum beat
1. Find a music genre or subgenre not already in the library.
2. Either:
    - Add the genre name to [this issue](https://github.com/Babali42/DrumBeatRepo/issues/270) and the maintainer will handle it, or
    - Follow the steps in that same issue to implement it yourself and open a Pull Request.
---

## Setup

You can develop locally on your machine or in the cloud using GitHub Codespaces.

### Requirements

- [Node.js and NPM](https://nodejs.org/en/download)
### Local setup

```bash
git clone https://github.com/Babali42/DrumBeatRepo.git
cd frontend/
npm install
```

### GitHub Codespaces setup

[Create a Codespace](https://docs.github.com/en/codespaces/developing-in-a-codespace/creating-a-codespace-for-a-repository) from the repository, then add the following to `frontend/karma.conf.js` to run tests in a headless browser:

```json
customLaunchers: {
  ChromeHeadlessNoSandbox: {
    base: 'ChromeHeadless',
    flags: ['--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage']
  }
},
browsers: ['ChromeHeadlessNoSandbox'],
```
 
---

## Running the App

```bash
npm start
```

The app will be available at `http://localhost:4200` by default.
 
---

## Testing

This project uses three test suites. Please make sure all of them pass before opening a Pull Request.

### Angular component tests (Karma)

Unit tests for Angular components:

```bash
npm test
```

### Pure TypeScript tests (Vitest)

Tests for isolated TypeScript logic:

```bash
npm vitest
```

### Architecture tests (Jest)

These tests enforce the hexagonal architecture — specifically, that the **domain layer remains independent** of external concerns:

```bash
npm test-jest
```
 
---

## Code Coverage

To generate a code coverage report locally:

```bash
ng test --code-coverage
```

Coverage results are also tracked automatically on [codecov.io](https://app.codecov.io/github/Babali42/DrumBeatRepo).
 
---

## Architecture

This project follows **hexagonal architecture** (also known as ports and adapters). The core principle is that the domain layer must stay independent — it should not depend on frameworks, the UI, or infrastructure code.

The architecture tests (`npm test-jest`) are there to catch any accidental leakage across boundaries. If you're adding new code, keep business logic in the domain and wire things up through the appropriate ports.
 
---

## Submitting a Contribution

1. Fork the repository and create a branch from `main`.
2. Make your changes and ensure all three test suites pass.
3. Open a Pull Request with a clear description of what you changed and why.
   Please follow the project's [Code of Conduct](./CODE_OF_CONDUCT.md) in all interactions.

---

## License

By contributing, you agree that your contributions will be licensed under the same terms as the project:

- **Code**: [GNU General Public License v3.0](./LICENSE)
- **Non-code content** (beats, UI concepts, etc.): [Creative Commons Attribution-ShareAlike 4.0](https://creativecommons.org/licenses/by-sa/4.0/)