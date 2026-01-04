# Implementation Plan: TanStack Form Migration

## Overview

This implementation plan migrates the portfolio application from react-hook-form to TanStack Form. The approach is incremental: migrate each form hook, update consuming components, then remove legacy dependencies.

## Tasks

- [x] 1. Migrate useContactForm hook to TanStack Form
  - [x] 1.1 Refactor useContactForm to use TanStack Form's useForm hook
    - Replace react-hook-form imports with @tanstack/react-form
    - Configure useForm with defaultValues, validators (Zod schema), and onSubmit
    - Maintain existing return interface (formData, errors, submitStatus, etc.)
    - Keep agreedToTerms and showPrivacy as separate useState
    - Implement progress computation as useMemo based on form state
    - _Requirements: 2.1, 2.4, 3.1-3.10_

  - [x] 1.2 Write property tests for useContactForm
    - **Property 1: Form value updates on change**
    - **Property 2: Validation triggers on blur**
    - **Property 7: Progress computation**
    - **Property 10: Required fields validation**
    - **Property 12: Zod schema round-trip**
    - **Validates: Requirements 3.1, 3.2, 3.10, 7.2, 6.6**

- [x] 2. Update ContactForm component to use TanStack Form patterns
  - [x] 2.1 Refactor ContactForm to use form.Field components
    - Replace direct formData access with form.Field render props
    - Wire field.state.value, field.handleChange, field.handleBlur to inputs
    - Use form.Subscribe for canSubmit and isSubmitting state
    - Apply data-invalid attribute based on field.state.meta.errors
    - Display errors using FieldError component
    - _Requirements: 5.1, 5.2, 5.3, 5.5, 5.6, 7.1-7.10_

  - [x] 2.2 Write property tests for ContactForm field integration
    - **Property 5: Error state attribute**
    - **Property 6: Error message display**
    - **Property 11: Submit button disabled state**
    - **Validates: Requirements 5.1, 5.5, 5.6, 7.10**

- [x] 3. Checkpoint - Verify contact form migration
  - Ensure all tests pass, ask the user if questions arise.
  - Manually test contact form in browser
  - Verify form submission works end-to-end

- [x] 4. Migrate useBlogPostForm hook to TanStack Form
  - [x] 4.1 Refactor useBlogPostForm to use TanStack Form's useForm hook
    - Replace react-hook-form imports with @tanstack/react-form
    - Configure useForm with defaultValues from post parameter
    - Pass blogPostFormSchema to validators.onChange
    - Implement handleTitleChange using form.setFieldValue for slug auto-generation
    - Implement addKeyword/removeKeyword using form array methods
    - Implement toggleTag for tag selection
    - Keep selectedTags, newKeyword, previewMode as separate useState
    - _Requirements: 2.2, 2.4, 4.1-4.10_

  - [x] 4.2 Write property tests for useBlogPostForm
    - **Property 3: Valid submission calls handler**
    - **Property 4: Invalid submission shows errors**
    - **Property 8: Slug generation**
    - **Property 9: Array field operations**
    - **Property 13: Form reset after success**
    - **Property 14: Default values population**
    - **Validates: Requirements 4.2, 4.3, 4.5, 4.6, 4.7, 3.6, 4.4**

- [x] 5. Checkpoint - Verify blog post form migration
  - Ensure all tests pass, ask the user if questions arise.
  - Note: Blog post form may not have a UI component currently in use

- [x] 6. Remove legacy react-hook-form dependencies
  - [x] 6.1 Delete src/components/ui/form.tsx (legacy react-hook-form component)
    - Remove the file entirely
    - _Requirements: 8.1_

  - [x] 6.2 Remove react-hook-form and @hookform/resolvers from package.json
    - Run: bun remove react-hook-form @hookform/resolvers
    - Verify no import errors in codebase
    - _Requirements: 1.1, 1.2, 1.3, 1.4_

  - [x] 6.3 Verify no remaining react-hook-form imports
    - Search codebase for any remaining imports
    - Fix any missed references
    - _Requirements: 1.3, 1.4, 8.2_

- [x] 7. Final checkpoint - Full verification
  - Ensure all tests pass, ask the user if questions arise.
  - Run full test suite: bun run test:run
  - Run type check: bun run type-check
  - Run lint: bun run lint
  - Verify application builds: bun run build

## Notes

- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties
- Unit tests validate specific examples and edge cases
- The blog post form hook exists but may not have an active UI component using it
