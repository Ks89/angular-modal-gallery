# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

@ks89/angular-modal-gallery is an Angular 21 library for creating image galleries (modal, plain/thumbnail grid, carousel). It's SSR-compatible, accessible, and published to npm. The library lives in a monorepo alongside a demo app and three example projects.

## Build Commands

```bash
# Build library (must be built first — demo app imports from dist/)
npm run build:lib

# Build demo app (requires library built first)
npm run build:main

# Build everything (library + demo + examples)
npm run build:all

# Dev server for demo app
npm start

# Watch mode for library development
npm run build:lib:watch
```

## Testing

```bash
# Run unit tests (single run, ChromeHeadless)
npm test

# Run tests in watch mode
npm run test:watch
```

Tests use Karma + Jasmine. Test files are co-located with source files in `projects/ks89/angular-modal-gallery/src/lib/`. Coverage output goes to `coverage/ks89/angular-modal-gallery/`.

## Code Formatting

Prettier is enforced via a Husky pre-commit hook (`pretty-quick --staged`). Key settings: single quotes, no trailing commas, 155 char print width, 2-space indent, arrow parens "avoid".

## Repository Structure

```
projects/ks89/angular-modal-gallery/   # THE LIBRARY (published to npm)
  src/lib/
    components/    # modal-gallery, plain-gallery, carousel, upper-buttons,
                   #   current-image, dots, previews, accessible
    directives/    # click-outside, keyboard-navigation, swipe, direction,
                   #   fallback-image, a-tag-bg-image, size, margin, wrap
    model/         # Interfaces and enums (Image, Action, config types)
    services/      # ConfigService, IdValidatorService
    utils/         # Image and user-input utilities
  src/public-api.ts  # Public exports — all library API surfaces

src/                 # Demo application (showcases the library)
examples/            # Three example projects (angular-cli-21, angular-cli-material, universal)
```

## Architecture

- **Standalone components** pattern — the `GalleryModule` imports CommonModule and CDK OverlayModule
- `ModalGalleryComponent` uses `@angular/cdk` Overlay to render the modal as an overlay
- `ModalGalleryService` / `ModalGalleryRef` manage opening/closing the modal programmatically
- `PlainGalleryComponent` and `CarouselComponent` are exported directly for template use
- The demo app's tsconfig maps `@ks89/angular-modal-gallery` to `./dist/ks89/angular-modal-gallery`, so the library must be built before the demo app can run
- Library is packaged with ng-packagr following Angular Package Format

## Key Dependencies

- Angular 21, @angular/cdk (Overlay), RxJS 7.8, zone.js 0.16
- Node >=22.0.0, npm >=10.2.4
- Optional: @fortawesome/fontawesome for icon support

## CI

GitHub Actions (`.github/workflows/main.yml`): installs deps for root + all examples, builds everything, runs tests with retry (3 attempts), uploads coverage to Coveralls.

## Security

A security audit was performed on 2026-04-05. See `CHANGELOG_CLAUDE.md` for the full list of fixed and open issues.

Key security patterns in this codebase:

- **HTML descriptions** — `[innerHTML]` is used intentionally (descriptions may contain HTML markup). Output is sanitized via `DomSanitizer.sanitize(SecurityContext.HTML, ...)` in both `CarouselComponent` and `CurrentImageComponent` before binding. Do not change these to bypass the sanitizer.
- **External URLs** (`extUrl`) — validated with `/^https?:\/\//i` before any navigation. Always use the validated `safeUrl` local variable, never the raw `extUrl` property, at call sites.
- **CSS values** in `DescriptionDirective` — passed through `sanitizeCssValue()` (blocks `expression()`, `javascript:`, context-break chars) and `sanitizePosition()` (strict allowlist). Do not add new `setStyle()` calls without running values through these helpers.
- **Image paths in CSS** (`ATagBgImageDirective`) — double quotes are encoded to `%22` before interpolation into `url("...")` strings to prevent CSS injection.
- **Fallback image URLs** — allowlisted to `https?://`, `/`, and `./` prefixes only. `../` is intentionally excluded.
- **Base64 download** — MIME type is validated against an allowlist (`png`, `jpeg`, `jpg`, `gif`, `webp`, `bmp`) before creating a Blob. `atob()` is wrapped in try/catch.
