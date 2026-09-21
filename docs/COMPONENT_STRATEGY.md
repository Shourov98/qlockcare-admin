# Admin Dashboard Component Strategy

## Purpose

Keep the dashboard modular as APIs evolve. A component is not removed solely
because the current page does not import it. Component boundaries make domain
ownership clear, keep pages small, and let an API-backed flow replace a mock
implementation without rebuilding the screen structure.

## Ownership Boundaries

- `app/**/page.tsx`: route composition, page-level navigation, and URL state.
- `components/<domain>/*`: domain UI, domain types, request state, and actions.
- `components/common/*`: shared, domain-neutral controls only.
- `components/<domain>/api.ts`: typed API calls and response mapping.
- `lib/api.ts`: authentication, transport, error envelopes, and retry behavior.

Pages should compose domain components. They should not duplicate table rows,
modal forms, API mapping, or status-label logic from those components.

## Component Rules

1. Keep a component when it represents a meaningful domain action or view,
   even if a feature is currently disabled or waiting for a backend endpoint.
2. Prefer a small presentational component plus a typed container or hook over
   one large page component.
3. Props must use explicit exported types. Do not use `any` for API data,
   modal records, event payloads, or chart callbacks.
4. A disabled or deferred action must explain its unavailable dependency in the
   UI. It must not appear functional while calling a mock or missing endpoint.
5. Use existing components as the migration target when replacing mock data;
   replace the data source and action handlers, not the component boundary.
6. Remove a component only after all of these are true:
   - its domain workflow was intentionally retired;
   - no active route, test, story, or planned API contract uses it;
   - its replacement is documented in the same change;
   - the removal is explicitly approved in the task.

## API Integration Pattern

For each domain component:

1. Define the backend response and input types in the domain API module.
2. Convert backend field names to stable UI names in one mapper.
3. Render loading, empty, error, and success states in the component.
4. Keep mutations inside a named handler and refresh only the affected query.
5. Use platform roles/scopes to hide or disable mutations the current user
   cannot perform.
6. Keep audit-sensitive mutations explicit and backed by an API endpoint.

## Billing Example

- `PlatformBillingTable` owns Stripe-object search, filters, cursor pagination,
  detail loading, invoice links, and price actions.
- `PlatformSubscriptionsTable` owns lifecycle, trial, renewal, and payment
  status presentation.
- The billing route only selects the active tab and composes these components.
- Legacy billing modal components remain separate units until their workflows
  are either integrated or explicitly retired. They must not be deleted merely
  to satisfy lint.

## Lint And Refactor Policy

1. Fix real issues first: explicit types, unused imports, unsafe state flow,
   inaccessible controls, and incorrect data contracts.
2. For a valid remote-loading or modal-initialization effect that conflicts
   with a React compiler lint rule, use a file-local documented suppression.
   Never disable the rule globally.
3. Avoid broad rewrites during an integration task. Keep edits scoped to the
   owning domain and preserve the existing visual design.
4. `npm run lint`, `npx tsc --noEmit`, and `npm run build` are the completion
   checks. A build blocked by an external font/network dependency must be
   reported separately from application failures.

## Migration Checklist

- [ ] Identify the component's backend API and authorization requirement.
- [ ] Add or update explicit API and UI types.
- [ ] Wire real data while preserving the existing component interface.
- [ ] Replace mock handlers with backend mutations only when the endpoint is
      available and audited where required.
- [ ] Verify loading, empty, error, permission, and success states.
- [ ] Run focused lint and TypeScript checks.
- [ ] Run the full dashboard lint before merging.
- [ ] Document any intentionally deferred workflow in the component comment or
      task tracker.
