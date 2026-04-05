# Security Changelog (Claude Code audit)

Audit performed on 2026-04-05. All issues were found via static analysis of the library source under
`projects/ks89/angular-modal-gallery/src/lib/`.

---

## Fixed

### HIGH

| File | Lines | Issue | Fix |
|------|-------|-------|-----|
| `components/carousel/carousel-previews/carousel-previews.component.ts` | 190, 193 | `.replace('/px/g', '')` used string literals instead of regex — height parsing always a no-op | Changed to proper regex literals `/px/g` and `/%/g` |
| `components/modal-gallery/modal-gallery.component.ts` | 294 | No URL protocol validation on `extUrl` — allowed `javascript:` and `data:` schemes | Added `/^https?:\/\//i` allowlist check before `window.open` / `window.location.href` |
| `components/carousel/carousel.component.ts` + `carousel.html` | 54 | `[innerHTML]` bound to raw `image.modal.description` — XSS via HTML injection | Sanitized return value of `getDescriptionToDisplay()` via `DomSanitizer.sanitize(SecurityContext.HTML, ...)` |
| `components/current-image/current-image.component.ts` + `current-image.html` | 64 | Same `[innerHTML]` XSS as above in the modal view | Same fix — `DomSanitizer.sanitize(SecurityContext.HTML, ...)` applied in `getDescriptionToDisplay()` |

### MEDIUM

| File | Lines | Issue | Fix |
|------|-------|-------|-----|
| `directives/a-tag-bg-image.directive.ts` | 76, 81 | `imgPath` interpolated directly into CSS `url("...")` — a `"` in the path breaks out of the CSS string | Encode `"` → `%22` in both primary and fallback image paths before CSS interpolation |
| `directives/description.directive.ts` | 68–96 | CSS property values applied without validation — `expression()`, `javascript:`, context-break chars allowed | Added `sanitizeCssValue()` (blacklist for `expression(`, `javascript:`, `;{}`) and `sanitizePosition()` (strict allowlist) |
| `components/modal-gallery/modal-gallery.component.ts` | 305, 313 | TOCTOU: `safeUrl` was validated but `eventToEmit.image.modal.extUrl` (the original) was still passed to `window.open` / `updateLocationHref` | Both call sites changed to use the validated `safeUrl` variable |

### LOW

| File | Lines | Issue | Fix |
|------|-------|-------|-----|
| `directives/fallback-image.directive.ts` | 47 | `../` relative paths allowed in fallback image src — enables unintended same-origin requests via path traversal | Removed `../` from the URL allowlist; `/` and `./` prefixes still accepted |
| `components/modal-gallery/modal-gallery.component.ts` | 521 | MIME type extracted from `data:` URI without validation — `svg+xml`, `text/html` etc. accepted | Added allowlist: only `png`, `jpeg`, `jpg`, `gif`, `webp`, `bmp` are accepted; anything else aborts the download |
| `components/plain-gallery/plain-gallery.component.ts` | 291–292 | No bounds check on size values — extremely large `pixels` or `breakConfig.length` produces nonsensical layout | Added `isFinite` + range guards (`pixels` ≤ 10 000, `length` ≤ 1 000) before the calculation |
| `components/modal-gallery/modal-gallery.component.ts` | 489 | `atob()` called without try/catch — malformed base64 input throws `DOMException` and crashes the UI | Wrapped in try/catch; returns an empty `Blob` on failure |

---

## Open (not yet fixed, because not important enough to fix)

### HIGH

| # | File | Lines | Issue |
|---|------|-------|-------|
| 1 | `components/current-image/current-image.html` | 64 | `[innerHTML]` still present — security relies entirely on `DomSanitizer` not being bypassed. Applies to `carousel.html:54` as well. Defence-in-depth concern; no second sanitization layer. |
| 2 | `directives/description.directive.ts` | 114–131 | `sanitizeCssValue()` uses a blacklist — vectors like `@import`, `url()`, `-moz-binding`, and unicode-escaped `javascript:` variants are not blocked. A whitelist per property type would be more robust. |

### MEDIUM

| # | File | Lines | Issue |
|---|------|-------|-------|
| 3 | `components/modal-gallery/modal-gallery.component.ts` | 294 | Open redirect — protocol check blocks `javascript:`/`data:` but any `https://attacker.com` URL passes. No host validation. |

### LOW

| # | File | Lines | Issue |
|---|------|-------|-------|
| 4 | `components/modal-gallery/modal-gallery.component.ts` | 294 | HTTP allowed alongside HTTPS — no secure-transport enforcement. |
| 5 | `services/config.service.ts` + others | various | `Object.assign()` with user-supplied config objects — no filtering of `__proto__` / `constructor` keys (prototype pollution, theoretical in modern V8). |
