# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

**clini**: a Spanish-language clinic / medical-practice management backoffice — patients, professionals, practices, specialties, healthcares (insurers) and appointments. Built on the Laravel + React starter kit and being brought up to the same engineering workflow as the sibling `fototobares` project (that repo's `.claude/` skills were copied here; its test-suite and CI conventions are being migrated in — see "Migration in progress" below).

- Stack: Laravel 12 (PHP 8.2+; CI/Sail run 8.4) + MySQL 8, Inertia 2 + React 19 + TypeScript, Tailwind 4 + shadcn/ui, Vite 6. [Ziggy](https://github.com/tighten/ziggy) exposes route names to JS via the global `route()`.
- Language split: code, branches, commits and code comments in **English**; UI copy and GitHub PRs/issues/comments always in **Spanish**. App locale is `es` (`Carbon` locale `es`, dates are `CarbonImmutable`).
- No real production yet: migrations are edited in-place and re-run with `migrate:fresh --seed` instead of adding new migration files; bug fixes may be folded into redesigns.

## Environment & commands

Everything runs through Laravel Sail (Docker) — there is **no local PHP**, and a local node breaks the build tooling. **Run composer, artisan and npm through Sail.** (Playwright, once added, runs on the host.)

```bash
./vendor/bin/sail up -d                          # required for everything below (app + MySQL)
./vendor/bin/sail artisan migrate:fresh --seed   # navigable app with demo data
./vendor/bin/sail npm run build                  # production build; or `npm run dev` for HMR (creates public/hot)
composer dev                                      # server + queue + pail logs + vite together
```

App at <http://localhost> (whatever `APP_PORT` is set to locally). `/` is the public welcome page; the login screen is at `/login` and guests hitting authed routes are redirected there. The seed creates `test@example.com` (default factory password `password`).

### Tests

```bash
# Backend — plain PHPUnit (TestCase subclasses, not Pest) run via `php artisan test`.
# In-memory sqlite (phpunit.xml, no MySQL needed); Feature suite uses RefreshDatabase.
./vendor/bin/sail php artisan test
./vendor/bin/sail php artisan test tests/Feature/DashboardTest.php                      # one file
./vendor/bin/sail php artisan test --filter=test_guests_are_redirected_to_the_login_page  # one test
```

Pest is **not** installed (the `pestphp/pest` strings in `composer.lock` are other packages' transitive constraints). `php artisan test` is the canonical command and stays correct if Pest is added later. Frontend (Vitest) and E2E (Playwright) suites are **not wired yet** — they are the current migration target (below); the `sail npm run test` / `npm run test:e2e` commands the skills mention will fail until that tooling lands.

### Quality

Use the `validate-code` skill — it detects the touched side(s) and runs the right tools through Sail:

- After **every** code change: run `validate-code` and fix everything until it passes.
- Before proposing a PR: run `validate-code` with `--full` (adds the test suites of the touched sides).

Underlying tools if you need one directly: `sail php ./vendor/bin/pint` (formatter, default Laravel preset — no `pint.json`, so `strict_types` is **not** enforced), `sail php ./vendor/bin/phpstan analyse` (larastan, **level max**), `sail npm run format` / `lint` (prettier / eslint), `sail npm run types` (`tsc --noEmit`). `composer check:ci` chains all five non-test checks.

## Agent rules

- Never create commits or push without explicit approval. Never push directly to `develop`.
- Use the `prepare-commit` skill to structure commit messages before requesting approval.
- Never mention the agent in commits, comments or project messages.
- Read and modify any file inside this repository without asking; never read or modify files outside it without approval.
- Refactor first: check whether the structure needs cleanup before adding a feature, and do that refactor as an isolated step.
- On GitHub issues: ignore label `deferred`, prioritize label `bug`.
- Prefer shadcn/ui for frontend components.

## Commit format

```text
<type>(<scope>): <description>
```

`type` required; `scope` optional but use the most specific available (module, component, page, service). Description: lowercase, imperative, brief, no trailing period. Types: `feat`, `fix`, `refactor`, `perf`, `docs`, `test`, `style` (formatting, not CSS), `build`, `ci`, `chore`.

## Git & CI workflow

- PRs target `develop` and merge with **squash**; never reuse a merged branch.
- Releases `develop → main` use a **merge commit** (never squash — a squashed release causes recurring main/develop conflicts).
- Both `develop` and `main` receive PRs; CI runs on PRs to either.

**Migration in progress** — bringing CI to parity with fototobares. Done: shared composite actions `.github/actions/setup-php` / `setup-node` (single source of the PHP 8.4 / Node 22 versions); `code-quality.yml` split into `quality_backend` (Pint + PhpStan) and `quality_frontend` (Prettier + ESLint + tsc); `tests.yml` with `tests_backend` (`php artisan test`). Pending: `tests_frontend` (Vitest) and `e2e` (Playwright) jobs. Renaming a CI job means updating the branch rulesets or PRs get blocked.

## Architecture

### Request flow (Inertia)

Controller returns `Inertia::render('page/path', [...props])` → the matching page in `resources/js/pages/` receives the props. `routes/web.php` mounts the backoffice under `routes/backoffice/{app,auth,settings}.php`; those controllers live in `App\Http\Controllers\Backoffice\` (auth/settings are the stock starter-kit ones). Props shared with **every** page (auth user, app name, flash `message`, Ziggy routes) are defined in `app/Http/Middleware/HandleInertiaRequests::share()`.

### Backend layering (target discipline)

Aim for: thin controller (`app/Http/Controllers/Backoffice/`) → dedicated `FormRequest` (`app/Http/Requests/`) → Action/Service → API Resource (`app/Http/Resources/`) → Inertia page.

- **Thin controllers**: routing, authorization, responses only. No business logic. Never `$request->validate()` — always inject a FormRequest (see `PatientController`, which injects `PaginatedPatientsRequest` and returns a `PatientResource` collection).
- **Actions/Services**: business logic in single-responsibility classes. There is no `app/Actions` / `app/Services` yet — create them when logic outgrows a controller rather than fattening the controller.
- **Thin models**: relations, casts, basic scopes only; Resources do the data shaping (e.g. `PatientResource` formats `dob` to a Spanish date string). Models carry `@property-read` docblocks to satisfy phpstan level max.
- `Model::shouldBeStrict()` **and** `Model::unguard()` are active (`AppServiceProvider`): lazy loading **throws**, so every Resource must eager-load what it serializes; and mass-assignment guarding is off, so `$fillable` is unnecessary. (A route-smoke test that catches missing eager-loads is part of the test migration.)
- Roles exist twice — the unbacked enum `App\Enums\Role` (`Administrador`, `Profesional`, `Secretaria`) and a DB-backed `Role` model + `roles`/`role_user` tables (seeded via data migrations). Route-level role enforcement is not wired yet.

### The pagination / search / sort pattern (core reusable convention)

New index screens follow the pattern established by patients — it spans both sides:

**Backend** — `App\Http\Requests\PaginatedRequest` is a generic FormRequest (`@template TColumn`) validating `sort_column`, `sort_order`, `filter`, `page`, `per_page` with defaults (`name`/`asc`, empty filter, 15 per page). Subclass per resource and declare allowed columns, e.g. `PaginatedPatientsRequest extends PaginatedRequest<"name">`. The controller reads `$request->validated()`, builds the `where`/`orderBy`/`paginate` query, and returns a `JsonResource` collection.

**Frontend** — `lib/services/table.ts` (`table.search()` / `table.sort()` mutate URL query params and re-fetch via the Inertia `router` with `preserveState`), `features/searchbar.tsx` (500ms-debounced input → `table.search`), `features/pagination-nav.tsx` (renders the paginator `meta.links`). Pages type props with `Paginated<T>` (`types/index.d.ts`) and highlight matches via `<TableCell highlight={filter}>` (`components/highlightable.tsx`).

### Frontend structure

- `resources/js/pages/<module>/`: only Inertia entrypoints (`index.tsx`, `create.tsx`, `edit.tsx`, `show.tsx`); everything else goes in local `components/`, `hooks/`, `tests/` folders.
- `components/ui/`: generic headless primitives (shadcn style — regenerate via `components.json`, don't hand-edit). `components/` root: shared atomic components, no domain/layout awareness. `features/`: shared composed components with domain/layout awareness. Global infra: `layouts/`, `hooks/`, `lib/` (helpers + Inertia interaction services), `types/` (`.d.ts` only; `entities.d.ts` mirrors the backend models and must be kept in sync). `@/*` maps to `resources/js/*`.
- Components stay presentational; business logic, state and navigation live in hooks/services, not the JSX. Aim for ~250 lines per file, ~150 per component — refactor before adding logic. Prefer dedicated components over over-parametrized reusable ones.
- Styling: Tailwind utilities inside components; `resources/css/app.css` is the only stylesheet. `resources/views/` holds only `app.blade.php` — no Blade views.
- **No page-level horizontal scroll, on any viewport** (the layout must hold from 320px up): wide content scrolls inside its own `overflow-auto` wrapper or wraps (`flex-wrap`); mind `min-w-0` on flex items. Known smell: `grid gap-* xl:grid-cols-*` without an explicit `grid-cols-1` base (an implicit track sizes to min-content and a deep `whitespace-nowrap` leaks through). Probe suspect pages at 320 / 351 / 390px.

### E2E suite (target design)

To mirror fototobares once Playwright lands: `workers: 1` against a single freshly-seeded DB per run; a setup project resets the DB (`migrate:fresh --seed`) and logs in (`storageState`); specs mutate **disjoint** demo records; local vs CI parametrized via `E2E_ARTISAN` / `E2E_BASE_URL`. The copied `verify` skill still documents fototobares-specific e2e gotchas (orders/tracking/cmdk) — treat those as a template to adapt, not as facts about clini.

## Session docs (local only)

`.claude/docs/` is gitignored (only `.claude/skills/` and `.claude/settings.json` are tracked). If `.claude/docs/status.md` exists, **read it at session start** — it is the living record of project status, recent decisions and pending work; append a dated entry as work progresses.
