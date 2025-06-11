# TanStack Query Migration & Enhancement Plan

This document outlines the project to migrate and enhance the application to use TanStack Query as the single unified API layer and data source for client-side operations.

## I. Core Migration (Completed)

This phase focused on establishing TanStack Query, replacing `axios`, and refactoring key components that perform data fetching or mutations.

*   **[x] Initial Setup & Axios Replacement:**
    *   **[x] Verify/Install `@tanstack/react-query`:** Already a dependency.
    *   **[x] Replace `axios` with `fetch`:**
        *   **File:** `lib/api.ts`
        *   **Status:** Completed. `axios` calls replaced with a `fetchData` helper.
    *   **[x] Uninstall `axios`:**
        *   **Status:** Completed.
*   **[x] Implement Global `QueryClientProvider`:**
    *   **File:** `components/providers/client-components-provider.tsx`
    *   **Status:** Completed. `QueryClientProvider` and `ReactQueryDevtools` (dev only) added.
    *   **[x] Install `@tanstack/react-query-devtools`:**
        *   **Status:** Completed.
*   **[x] Refactor Client-Side Mutations:**
    *   **[x] `components/ui/contact-form-server-action.tsx`:**
        *   **Action:** Calls `submitContactForm` Server Action.
        *   **Status:** Refactored to use `useMutation`.
    *   **[x] `components/ui/contact-form.tsx`:**
        *   **Action:** `POST` to `/api/contact` via `fetch`.
        *   **Status:** Refactored to use `useMutation` with `sendContactForm` from `lib/api.ts`.
    *   **[x] `app/resume/resume-download.tsx`:**
        *   **Action:** Handles resume download (API call or direct file).
        *   **Status:** Refactored to use `useMutation`.
*   **[x] Review Existing `useQuery` Usage:**
    *   **File:** `hooks/use-projects.ts`
    *   **Status:** Reviewed. Existing usage is sound and now leverages `fetch` via `lib/api.ts`.
*   **[x] Strategic Exclusions:**
    *   **File:** `components/ui/web-vitals.tsx`
    *   **Reason:** `navigator.sendBeacon` with `fetch` fallback is more appropriate for analytics.
    *   **Status:** No changes made, decision documented.

## II. SSR/RSC Hydration & Client-Side Enhancement (Next Steps)

This phase focuses on integrating TanStack Query with Next.js App Router's Server Components for optimal data flow and client-side reactivity.

*   **[ ] Implement Hydration for Project List Page:**
    *   **Server Component:** `app/projects/page.tsx`
        *   **Task:** Modify to use `new QueryClient()`, `prefetchQuery({ queryKey: ['projects'], queryFn: getProjects })`, and `HydrationBoundary` with `dehydrate`.
    *   **Client Component:** Create `components/projects/projects-client-boundary.tsx`
        *   **Task:** This component will use `useProjects()` hook to consume hydrated data and render `ProjectFiltersEnhanced` and other client-side elements.
    *   **Status:** To Do
*   **[ ] Implement Hydration for Individual Project Pages:**
    *   **Server Component:** `app/projects/[slug]/page.tsx`
        *   **Task:** Modify to use `new QueryClient()`, `prefetchQuery({ queryKey: ['projects', params.slug], queryFn: () => getProject(params.slug) })`, and `HydrationBoundary` with `dehydrate`.
    *   **Client Component:** Create `components/projects/project-detail-client-boundary.tsx`
        *   **Task:** This component will use `useProject(slug)` hook to consume hydrated data and render the project details.
    *   **Status:** To Do

## III. Advanced Features & Best Practices (Ongoing / Future)

This phase involves leveraging more advanced TanStack Query features and establishing best practices.

*   **[ ] Proactive Prefetching:**
    *   **Task:** Identify key navigation paths (e.g., project links) and implement `queryClient.prefetchQuery` on hover or other appropriate triggers.
    *   **Example:** Prefetch individual project data from project list page.
    *   **Status:** To Do
*   **[ ] Standardize Query Keys with Factories:**
    *   **Task:** Create `lib/queryKeys.ts` (or similar) to define and export type-safe query key factory functions (e.g., `projectKeys.detail(id)`).
    *   **Task:** Update all `useQuery` and `useMutation` calls, and `queryClient` interactions to use these factories.
    *   **Status:** To Do
*   **[ ] Review and Refine Caching Strategies (`staleTime`, `gcTime`):**
    *   **Task:** Evaluate default and per-query caching configurations based on data volatility.
    *   **Status:** To Do
*   **[ ] Explore Optimistic Updates:**
    *   **Task:** For any new or existing interactive features that modify data, consider implementing optimistic updates for improved UX.
    *   **Status:** To Do (as features arise)
*   **[ ] Enhance Global Error/Loading UI:**
    *   **Task:** Consider global loading indicators (`useIsFetching`, `useIsMutating`).
    *   **Task:** Standardize error display from query/mutation states.
    *   **Status:** To Do
*   **[ ] Data Transformation with `select`:**
    *   **Task:** Where applicable, use the `select` option in `useQuery` for memoized data transformations.
    *   **Status:** To Do (as needed)

## IV. General Code Review & Cleanup (Ongoing)

*   **[ ] Review Other Components for `fetch` / Server Action Usage:**
    *   **Task:** Systematically review any remaining components, especially in `components/` and `app/`, for direct data fetching or Server Action calls from Client Components that could be migrated to TanStack Query hooks.
    *   **Status:** To Do
*   **[ ] Documentation & Team Onboarding:**
    *   **Task:** Ensure patterns are documented and understood by the team.
    *   **Status:** To Do

This document will be updated as tasks are completed.
