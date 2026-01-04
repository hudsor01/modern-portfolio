# Requirements Document

## Introduction

This document specifies the requirements for migrating the portfolio application from react-hook-form (with @hookform/resolvers) to TanStack Form (@tanstack/react-form). The migration aims to modernize the form handling infrastructure while maintaining existing functionality, improving type safety, and aligning with the latest library conventions.

The project currently uses:

- Zod v4 for schema validation (with v4 syntax like `z.email()` instead of `z.string().email()`)
- shadcn/ui Field components (`Field`, `FieldLabel`, `FieldDescription`, `FieldError`, `FieldGroup`)
- TanStack Query for data fetching (already installed)

## Glossary

- **TanStack_Form**: A headless, type-safe form library for React that provides form state management via `useForm` hook and `form.Field` component pattern
- **Form_State**: The current values, validation status, touched fields, and submission metadata managed by TanStack Form
- **Field_API**: The TanStack Form field interface providing `state.value`, `state.meta.errors`, `handleChange`, `handleBlur` methods
- **Zod_v4**: The latest version of Zod with top-level format validators (`z.email()`, `z.url()`) and improved tree-shaking
- **Standard_Schema**: The validation specification that TanStack Form uses to integrate with Zod schemas directly via `validators.onChange`
- **Contact_Form**: The form on the contact page for users to send messages (name, email, company, phone, message fields)
- **Blog_Post_Form**: The form for creating and editing blog posts with complex fields including arrays, dates, and enums
- **Field_Component**: The shadcn/ui `Field` component that groups form field elements with consistent styling
- **FieldLabel_Component**: The shadcn/ui `FieldLabel` component for accessible form labels
- **FieldError_Component**: The shadcn/ui `FieldError` component that displays validation error messages
- **FieldDescription_Component**: The shadcn/ui `FieldDescription` component for field help text
- **Form_Hook**: A custom React hook that wraps `useForm` from TanStack Form with application-specific defaults and validation
- **form.Field_Component**: The TanStack Form `form.Field` component that provides field state and handlers to child render functions

## Requirements

### Requirement 1: Remove react-hook-form Dependencies

**User Story:** As a developer, I want to remove react-hook-form and @hookform/resolvers from the project, so that the codebase uses a single form library.

#### Acceptance Criteria

1. WHEN the migration is complete, THE Package_Manager SHALL have react-hook-form removed from dependencies
2. WHEN the migration is complete, THE Package_Manager SHALL have @hookform/resolvers removed from dependencies
3. WHEN the migration is complete, THE Codebase SHALL contain no imports from react-hook-form
4. WHEN the migration is complete, THE Codebase SHALL contain no imports from @hookform/resolvers

### Requirement 2: Use TanStack Form useForm Hook Directly

**User Story:** As a developer, I want to use TanStack Form's `useForm` hook directly in form hooks, so that the implementation remains simple and easy to understand for a project with few forms.

#### Acceptance Criteria

1. THE Contact_Form_Hook SHALL use `useForm` from @tanstack/react-form directly
2. THE Blog_Post_Form_Hook SHALL use `useForm` from @tanstack/react-form directly
3. THE form hooks SHALL compose with existing shadcn/ui Field components (Field, FieldLabel, FieldError, FieldDescription)
4. THE form hooks SHALL pass Zod schemas to `validators.onChange` for validation
5. THE form hooks SHALL return the form instance for use in components via `form.Field` and `form.Subscribe`
6. THE form components SHALL manually wire `field.state.value`, `field.handleChange`, `field.handleBlur` to inputs

### Requirement 3: Migrate Contact Form Hook

**User Story:** As a developer, I want the contact form hook to use TanStack Form, so that form state management is consistent across the application.

#### Acceptance Criteria

1. WHEN a user types in a contact form field, THE Contact_Form SHALL update the field value via `field.handleChange`
2. WHEN a user leaves a field (blur), THE Contact_Form SHALL trigger validation via `field.handleBlur`
3. WHEN a user submits the contact form with valid data, THE Contact_Form SHALL call the `onSubmit` handler with form values
4. WHEN a user submits the contact form with invalid data, THE Contact_Form SHALL display validation errors from `field.state.meta.errors`
5. WHILE the form is submitting, THE Contact_Form SHALL expose `isSubmitting` state via `form.Subscribe`
6. WHEN submission succeeds, THE Contact_Form SHALL reset to initial state via `form.reset()`
7. IF submission fails, THEN THE Contact_Form SHALL preserve form values and display an error message
8. THE Contact_Form SHALL validate using the existing `contactFormSchema` from unified-schemas with Zod v4 syntax
9. THE Contact_Form SHALL track `agreedToTerms` state for privacy policy checkbox
10. THE Contact_Form SHALL compute form completion `progress` as a derived value

### Requirement 4: Migrate Blog Post Form Hook

**User Story:** As a developer, I want the blog post form hook to use TanStack Form, so that complex form state is managed consistently.

#### Acceptance Criteria

1. WHEN a user edits a blog post field, THE Blog_Post_Form SHALL update the field value via `field.handleChange`
2. WHEN a user submits the blog post form with valid data, THE Blog_Post_Form SHALL provide validated form values to `onSubmit`
3. WHEN a user submits the blog post form with invalid data, THE Blog_Post_Form SHALL display validation errors
4. WHEN initializing with existing post data, THE Blog_Post_Form SHALL populate `defaultValues` with the provided values
5. WHEN the title changes and slug is empty, THE Blog_Post_Form SHALL auto-generate a slug using `form.setFieldValue`
6. WHEN managing keywords array, THE Blog_Post_Form SHALL support adding/removing items via `form.pushFieldValue` and `form.removeFieldValue`
7. WHEN managing tags, THE Blog_Post_Form SHALL track selected tag IDs as an array field
8. THE Blog_Post_Form SHALL validate using the existing `blogPostFormSchema` with Zod v4 syntax
9. THE Blog_Post_Form SHALL support date fields for `publishedAt` and `scheduledAt`
10. THE Blog_Post_Form SHALL support enum fields for `status` and `contentType`

### Requirement 5: Update Form UI Component Integration

**User Story:** As a developer, I want the existing shadcn/ui Field components to work seamlessly with TanStack Form, so that I can build forms with consistent styling and behavior.

#### Acceptance Criteria

1. THE Field_Component SHALL wrap form field groups with `data-invalid` attribute when field has errors
2. THE FieldLabel_Component SHALL associate with form controls via `htmlFor` attribute
3. THE FieldError_Component SHALL display errors from `field.state.meta.errors` array
4. THE FieldDescription_Component SHALL provide accessible descriptions via `aria-describedby`
5. WHEN a field has validation errors, THE Field_Component SHALL apply `data-invalid="true"` for error styling
6. WHEN a field is touched and invalid, THE FieldError_Component SHALL render the first error message
7. THE Form components SHALL support both `orientation="vertical"` and `orientation="horizontal"` layouts

### Requirement 6: Maintain Zod v4 Schema Validation

**User Story:** As a developer, I want to continue using Zod v4 schemas for validation, so that validation logic remains consistent and type-safe.

#### Acceptance Criteria

1. THE Contact_Form SHALL validate using the existing `contactFormSchema` from unified-schemas
2. THE Blog_Post_Form SHALL validate using the existing `blogPostFormSchema`
3. WHEN Zod validation fails, THE Form SHALL display errors via `field.state.meta.errors`
4. THE Zod schemas SHALL use v4 syntax with top-level validators (`z.email()`, `z.url()`) where applicable
5. THE Form SHALL pass Zod schemas directly to `validators.onChange` using Standard Schema integration
6. FOR ALL valid form values, parsing through Zod schema SHALL produce type-safe output matching `z.infer<typeof schema>`

### Requirement 7: Preserve Existing Form Behavior and UX

**User Story:** As a user, I want the forms to work the same way after the migration, so that my experience is not disrupted.

#### Acceptance Criteria

1. THE Contact_Form SHALL display the same fields: name, email, company, phone, message
2. THE Contact_Form SHALL require name, email, and message fields (marked with asterisk)
3. THE Contact_Form SHALL display a privacy policy checkbox that must be checked before submission
4. THE Contact_Form SHALL show a character count for the message field (current/max)
5. THE Contact_Form SHALL display success message after successful submission
6. THE Contact_Form SHALL display error message after failed submission
7. WHEN the contact form submits successfully, THE Contact_Form SHALL reset all fields to empty
8. THE Blog_Post_Form SHALL support all existing field types including dates, arrays, and enums
9. THE Contact_Form SHALL display field icons (User, Mail, Building2, Phone, MessageSquare) in input fields
10. THE Contact_Form SHALL disable submit button while `isSubmitting` or when terms not agreed

### Requirement 8: Remove Legacy Form Component

**User Story:** As a developer, I want to remove the legacy react-hook-form based Form component, so that the codebase has a single form implementation.

#### Acceptance Criteria

1. WHEN the migration is complete, THE Codebase SHALL remove `src/components/ui/form.tsx` (react-hook-form version)
2. WHEN the migration is complete, THE Codebase SHALL have no components importing from the legacy form.tsx
3. THE new form implementation SHALL use shadcn/ui Field components from `src/components/ui/field.tsx` directly
4. THE form hooks SHALL remain in their existing locations (`src/hooks/use-contact-form.ts`, `src/hooks/use-blog-post-form.ts`)
